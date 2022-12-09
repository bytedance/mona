import { BaseApis, OriginApis } from "@bytedance/mona";

const __MONA_APPID = '';

const logNoImpl = (apiName: string, ...params: any) => {
  console.log(`[MonaLog]调用 ${apiName}，当前环境未实现， 当前传入参数：`, params)
}
export const maxRequest: OriginApis['request'] = function(options) {
  if (lynx.request) {
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
  } else {
    logNoImpl('request', options);
  }
 
  // no RequestTask
  return {};
}

export const maxGetStorage: OriginApis['getStorage'] = function(options) {
  if (lynx.getStorage) {
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
  } else {
    logNoImpl('getStorage', options);
  }
}

export const maxGetStorageSync: BaseApis['getStorageSync'] = function(key) {
  return lynx.getStorage ? lynx.getStorage({ key, unique: __MONA_APPID }) : logNoImpl('getStorageSync', key);
}

export const maxSetStorage: OriginApis['setStorage'] = function (options) {
  if (lynx.setStorage) {
    try {
      lynx.setStorage({ key: options.key, unique: __MONA_APPID, data: options.data })
      options.success?.({ errMsg: 'setStorage:ok' })
      options.complete?.({ errMsg: 'setStorage:ok' })
    } catch(err: any) {
      const error = { errMsg: 'setStorage:fail' + err?.message ?? '' };
      options.fail?.(error)
      options.complete?.(error)
    }
  } else {
    logNoImpl('setStorage', options);
  }
}

export const maxSetStorageSync: BaseApis['setStorageSync'] = function(key, data) {
  return lynx.setStorage ? lynx.setStorage({ key, unique: __MONA_APPID, data }) : logNoImpl('setStorageSync', key, data)
}

export const maxRemoveStorage: OriginApis['removeStorage'] = function(options) {
  if (lynx.removeStorage) {
    try {
      lynx.removeStorage({ key: options.key, unique: __MONA_APPID })
      options.success?.({ errMsg: 'removeStorage:ok' })
      options.complete?.({ errMsg: 'removeStorage:ok' })
    } catch(err: any) {
      const error = { errMsg: 'removeStorage:fail' + err?.message ?? '' };
      options.fail?.(error)
      options.complete?.(error)
    }
  } else {
    logNoImpl('removeStorage', options);
  }
}

export const maxRemoveStorageSync: BaseApis['removeStorageSync'] = function(key) {
  lynx.removeStorage ? lynx.removeStorage({ key, unique: __MONA_APPID }) : logNoImpl('removeStorageSync', key);
}

export const maxNavigateTo: OriginApis['navigateTo'] = function(options) {
  if (lynx.navigateTo) {
    try {
      lynx.openPage(options)
      options.success?.({ errMsg: 'navigateTo:ok' })
      options.complete?.({ errMsg: 'navigateTo:ok' })
    } catch(err: any) {
      const error = { errMsg: 'navigateTo:fail' + err?.message ?? '' };
      options.fail?.(error)
      options.complete?.(error)
    }
  } else {
    logNoImpl('navigateTo', options)
  }
}

export const maxReportAnalytics: BaseApis['reportAnalytics'] = function(eventName, data) {
  if (lynx.reportAnalytics) {
    lynx.reportAnalytics({ eventName, params: data })
    console.log('[MonaLog]reportAnalytics上报数据', `eventName: ${eventName}`, `data: ${data}`)
  } else {
    logNoImpl('reportAnalytics', eventName, data)
  }
}