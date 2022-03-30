class FakeWindowFactory {
  private _target: Record<string, any>;
  private _storage: Record<string, any>;
  
  constructor(target: Window) {
    this._target = target;
    this._storage = Object.create(null);
  }

  private _hasOwn(target: any, prop: string) {
    return Object.prototype.hasOwnProperty.call(target, prop)
  }

  private _def(fakeWindow: Object, p: string) {
    const descriptor = Object.getOwnPropertyDescriptor(this._target, p);
      
    if (descriptor) {
      if (this._hasOwn(descriptor, 'get')) {
        descriptor.get = () => this._hasOwn(descriptor, p) ? this._storage[p] : this._target[p];
      }
      if (this._hasOwn(descriptor, 'set')) {
        descriptor.set = (value) => (this._storage[p] = value, true);
      }
      Object.defineProperty(fakeWindow, p, Object.freeze(descriptor));
    }
  }

  createFakeWindow() {
    const fakeWindow = {};
    const propMap: Record<string, boolean> = {};
    const propNames = Object.getOwnPropertyNames(this._target);

    propNames.forEach((p) => {
      propMap[p] = true;
      this._def(fakeWindow, p);
    });
    for (const p in this._target) {
      !propMap[p] && this._def(fakeWindow, p);
    }

    return fakeWindow as Window;
  }
}

export default FakeWindowFactory;