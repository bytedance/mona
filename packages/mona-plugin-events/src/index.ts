import { ErrorCode, InputCallbackParams, MonaPluginEvents } from './type';

const SDK_NAME_IN_WINDOW = '____MONA_SDK_NAME_IN_WINDOW____';

const MONA_GLOBAL_STORE = 'monaGlobalStore';
const REMOVE_LISTENER = 'removePluginListener';

const printWarn = (prop: string) => {
  console.warn(`非飞鸽容器, ${prop} 方法无法调用`);
};

const emptyHandler = {
  get: function (_: any, prop: string) {
    return (data: InputCallbackParams) => {
      printWarn(prop);
      if (prop === REMOVE_LISTENER) {
        return () => printWarn(prop);
      } else if (typeof data === 'object') {
        data?.failed?.({ code: ErrorCode.Unknown, message: '非飞鸽容器' });
      }
    };
  },
  set: () => false,
};

const emptyObj = new Proxy({}, emptyHandler);

const handler = {
  get: function (_: any, prop: string) {
    const sdk = window?.[SDK_NAME_IN_WINDOW]?.[prop];
    if (prop === 'globalStore') {
      return window?.[MONA_GLOBAL_STORE];
    } else if (prop === REMOVE_LISTENER) {
      return sdk || (() => printWarn(prop));
    }
    return sdk || emptyObj;
  },
  set: () => false,
};

const monaPluginEvents = new Proxy({}, handler) as MonaPluginEvents;

export default monaPluginEvents;
