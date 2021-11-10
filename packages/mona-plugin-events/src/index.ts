import { ErrorCode, InputCallbackParams, MonaPluginEvents } from './type';

const SDK_NAME_IN_WINDOW = '____MONA_SDK_NAME_IN_WINDOW____';

const MONA_GLOBAL_STORE = 'monaGlobalStore';

const emptyHandler = {
  get: function (_: any, prop: string) {
    return (data: InputCallbackParams) => {
      console.info(`非飞鸽容器, ${prop} 方法无法调用`);
      if (typeof data === 'object') {
        data?.failed?.({ code: ErrorCode.Unknown, message: '非飞鸽容器' });
      }
    };
  },
  set: () => false
};

const emptyObj = new Proxy({}, emptyHandler);


const handler = {
  get: function (_: any, prop: string) {
    if (prop === 'globalStore') {
      return window?.[MONA_GLOBAL_STORE];
    }
    return window?.[SDK_NAME_IN_WINDOW]?.[prop] || emptyObj;
  },
  set: () => false
};

const monaPluginEvents = new Proxy({}, handler) as MonaPluginEvents;

export default monaPluginEvents;
