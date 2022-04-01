type Callback = (...args: any) => any;
interface InternalEvent<T> {
  callback: Callback;
  context: T;
}

class EventEmitter<T = any> {
  private _events: { [key: string]: InternalEvent<T>[] };
  constructor() {
    this._events = {};
  }

  // 订阅事件
  on(name: string, callback: Callback, context: T) {
    const listeners = this._events[name] ?? [];
    listeners.push({ callback, context });
    this._events[name] = listeners;
  }

  // 触发事件
  emit(name: string, ...params: any) {
    const listeners = this._events[name] ?? [];
    listeners.forEach((listener) => {
      const { callback, context } = listener;
      callback.apply(context, params);
    });
  }

  // 卸载事件
  off(name: string, callback: (...args: any) => any) {
    const listeners = this._events[name] ?? [];
    listeners.forEach((listener, idx) => {
      if (listener.callback === callback) {
        listeners.splice(idx, 1);
      }
    });
  }
}

export default EventEmitter;