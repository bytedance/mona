const MONA_DOUDIAN_H5_SDK = '__MONA_DOUDIAN_H5_SDK__';

const emptyApp = new Proxy(
  {},
  {
    get: () => {
      return () => {
        console.log('[MonaLog]此环境未实现app.xxx相关api');
      };
    },
    set: () => false,
  },
);
// @ts-ignore h5 jsapi
export const app = window[MONA_DOUDIAN_H5_SDK] || emptyApp;
