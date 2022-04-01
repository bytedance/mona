import { hasOwn } from "./utils";

class FakeWindowFactory {
  private _target: Record<string, any>;
  private _storage: Record<string, any>;
  
  constructor(target: Window) {
    this._target = target;
    this._storage = Object.create(null);
  }

  private _def(fakeWindow: Object, p: string) {
    const descriptor = Object.getOwnPropertyDescriptor(this._target, p);
      
    if (descriptor) {
      if (descriptor.configurable) {
        if (hasOwn(descriptor, 'get')) {
          descriptor.get = () => hasOwn(descriptor, p) ? this._storage[p] : this._target[p];
        }
        if (hasOwn(descriptor, 'set')) {
          descriptor.set = (value) => (this._storage[p] = value, true);
        }
      }
      
      Object.defineProperty(fakeWindow, p, Object.freeze(descriptor));
    }
  }

  createFakeWindow(filter?: (prop: string) => boolean) {
    const fakeWindow = {};
    const propMap: Record<string, boolean> = {};
    const propNames = Object.getOwnPropertyNames(this._target);

    propNames.forEach((p) => {
      propMap[p] = true;
      typeof filter === 'function' ? !filter(p) && this._def(fakeWindow, p) : this._def(fakeWindow, p);
    });
    for (const p in this._target) {
      !propMap[p] && this._def(fakeWindow, p);
    }

    return fakeWindow as Window;
  }
}

export default FakeWindowFactory;