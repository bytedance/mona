import { EasyboxOptions } from '..';
import FakeWindowFactory from './FakeWindowFactory';
import route from './modules/route';
import storage from './modules/storage';
import document from './modules/document';
import network from './modules/network';

import { bindContext, hasOwn } from './utils';
import RouteSandbox from './modules/route/RouteSandbox';

export type SandboxOptions = Required<EasyboxOptions>

const modules = [
  storage,
  route,
  document,
  network
]

class Sandbox {
  global: Window;
  options: SandboxOptions;
  overrides: Record<string, any>;

  constructor(options: SandboxOptions) {
    this.options = options;
    this.overrides = {
      // postMessage: window.postMessage.bind(window),
    }
    modules.forEach(module => {
      this.overrides = { ...this.overrides, ...module(this.options) };
    })
    this.global = this.createProxyGlobal();
  }

  // ban web storage
  createProxyGlobal(): Window {
    const selfKeys = ['self', 'window', 'globalThis', 'top', 'parent'];
    // set self keys can rewrite
    const factory = new FakeWindowFactory(window);
    const origin = factory.createFakeWindow((prop) => selfKeys.indexOf(prop) !== -1);
    
    // overrides
    const overrides = this.overrides;
    
    // handler
    const get = (obj: any, prop: PropertyKey, receiver: any) => {
      let value: any;
      if (prop === Symbol.unscopables) {
        return undefined;
      } else if (prop in overrides) {
        value = overrides[prop as string];
      } else if (hasOwn(obj, prop)) {
        value = Reflect.get(obj, prop, receiver) 
      } else {
        value = Reflect.get(window, prop);
      }

      return bindContext(value, window)
    };
    const set = (obj: any, prop: string, value: any, receiver: any) => {
      // console.log('set', obj, prop, value);
      // handle some location prop
      const routeSandbox = overrides['_routeSandbox'] as RouteSandbox;
      if (RouteSandbox.shouldProxyRouteSandbox(prop)) {
        return routeSandbox.setInSandbox(prop, value);
      }
      return Reflect.set(obj, prop, value, receiver);
    }
    const defineProperty = Reflect.defineProperty;
    const deleteProperty = Reflect.deleteProperty;
    const handler = { get, set, defineProperty, deleteProperty }

    // proxy
    const proxy = new Proxy(origin, handler);
    const subProxy = new Proxy(origin, handler);

    selfKeys.forEach(key => {
      proxy[key] = subProxy;
    })
    return proxy;
  }
}

export default Sandbox;