import { JSAPI_PERMISSION_CACHE } from './constants';

const localStorageCache = {
  get: (key: string): string => localStorage.getItem(key) || '',
  set: (key: string, value: string): void => localStorage.setItem(key, value),
  remove: (key: string): void => localStorage.removeItem(key),
  clear: (): void => localStorage.clear(),
};

export const jsApiStorage = {
  get: (appid: string): string[] | null => {
    try {
      const data = localStorageCache.get(JSAPI_PERMISSION_CACHE);
      if (data) {
        return JSON.parse(data)?.[appid];
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  },
  set: (appid: string, value: string[]) => {
    try {
      let data = localStorageCache.get(JSAPI_PERMISSION_CACHE);
      let dataObj: { [key: string]: string[] };
      if (data) {
        // 有缓存
        dataObj = JSON.parse(data);
        dataObj[appid] = value;
      } else {
        //没有缓存
        dataObj = {};
        dataObj[appid] = value;
      }
      localStorageCache.set(JSAPI_PERMISSION_CACHE, JSON.stringify(dataObj));
    } catch (err) {
      console.log(err);
    }
  },
};
