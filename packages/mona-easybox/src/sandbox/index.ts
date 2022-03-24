import ScopeStorage from './ScopeStorage';

interface SandboxOptions {
  storageScope: string;
}

class Sandbox {
  global: Window;
  options: SandboxOptions;

  constructor(options: SandboxOptions) {
    this.global = this.createProxyGlobal();
    this.options = options;
  }

  createProxyGlobal(): Window {
    const origin = window;
    const proxyDocument = this.createProxyDocument(origin.document);
    const proxyLocalStorage = new ScopeStorage(this.options.storageScope, origin.localStorage);
    const proxySessionStorage = new ScopeStorage(this.options.storageScope, origin.sessionStorage);
    const proxy = new Proxy(window, {
      get(obj, prop) {
        // handle self
        if (['self', 'globalThis', 'window'].indexOf(prop as string) !== -1) {
          return this;
        } else if (prop === 'document') {
          // handle document
          return proxyDocument;
        } else if (['localStorage', 'sessionStorage'].indexOf(prop as string) !== -1) {
          return prop === 'localStorage' ? proxyLocalStorage : proxySessionStorage;
        }
        return Reflect.get(obj, prop);
      }
    })
    return proxy;
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
          return;
        } else if (prop === 'cookie') {
          console.warn("can't set cookie in app");
          return;
        }
        return Reflect.set(obj, prop, value);
      }
    })

    return proxy;
  }
}

export default Sandbox;