import { BaseApis, Callbacks, OriginApis } from "@bytedance/mona";

const NOT_IMPLEMENT = 'NOT_IMPLEMENT';
const DEFAULT_ERROR_NO = 'UNKNOW_ERROR_NO';
const currentAppid = __MONA_APPID;
const logNoImpl = (apiName: string, ...params: any) => {
  console.log(`[MonaLog]调用 ${apiName}，当前环境未实现， 当前传入参数：`, params)
}

const _global = lynx;
export const SUCCESS_CODE = 1;
export interface ResData { code: number; message: string; data: any }
function _wrapPromise<T extends Callbacks>({ name, options, inputHandler, outputHandler, erroHandler }: {
  name: string;
  options: T;
  inputHandler?: (options: T) => any;
  outputHandler?: (output: ResData) => any;
  erroHandler?: (error: Error) => any;
}) {
  const _success = options.success || function() {};
  const _fail = options.fail || function() {};
  const _complete = options.complete || function() {};

  const _inputHandler = inputHandler || function(i){return i};
  const _outputHandler = outputHandler || function(){return { errMsg: `${name}:ok` }};
  const _erroHandler = erroHandler || function(err){return { errMsg: `${name}:fail ` + err?.message ?? '' } as any};
  const promiseFunc = _global[name];

  if (promiseFunc) {
    promiseFunc(_inputHandler(options)).then((res: ResData) => {
      if (res?.code === SUCCESS_CODE) {
        const data = _outputHandler(res);
        _success(data);
        _complete(data);
      } else {
        throw new Error(res?.message)
      }
    }).catch((err: Error) => {
      const error = _erroHandler(err);
      _fail(error);
      _complete(error);
    })
  } else {
    logNoImpl(name, options);
    const error = _erroHandler(new Error(NOT_IMPLEMENT));
    _fail(error)
   _complete(error)
  }
}

export const maxRequest: OriginApis['request'] = function(options) {
  _wrapPromise({
    name: 'request',
    options,
    inputHandler: (options) => ({
      url: options.url,
      method: options.method,
      headers: options.header,
      body: options.data,
    }),
    outputHandler: (res) => ({
      statusCode: 200,
      header: {},
      data: res.data,
      profile: {} as any
    }),
    erroHandler: (err) => ({ errMsg: err.message, errNo: DEFAULT_ERROR_NO })
  })
  return {};
}

export const maxGetStorage: OriginApis['getStorage'] = function (options) {
  _wrapPromise({
    name: 'getStorage',
    options,
    inputHandler: (options) => ({ key: options.key, unique: currentAppid }),
    outputHandler: (res) => ({ data: res.data, errMsg: 'getStorage:ok' }),
  })
}

export const maxSetStorage: OriginApis['setStorage'] = function (options) {
  _wrapPromise({
    name: 'setStorage',
    options,
    inputHandler: (options) => ({ key: options.key, unique: currentAppid, data: options.data }),
  })
}

export const maxRemoveStorage: OriginApis['removeStorage'] = function(options) {
  _wrapPromise({
    name: 'removeStorage',
    options,
    inputHandler: (options) => ({ key: options.key, unique: currentAppid }),
  })
}

export const maxNavigateTo: OriginApis['navigateTo'] = function(options) {
  _wrapPromise({
    name: 'navigateTo',
    options,
  })
}

export const maxReportAnalytics: BaseApis['reportAnalytics'] = function(eventName, data) {
  if (_global.reportAnalytics) {
    _global.reportAnalytics({ eventName, params: data }).then((res?: ResData) => {
      if (res?.code === SUCCESS_CODE) {
        console.log('[MonaLog]reportAnalytics上报数据成功', `eventName: ${eventName}`, `data: ${data}`)
      } else {
        console.log('[MonaLog]reportAnalytics上报数据失败', `eventName: ${eventName}`, `data: ${data}`)
      }
    })
  } else {
    logNoImpl('reportAnalytics', eventName, data)
  }
}