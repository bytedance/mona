import EventEmitter from "./EventEmitter";

interface HistoryItem {
  state: any;
  title: string;
  url: string;
}

function createURL(origin: string, path: string) {
  let currentUrl = path;
  if (/^\//.test(path)) {
    currentUrl = `${origin}${path}`;
  }
  return new URL(currentUrl);
}

const globalLocation = window.location;
class MemoryHistory {
  private _eventEmitter: EventEmitter;
  private _pos: number;
  private _origin: string;
  private _stack: HistoryItem[];
  private _onChangeCallback: () => void;

  get eventEmitter() {
    return this._eventEmitter;
  }

  // history长度
  get length() {
    return this._stack.length;
  }

  // 当前state
  get state() {
    return this._stack[this._pos]?.state ?? null;
  }

  constructor({ entryPath }: { entryPath: string }) {
    this._eventEmitter = new EventEmitter();
    this._pos = 0;
    this._origin = globalLocation.origin;
    this._stack = [{ title: '', state: null, url: entryPath }];
    this._onChangeCallback = () => {};
  }

  onChange(callback: () => void) {
    this._onChangeCallback = callback;
  }

  pushState(state: any, title: string, url: string) {
    // 重置stack，删除当前元素之后的元素
    this._stack.length = this._pos + 1;

    // 推入新的数据
    this._stack.push({
      title,
      state,
      url,
    });

    // 更新位置
    this._pos += 1;
    this._onChangeCallback();
  }

  replaceState(state: any, title: string, url: string) {
    this._stack[this._pos] = { title, state, url };
    this._onChangeCallback();
  }

  go(n: number) {
    if (n === 0) {
      // do nothing
      return;
    }
    const oldPos = this._pos;
    const newPos = oldPos + n;
    const maxPos = this._stack.length - 1;
    if (newPos < 0 || newPos > maxPos) {
      // 超出pos什么也不干，无效
      return;
    }
    // 更新位置
    this._pos = newPos;
    const current = this._stack[newPos];
    const old = this._stack[oldPos];

    // 触发hashchange
    if (
      createURL(this._origin, old.url).hash !==
      createURL(this._origin, current.url).hash
    ) {
      // TODO: 完善该对象
      const hashChangeEvent = new HashChangeEvent('hashchange', {
        oldURL: old.url,
        newURL: current.url,
      });
      this._eventEmitter.emit('hashchange', hashChangeEvent);
    }

    // 触发popstate
    // TODO: 完善该对象
    const popstateEvent = new PopStateEvent('popstate', {
      state: current.state,
    });

    this._eventEmitter.emit('popstate', popstateEvent);
    this._onChangeCallback()
  }

  back() {
    this.go(-1);
  }

  forward() {
    this.go(1);
  }

  // 解析URL供location使用
  getURL() {
    const currentUrl = this._stack[this._pos]?.url || '/';
    return createURL(this._origin, currentUrl);
  }
  
  setURL(key: Exclude<keyof URL, 'toString' | 'toJSON'>, value: string) {
    const url = this.getURL();
    // 当key为href时需要特殊处理
    if (key === 'href') {
      value = createURL(this._origin, value).href
    }
    if (key !== 'origin' && key !== 'searchParams') {
      url[key] = value;
    }
    // 更新url
    this._stack[this._pos].url = url.href;
  }

  // hash处理
  pushHash(hash: string) {
    const URL = this.getURL();
    URL.hash = hash;
    this.pushState(null, '', URL.href);
  }

  openPage(value: string, isNewWindow?: boolean) {
    let URLObj = this.getURL();
    const oldURL = URLObj.href;
    let isHash = false;

    // 如果是hash则触发hashchange
    if (/^#/.test(value)) {
      URLObj.hash = value;
      isHash = true;
    } else if (/^http/.test(value)) {
      URLObj = new URL(value);
    } else {
      const pathname = /^\//.test(value) ? value : `/${value}`;
      URLObj.pathname = pathname;
    }

    if (URLObj.origin !== this._origin) {
      console.error(
        `打开 ${value} 失败！不能在应用中打开非应用域的外链，请使用相对路径`,
      );
      return;
    }

    // 当本次与上次不相等时触发
    if (oldURL !== URLObj.href) {
      if (isNewWindow) {
        this.pushState(null, '', URLObj.href);
      } else {
        this.replaceState(null, '', URLObj.href);
      }

      if (isHash) {
        // TODO: 完善该对象
        const hashChangeEvent = new HashChangeEvent('hashchange', {
          oldURL,
          newURL: URLObj.href,
        });
        this._eventEmitter.emit('hashchange', hashChangeEvent);
      } else {
        const popstateEvent = new PopStateEvent('popstate', {
          state: this._stack[this._pos].state,
        });

        this._eventEmitter.emit('popstate', popstateEvent);
      }
    }
  }
}

export default MemoryHistory;