import { ErrorCode, InputCallbackParams, MonaPluginEvents, Listener, EventOptionsType } from './type';
import { removeEventPrefix } from './util';
const SDK_NAME_IN_WINDOW = '____MONA_SDK_NAME_IN_WINDOW____';
// window中max事件SDK属性名
export const MAX_EVENT_SDK_IN_WINDOW = '__MAX_EVENT_SDK_IN_WINDOW__';

const MONA_GLOBAL_STORE = 'monaGlobalStore';
const REMOVE_LISTENER = 'removePluginListener';

const printWarn = (prop: string) => {
  console.warn(`非飞鸽容器, ${prop} 方法无法调用`);
};

const emptyHandler = {
  get: function (_: any, prop: string) {
    return (data: InputCallbackParams) => {
      printWarn(prop);
      if (typeof data === 'object') {
        data?.failed?.({ code: ErrorCode.Unknown, message: '非飞鸽容器' });
      }
    };
  },
  set: () => false,
};

const emptyObj = new Proxy({}, emptyHandler);

const maxProxyHandler = {
  get: function (_: any, prop: string) {
    // @ts-ignore 事件sdk,代理到monaGlobal.[MAX_EVENT_SDK_IN_WINDOW]
    const maxEventSDK = monaGlobal?.[MAX_EVENT_SDK_IN_WINDOW];
    if (!maxEventSDK) {
      return () => {
        console.warn(`非max容器, ${prop} 方法无法调用`);
      };
    }
    return maxEventSDK[prop];
  },
  set: () => false,
};
const max = new Proxy({}, maxProxyHandler);

const handler = {
  get: function (_: any, prop: string) {
    const sdk = window?.[SDK_NAME_IN_WINDOW]?.[prop];
    if (prop === 'globalStore') {
      return window?.[MONA_GLOBAL_STORE];
    } else if (prop === REMOVE_LISTENER) {
      return sdk || (() => printWarn(prop));
    } else if (prop === 'max') {
      return max;
    }
    return sdk || emptyObj;
  },
  set: () => false,
};

const monaPluginEvents = new Proxy({}, handler) as MonaPluginEvents;

export default monaPluginEvents;
