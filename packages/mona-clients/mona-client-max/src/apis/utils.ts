import { BaseApis, Callbacks, OriginApis } from '@bytedance/mona';

const NOT_IMPLEMENT = 'NOT_IMPLEMENT';
const DEFAULT_ERROR_NO = 'UNKNOW_ERROR_NO';
const currentAppid = __MONA_APPID;
const logNoImpl = (apiName: string, ...params: any) => {
  console.log(`[MonaLog]调用 ${apiName}，当前环境未实现， 当前传入参数：`, params);
};

const _global = lynx;
export const SUCCESS_CODE = 1;
export interface ResData {
  code: number;
  message: string;
  data: any;
}
function _wrapPromise<T extends Callbacks>({
  name,
  options,
  inputHandler,
  outputHandler,
  erroHandler,
}: {
  name: string;
  options: T;
  inputHandler?: (options: T) => any;
  outputHandler?: (output: ResData) => any;
  erroHandler?: (error: Error) => any;
}) {
  const _success = options.success || function () {};
  const _fail = options.fail || function () {};
  const _complete = options.complete || function () {};

  const _inputHandler =
    inputHandler ||
    function (i) {
      return i;
    };
  const _outputHandler =
    outputHandler ||
    function () {
      return { errMsg: `${name}:ok` };
    };
  const _erroHandler =
    erroHandler ||
    function (err) {
      return { errMsg: `${name}:fail ` + (err?.message || '') } as any;
    };
  const promiseFunc = _global[name];

  if (promiseFunc) {
    promiseFunc(_inputHandler(options))
      .then((res: ResData) => {
        if (res?.code === SUCCESS_CODE) {
          const data = _outputHandler(res);
          _success(data);
          _complete(data);
        } else {
          throw new Error(res?.message);
        }
      })
      .catch((err: Error) => {
        const error = _erroHandler(err);
        _fail(error);
        _complete(error);
      });
  } else {
    logNoImpl(name, options);
    const error = _erroHandler(new Error(NOT_IMPLEMENT));
    _fail(error);
    _complete(error);
  }
}

export const maxRequest: OriginApis['request'] = function (options) {
  _wrapPromise({
    name: 'request',
    options,
    inputHandler: options => ({
      url: options.url,
      method: options.method,
      headers: options.header,
      body: options.data,
    }),
    outputHandler: res => ({
      statusCode: 200,
      header: {},
      data: res.data,
      profile: {} as any,
    }),
    erroHandler: err => ({ errMsg: err.message, errNo: DEFAULT_ERROR_NO }),
  });
  return {};
};

export const maxGetStorage: OriginApis['getStorage'] = function (options) {
  _wrapPromise({
    name: 'getStorage',
    options,
    inputHandler: options => ({ key: options.key, unique: currentAppid }),
    outputHandler: res => ({ data: res.data, errMsg: 'getStorage:ok' }),
  });
};

export const maxSetStorage: OriginApis['setStorage'] = function (options) {
  _wrapPromise({
    name: 'setStorage',
    options,
    inputHandler: options => ({ key: options.key, unique: currentAppid, data: options.data }),
  });
};

export const maxRemoveStorage: OriginApis['removeStorage'] = function (options) {
  _wrapPromise({
    name: 'removeStorage',
    options,
    inputHandler: options => ({ key: options.key, unique: currentAppid }),
  });
};
export const maxGetSystemInfoSync: BaseApis['getSystemInfoSync'] = function () {
  const globalProps = lynx?.__globalProps;
  return {
    system: globalProps?.os_version || globalProps?.osVersion,
    platform: globalProps?.os,
    brand: globalProps?.device_platform,
    model: globalProps?.device_type || globalProps?.deviceModel,
    version: globalProps?.app_version,
    appName: globalProps?.app_name,
    SDKVersion: SystemInfo?.lynxSdkVersion,
    screenWidth: globalProps?.screenWidth,
    screenHeight: globalProps?.screenHeight,
    pixelHeight: SystemInfo?.pixelHeight,
    pixelWidth: SystemInfo?.pixelWidth,
    windowWidth: globalProps?.screenWidth,
    windowHeight: globalProps?.screenHeight,
    pixelRatio: SystemInfo?.pixelRatio,
    safeArea: {
      left: globalProps?.safeArea?.marginLeft || 0,
      right: globalProps?.safeArea?.marginRight || 0,
      top: globalProps?.safeArea?.marginTop || 0,
      bottom: globalProps?.safeArea?.marginBottom || 0,
      height:
        (globalProps?.screenHeight || 0) -
        (globalProps?.safeArea?.marginBottom || 0) -
        (globalProps?.safeArea?.marginTop || 0),
      width:
        (globalProps?.screenWidth || 0) -
        (globalProps?.safeArea?.marginLeft || 0) -
        (globalProps?.safeArea?.marginRight || 0),
    },
  };
};
export const maxGetSystemInfo: OriginApis['getSystemInfo'] = function (options) {
  try {
    const systemInfo = maxGetSystemInfoSync();
    options?.success?.(systemInfo);
    options?.complete?.(systemInfo);
  } catch (e) {
    options?.fail?.({ errMsg: 'getSystemInfo:fail' });
    options?.complete?.({ errMsg: 'getSystemInfo:fail' });
  }
};

