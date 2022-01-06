interface Listener {
  [key: string]: Function[]
}

const MONA_EVENTEMITTER_LISTENER = '__MONA_EVENTEMITTER_LISTENER';

class EventEmitter {
  listeners: Listener;

  constructor() {
    this.listeners = window[MONA_EVENTEMITTER_LISTENER] || {};
  }

  private _refreshListeners() {
    this.listeners = window[MONA_EVENTEMITTER_LISTENER] || {};
  }

  private _updateListeners(key: string, arr: Function[]) {
    this.listeners[key] = arr;
    window[MONA_EVENTEMITTER_LISTENER] = this.listeners 
  }

  on(key: string, listener: (...args: any) => void) {
    this._refreshListeners();
    const arr = this.listeners[key] || [];
    arr.push(listener);
    this._updateListeners(key, arr);
  }
  off(key: string, listener: (...args: any) => void) {
    this._refreshListeners();
    const arr = this.listeners[key] || [];
    const index = arr.indexOf(listener);
    if (index !== -1) {
      arr.splice(index, 1);
      this._updateListeners(key, arr);
    }
  }
  emit(key: string, ...args: any[]) {
    this._refreshListeners();
    const arr = this.listeners[key] || []; 
    console.log('run', key, arr)
    arr.forEach(listener => {
      if (typeof listener === 'function') {
        listener(...args);
      }
    })
  }
  clear() {
    this.listeners = window[MONA_EVENTEMITTER_LISTENER] = {};
  }
}

export default EventEmitter;