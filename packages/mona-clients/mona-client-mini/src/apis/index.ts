import { BaseApis } from '@bytedance/mona';
import * as apis from './api';

export const Mona: BaseApis = new Proxy({} as any, {
  get: function (_, property: keyof BaseApis) {
    //@ts-ignore
    if (apis[property]) {
      //@ts-ignore
      return apis[property];
    }
    if (tt[property]) {
      return tt[property];
    }
    return () => {
      throw Error('not implemented in miniapp');
    };
  },
  set: () => false,
});

export { mini } from './specApi';
