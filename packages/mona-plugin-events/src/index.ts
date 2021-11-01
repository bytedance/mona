import { MonaPluginEvents } from './type';

const SDK_NAME_IN_WINDOW = '____MONA_SDK_NAME_IN_WINDOW____';
// !只能在内部sdk出现，外部需删去
const MONA_GLOBAL_STORE = 'monaGlobalStore';

const handler = {
  get: function (_: any, prop: string) {
    if (prop === 'globalStore') {
      return window?.[MONA_GLOBAL_STORE];
    }
    return window?.[SDK_NAME_IN_WINDOW]?.[prop];
  },
  set: () => false
};

const monaPluginEvents = new Proxy({}, handler) as MonaPluginEvents;

export default monaPluginEvents;
