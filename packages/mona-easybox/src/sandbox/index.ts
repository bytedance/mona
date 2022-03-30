import FakeWindowFactory from './FakeWindowFactory';
import ScopeStorage from './ScopeStorage';

interface SandboxOptions {
  storageScope: string;
}

class Sandbox {
  global: Window;
  options: SandboxOptions;

  constructor(options: SandboxOptions) {
    this.options = options;
    this.global = this.createProxyGlobal();
  }

  // ban web storage
  createProxyGlobal(): Window {
    const factory = new FakeWindowFactory(window);
    const origin = factory.createFakeWindow();

    // overrides
    const overrides: Record<string, any> = {
      document: this.createProxyDocument(origin.document),
      localStorage: new ScopeStorage(this.options.storageScope, origin.localStorage),
      sessionStorage: new ScopeStorage(this.options.storageScope, origin.sessionStorage),
      ...this.createEventListener(),
    };

    // handler
    const get = (obj: any, prop: string, receiver: any) => {
      console.log('prop', prop, Object.prototype.hasOwnProperty.call(obj, prop), obj[prop])
      return prop in overrides ? overrides[prop] : Reflect.get(obj, prop, receiver)
    };
    const set = Reflect.set;
    const defineProperty = Reflect.defineProperty;
    const deleteProperty = Reflect.deleteProperty;
    const handler = { get, set, defineProperty, deleteProperty }

    // proxy
    const proxy = new Proxy(origin, handler);
    const subProxy = new Proxy(origin, handler);

    proxy.self = subProxy;
    proxy.window = subProxy;
    proxy.globalThis = subProxy;
    proxy.top = window.top === window ? subProxy : window.top;
    proxy.parent = window.parent === window ? subProxy : window.top;
    
    return proxy;
  }

  createEventListener() {
    const rawAddEventListener = window.addEventListener;
    const rawRemoveEventListener = window.removeEventListener;
    return {
      addEventListener: (type: string, listener: any, options?: any) => rawAddEventListener.call(window, type, listener, options),
      removeEventListener: (type: string, listener: any, options?: any) => rawRemoveEventListener.call(window, type, listener, options)
    }
  }

  // ban document.cookie/document.title
  createProxyDocument(origin: Document): Document {
    const proxy = new Proxy(origin, {
      get(obj, prop) {
        if (prop === 'cookie') {
          console.warn("can't get cookie in app");
          return ''
        }
        return Reflect.get(obj, prop);
      },
      set(obj, prop, value) {
        if (prop === 'title') {
          console.warn("can't set title in app");
          return false;
        } else if (prop === 'cookie') {
          console.warn("can't set cookie in app");
          return false;
        }
        return Reflect.set(obj, prop, value);
      }
    })

    return proxy;
  }
}

export default Sandbox;