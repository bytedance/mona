import MemoryHistory from "./MemoryHistory";

// PERF: 优化这里的代码
class MemoryLocation {
  private _history: MemoryHistory;
  private _reloadApp: () => void;
  get _currentURL() {
    return this._history.getURL();
  }

  // location属性
  // hash
  get hash() {
    return this._currentURL.hash;
  }
  set hash(value: string) {
    if (typeof value === 'string') {
      // 没有加#的hash自动加上#
      const hash = /^#/.test(value) ? value : `#${value}`;
      this._history.pushHash(hash);
      // 直接赋值hash不会进行应用的重载
    }
  }
  // host
  get host() {
    return this._currentURL.host;
  }
  set host(value: string) {
    // this._history.setURL('host', value);
    throw Error(`不允许进行host修改-${value}`);
  }
  // hostname
  get hostname() {
    return this._currentURL.hostname;
  }
  set hostname(value: string) {
    // this._history.setURL('hostname', value);
    throw Error(`不允许进行hostname修改-${value}`);
  }
  // href
  get href() {
    return this._currentURL.href;
  }
  set href(value: string) {
    this._history.setURL('href', value);
    this.reload();
  }
  // origin
  get origin() {
    return this._currentURL.origin;
  }
  set origin(value: string) {
    // this._history.setURL('origin', value);
    throw Error(`不允许进行origin修改-${value}`);
  }
  // pathname
  get pathname() {
    return this._currentURL.pathname;
  }
  set pathname(value: string) {
    this._history.setURL('pathname', value);
    this.reload();
  }
  // port
  get port() {
    return this._currentURL.port;
  }
  set port(value: string) {
    throw Error(`不允许进行port修改-${value}`);
  }
  // protocol
  get protocol() {
    return this._currentURL.protocol;
  }
  set protocol(value: string) {
    throw Error(`不允许进行protocol修改-${value}`);
  }
  // search
  get search() {
    return this._currentURL.search;
  }
  set search(value: string) {
    this._history.setURL('search', value);
    this.reload();
  }

  // location方法
  // assign与pushState类似
  assign(url: string) {
    this._history.pushState(null, '', url);
    this.reload();
  }
  // TODO: reload 这里先什么也不干，以后可以改为重新mount组件
  reload() {
    // DO NOTHING
    this._reloadApp();
  }
  // replace与replaceState类似
  replace(url: string) {
    this._history.replaceState(null, '', url);
    this.reload();
  }

  constructor(history: MemoryHistory) {
    this._history = history;
    this._reloadApp = () => window.location.reload();

    for(const property of ['hash', 'host', 'hostname', 'href', 'origin', 'pathname', 'port', 'protocol', 'search']) {
			const descriptor = Object.getOwnPropertyDescriptor(MemoryLocation.prototype, property);
			const modified_descriptor = Object.assign(descriptor, {enumerable: true});
			Object.defineProperty(this, property, modified_descriptor);
		}
  }
}

export default MemoryLocation;