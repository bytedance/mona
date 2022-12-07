import { BaseApis, OriginApis } from "@bytedance/mona";

const __MONA_APPID = '';

export const maxRequest: OriginApis['request'] = function(options) {
  lynx.request({
    url: options.url,
    method: options.method,
    headers: options.header,
    body: options.data,
  }).then((data: any) => {
    const res = {
       statusCode: 200,
       header: {},
       data,
       profile: {} as any
    }
    options.success?.(res);
  }).catch((err: Error) => {
    options.fail?.({ errMsg: err.message, errNo: '' });
  })

  // no RequestTask
  return {};
}

export const maxGetStorage: OriginApis['getStorage'] = function(options) {
  try {
    const res = lynx.getStorage({ key: options.key, unique: __MONA_APPID })
    const data = { data: res, errMsg: 'getStorage:ok' };
    options.success?.(data);
    options.complete?.(data);
  } catch(err: any) {
    const error = { errMsg: 'getStorage:fail' + err?.message ?? '' }
    options.fail?.(error);
    options.complete?.(error);
  }
}

export const maxGetStorageSync: BaseApis['getStorageSync'] = function(key) {
  return lynx.getStorage({ key, unique: __MONA_APPID });
}

export const maxSetStorage: OriginApis['setStorage'] = function (options) {
  try {
    lynx.setStorage({ key: options.key, unique: __MONA_APPID, data: options.data })
    options.success?.({ errMsg: 'setStorage:ok' })
    options.complete?.({ errMsg: 'setStorage:ok' })
  } catch(err: any) {
    const error = { errMsg: 'setStorage:fail' + err?.message ?? '' };
    options.fail?.(error)
    options.complete?.(error)
  }
}

export const maxSetStorageSync: BaseApis['setStorageSync'] = function(key, data) {
  return lynx.setStorage({ key, unique: __MONA_APPID, data })
}

export const maxRemoveStorage: OriginApis['removeStorage'] = function(options) {
  try {
    lynx.removeStorage({ key: options.key, unique: __MONA_APPID })
    options.success?.({ errMsg: 'removeStorage:ok' })
    options.complete?.({ errMsg: 'removeStorage:ok' })
  } catch(err: any) {
    const error = { errMsg: 'removeStorage:fail' + err?.message ?? '' };
    options.fail?.(error)
    options.complete?.(error)
  }
}

export const maxRemoveStorageSync: BaseApis['removeStorageSync'] = function(key) {
  lynx.removeStorage({ key, unique: __MONA_APPID });
}


export const maxNavigateTo: OriginApis['navigateTo'] = function(options) {
  try {
    lynx.navigateTo({ url: options.url })
    options.success?.({ errMsg: 'navigateTo:ok' })
    options.complete?.({ errMsg: 'navigateTo:ok' })
  } catch(err: any) {
    const error = { errMsg: 'navigateTo:fail' + err?.message ?? '' };
    options.fail?.(error)
    options.complete?.(error)
  }
}