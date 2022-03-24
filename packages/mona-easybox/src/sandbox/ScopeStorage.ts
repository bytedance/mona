class ScopeStorage {
  scope: string;
  storage: Storage;

  constructor(scope: string, storage: Storage) {
    this.scope = `_mona_storage_${scope}`;
    this.storage = storage;
  }

  private _filterItemKeys() {
    return Object.keys(this.storage).filter(key => key.startsWith(this.scope));
  }

  get length() {
    return this._filterItemKeys().length;
  }

  key(nth: number) {
    const key = this._filterItemKeys()[nth];
    return key ? key.substring(this.scope.length) : null;
  }

  getItem(key: string) {
    return this.storage.getItem(`${this.scope}${key}`);
  }
  
  setItem(key: string, value: string) {
    return this.storage.setItem(`${this.scope}${key}`, value);
  }

  removeItem(key: string) {
    return this.storage.removeItem(`${this.scope}${key}`);
  }

  clear() {
    this._filterItemKeys().forEach(key => {
      this.storage.removeItem(key);
    })
  }
}

export default ScopeStorage;