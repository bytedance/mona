import { SandboxOptions } from '@/sandbox';
import MemoryHistory from './MemoryHistory';
import MemoryLocation from './MemoryLocation';
import { interceptNavigation, processedListener } from './utils';

type Listener = EventListenerOrEventListenerObject;
type Opts = boolean | AddEventListenerOptions;


const rawWindow = window;
const rawAddEventListener = window.addEventListener;
const rawRemoveEventListener = window.removeEventListener;

class RouteSandbox {
  public history: MemoryHistory;
  public location: MemoryLocation;
  private options: SandboxOptions;

  // 事件函数记录
  private _eventListener: { [key: string]: EventListener } = {};

  constructor(options: SandboxOptions) {
    this.history = new MemoryHistory({ entryPath: options.entryPath });
    this.location = new MemoryLocation(this.history);
    this.options = options;
  }

  static needHandleEventListener(type: string) {
    return ['hashchange', 'popstate'].indexOf(type) !== -1;
  }

  addListener(type: string, listener: Listener, options?: Opts) {
    if (RouteSandbox.needHandleEventListener(type)) {
      this.history.eventEmitter.on(type, processedListener(listener), rawWindow);
    } else {
      rawAddEventListener.call(rawWindow, type, listener, options,);
    }
  }

  removeListener(type: string, listener: Listener, options?: Opts) {
    if (RouteSandbox.needHandleEventListener(type)) {
      this.history.eventEmitter.off(type, processedListener(listener));
    } else {
      rawRemoveEventListener.call(rawWindow, type, listener, options);
    }
  }

  open(href?: string) {
    if (!href) {
      return;
    }
    if (interceptNavigation(this.options.navigation ?? {}, href)) {
      rawWindow.open(href);
      return;
    }
    this.history.openPage(href, true);
  }

  // 修改location相当于修改location.href
  private _setLocation(value: any) {
    // 只有string才是有效值
    if (typeof value === 'string') {
      this.location.href = value;
      return true;
    }
    return false;
  }

  private _eventProxy(e: Event) {
    return this._eventListener[e.type](e);
  }

  static shouldProxyRouteSandbox(value: PropertyKey) {
    return (
      ['location', 'onpopstate', 'onhashchange'].indexOf(value as string) !== -1
    );
  }

  // 处理数据赋值情况
  // 1. locaiton
  // 2. onhashchange
  // 3. onpopstate
  setInSandbox(p: string, value: any) {
    if (p === 'location') {
      return this._setLocation(value);
    } else if (p === 'onpopstate') {
      if (typeof value === 'function') {
        this.addListener('popstate', this._eventProxy);
      } else {
        this.removeListener('popstate', this._eventProxy);
      }
      return true;
    } else if (p === 'onhashchange') {
      if (typeof value === 'function') {
        this.addListener('popstate', this._eventProxy);
      } else {
        this.removeListener('popstate', this._eventProxy);
      }
      return true;
    }
    return false;
  }
}

export default RouteSandbox;