// eg: openPage?action_type=1&action_value=2
function parseUrl(url: string) {
  if (typeof url === 'string') {
    let type: string = '';
    const params: Record<string, string> = {};
    // process openpage url with query specially
    if (url.indexOf('openPage') !== -1 && url.indexOf('action_type') !== -1 && url.indexOf('action_value') !== -1) {
      type = 'openPage';
      if (url.indexOf('&action_value=') !== -1) {
        params['action_type'] = url.substring(
          url.indexOf('action_type=') + 'action_type='.length,
          url.indexOf('&action_value='),
        );
        params['action_value'] = url.substring(url.indexOf('&action_value=') + '&action_value='.length);
      } else if (url.indexOf('&action_type=') !== -1) {
        params['action_value'] = url.substring(
          url.indexOf('action_value=') + 'action_value='.length,
          url.indexOf('&action_type='),
        );
        params['action_type'] = url.substring(url.indexOf('&action_type=') + '&action_type='.length);
      }
      return { type, params };
    } else {
      const [type, query = ''] = url.split('?');
      query.split('&').forEach(item => {
        const [key, value] = item.split('=');
        if (key) {
          params[key] = value;
        }
      });
      return { type, params };
    }
  } else {
    return null;
  }
}

export const maxNavigateTo: OriginApis['navigateTo'] = function (options) {
  const _success = options.success || function () {};
  const _fail = options.fail || function () {};
  const _complete = options.complete || function () {};
  const res = parseUrl(options.url);
  if (!res) {
    _fail({ errMsg: `navigateTo:fail ` + '无效的url，有效的形式详见navigateTo文档' });
    _complete({ errMsg: `navigateTo:fail ` + '无效的url，有效的形式详见navigateTo文档' });
  } else if (_global.openPage && _global.openCouponPanel) {
    const { type, params } = res;
    if (type === 'openPage' && params.action_type && params.action_value) {
      _global
        .openPage({ action_type: Number(params.action_type), action_value: params.action_value })
        .then(() => {
          _success({ errMsg: `navigateTo:ok` });
          _complete({ errMsg: `navigateTo:ok` });
        })
        .catch((err: Error) => {
          const error = { errMsg: `navigateTo:fail ` + err?.message || '' };
          _fail(error);
          _complete(error);
        });
    } else if (type === 'openCouponPanel' && params.coupon_id) {
      _global
        .openCouponPanel({ couponId: params.coupon_id, shopId: _global.metaInfo.sec_shop_id })
        .then(() => {
          _success({ errMsg: `navigateTo:ok` });
          _complete({ errMsg: `navigateTo:ok` });
        })
        .catch((err: Error) => {
          const error = { errMsg: `navigateTo:fail ` + err?.message || '' };
          _fail(error);
          _complete(error);
        });
    } else {
      _fail({ errMsg: `navigateTo:fail ` + '无效的url，有效的形式详见navigateTo文档' });
      _complete({ errMsg: `navigateTo:fail ` + '无效的url，有效的形式详见navigateTo文档' });
    }
  } else {
    logNoImpl('navigateTo', options);
  }
};

export const maxReportAnalytics: BaseApis['reportAnalytics'] = function (eventName, data) {
  if (_global.reportAnalytics) {
    if (!data.key || !data.value) {
      console.error('reportAnalytics 无效的key或value');
      return;
    }
    const params = data.key === 'data' ? data.value : { [data.key]: data.value };
    _global.reportAnalytics({ eventName, params });
  } else {
    logNoImpl('reportAnalytics', eventName, data);
  }
};
