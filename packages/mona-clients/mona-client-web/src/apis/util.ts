// @ts-nocheck 临时发包
import './abortcontroller-polfill';
import formatPath from '@bytedance/mona-shared/dist/formatPath';
import {
  GetImageInfoSuccessCallbackArgs,
  RequestTask,
  BaseApis,
  OriginApis,
  ChooseImageSuccessCallbackArgs,
  GetLocationSuccessCallbackArgs,
  NetworkType,
  RequestOptions,
} from '@bytedance/mona';
// import clipboard from 'clipboardy';

import { showPreviewImage } from './components/';
import { APP_ID, MyFetch, getAppId, getLightHeaders } from './light';

export const LIGHT_APP_GET_TOEKN = '__MONA_LIGHT_APP_GET_TOEKN';

export function webRequest(data: Omit<RequestOptions, 'url'>): RequestTask;
export function webRequest(data: Omit<RequestOptions, 'fn'>): RequestTask;
export function webRequest(data: RequestOptions): RequestTask;

// @ts-ignore ignore
export async function webRequest(data: Partial<RequestOptions>): RequestTask | Promise<any> {
  if (typeof data.url === 'undefined' && typeof data.fn === 'undefined') {
    return Promise.reject(new Error('url and funcName must be specified'));
  }
  const isLightApp = data.fn;

  if (data.fn && window.__LIGHT_ISV_REQ) {
    return window.__LIGHT_ISV_REQ(data);
  }

  const defaultHeader = {
    'Content-Type': 'application/json',
  };

  const controller = new AbortController();
  const init: Record<string, any> = {
    headers: data.header ? data.header : defaultHeader,
    method: data.method || 'GET',
    signal: controller.signal,
  };

  // light app
  if (isLightApp) {
    init.credentials = 'include';
    init.method = 'POST';
    const lightHeaders = await getLightHeaders();
    init.headers = {
      ...init.headers,
      ...lightHeaders,
    };

    const appId = APP_ID || getAppId();
    data.data = {
      appId,
      method: data.fn,
      param: JSON.stringify(data.data),
    };
  }

  if (data.credentials) init.credentials = data.credentials;

  // if app not mirco app ,but set fn params, prompt waring
  if (data.fn && !isLightApp) {
    console.error(`必须在主端调用${data.fn}`);
  }

  const url = isLightApp ? `https://${window.__MONA_LIGNT_APP_DOMAIN_NAME || 'lgw.jinritemai.com'}/invoke` : data.url;

  if ((init.method as string).toUpperCase() === 'POST') {
    init.body = data.body ? data.body : data.data ? JSON.stringify(data.data) : '';
  }
  const promise = MyFetch(url as string, init);

  promise
    .then(r => r.json())
    .then(r => {
      let lightAppData;
      if (isLightApp) {
        if (r?.BizError?.message) {
          const { message } = r.BizError;
          throw new Error(message);
          // lightAppData = { code, data: '', message };
        } else {
          let parseData;
          try {
            parseData = JSON.parse(r.data);
          } catch (e) {
            parseData = r.data;
          }
          lightAppData = parseData;
        }
      }
      data.success?.({
        statusCode: r.status,
        header: r.headers,
        data: isLightApp ? lightAppData : r,
        // @ts-ignore ignore
        profile: '',
      });
    })
    .catch(err => {
      data.fail?.({
        errMsg: (typeof err === 'string' ? err : err?.message) || '未知错误',
        errNo: '',
        // @ts-ignore 忽略报错
        toString() {
          return (typeof err === 'string' ? err : err?.message) || '未知错误';
        },
      });
    })
    .finally();

  if (data.timeout) {
    controller.signal.addEventListener('abort', () => controller.abort());
  }
  const timeoutId = setTimeout(() => controller.abort, data.timeout);
  promise.finally(() => clearTimeout(timeoutId));
  return {
    abort: controller.abort,
  };
}

export const webChooseImage: OriginApis['chooseImage'] = (options = {}) => {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.id = 'file';
    input.accept = 'image/*';

    const event = new MouseEvent('click', {
      bubbles: false,
      cancelable: true,
      view: window,
    });

    input.dispatchEvent(event);

    input.onchange = () => {
      options?.success?.(input.files as unknown as ChooseImageSuccessCallbackArgs);
    };
  } catch (e) {
    options.fail?.({ errMsg: 'chooseImage:fail' });
  }
  options?.complete?.({ errMsg: 'chooseImage:complete' });
};

export const webPreviewImage: OriginApis['previewImage'] = options => showPreviewImage(options);

export const webGetImageInfo: OriginApis['getImageInfo'] = options => {
  const img = document.createElement('img');
  img.src = options.src;
  img.onload = function () {
    const ret: GetImageInfoSuccessCallbackArgs = {
      errMsg: 'getImageInfo:ok',
      height: img.height,
      width: img.width,
      type: 'image',
      path: options.src,
      orientation: 'up',
    };
    options.success?.(ret);
    options.complete?.(ret);
  };

  img.onerror = function () {
    const errMsg = 'getImageInfo:fail';
    options.fail?.({ errMsg });
    options.complete?.({ errMsg });
  };
};

export const webChooseVideo: OriginApis['chooseVideo'] = (options = {}) => {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'file';
    input.accept = 'video/*';

    const event = new MouseEvent('click', {
      bubbles: false,
      cancelable: true,
      view: window,
    });

    input.dispatchEvent(event);

    input.onchange = () => {
      const content = input.files?.[0];
      if (content) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(content);
        video.onloadedmetadata = () => {
          options?.success?.({
            width: video.videoWidth,
            height: video.videoHeight,
            errMsg: 'chooseVideo: ok',
            // @ts-ignore
            duration: video.duration,
            size: content?.size,
            tempFilePath: video.src,
          });
        };
      }
    };
  } catch (e) {
    options.fail?.({ errMsg: 'chooseImage:fail' });
  }
  options?.complete?.({ errMsg: 'complete' });
};

export const webCreateVideoContext = (element: string) => {
  const video = document.getElementById(element) as HTMLVideoElement;
  return {
    play() {
      video.play();
    },
    pause() {
      video.pause();
    },
    exitFullScreen() {
      // @ts-ignore ignore
      video.exitFullscreen();
    },
    requestFullScreen() {
      video.requestFullscreen;
    },
    seek(time: number) {
      video.currentTime = time;
    },
    stop() {
      video.pause();
      video.currentTime = 0;
    },
  };
};

export const webGetFileInfo: OriginApis['getFileInfo'] = options => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', options.filePath, true);
  const errMsg = 'getFileInfo:fail';
  xhr.addEventListener('load', ret => {
    const result = {
      errMsg: 'getFileInfo.ok',
      size: ret.loaded,
    };
    options.success?.(result);
    options.complete?.(result);
  });

  xhr.addEventListener('error', () => {
    options.fail?.({ errMsg, errNo: 21101 });
    options.complete?.({ errMsg, errNo: 21101 });
  });

  xhr.send();
};

export const webGetStorage: OriginApis['getStorage'] = options => {
  try {
    const data = webGetStorageSync(options.key);
    options.success?.({ data });
  } catch (e) {
    options.fail?.({
      errMsg: 'getStorage:fail',
    });
  }
  options.complete?.('complete');
};

export const webGetStorageSync: BaseApis['getStorageSync'] = key => window.localStorage.getItem(key);

export const webSetStorage: OriginApis['setStorage'] = options => {
  let errMsg = 'setStorage:fail';
  try {
    errMsg = 'setStorage:ok';
    webSetStorageSync(options.key, options.data);
    options.success?.({ errMsg });
  } catch (e) {
    options.fail?.({ errMsg });
  }
  options.complete?.({ errMsg });
};

export const webSetStorageSync: BaseApis['setStorageSync'] = (key, value) => {
  window.localStorage.setItem(key, value);
};

export const webRemoveStorage: OriginApis['removeStorage'] = options => {
  const errMsg = 'removeStorage:fail';
  try {
    const errMsg = 'removeStorage:ok';
    webRemoveStorageSync(options.key);
    options.success?.({ errMsg });
  } catch (e) {
    options.fail?.({ errMsg });
  }
  options.complete?.({ errMsg });
};

export const webRemoveStorageSync: BaseApis['removeStorageSync'] = key => {
  window.localStorage.removeItem(key);
};

export const webClearStorage: OriginApis['clearStorage'] = (options = {}) => {
  let errMsg = 'clearStorage:fail';
  try {
    errMsg = 'clearStorage:ok';
    webClearStorageSync();
    options.success?.({ errMsg });
  } catch (e) {
    options.fail?.({ errMsg });
  }
  options.complete?.({ errMsg });
};

export const webClearStorageSync: BaseApis['clearStorageSync'] = () => {
  window.localStorage.clear();
};

export const webGetStorageInfo: OriginApis['getStorageInfo'] = options => {
  let errMsg = 'clearStorage:fail';
  try {
    errMsg = 'clearStorage:ok';
    const data = webGetStorageInfoSync();
    options?.success?.({ ...data, errMsg });
  } catch (e) {
    options?.fail?.({ errMsg });
  }
  options?.complete?.({ errMsg });
};

export const webGetStorageInfoSync: BaseApis['getStorageInfoSync'] = () => ({
  keys: Object.keys(window.localStorage),
  limitSize: 10240,
  currentSize: 1,
});

export const webGetLocation: OriginApis['getLocation'] = options => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        options?.success?.(position.coords as unknown as GetLocationSuccessCallbackArgs);
      },
      err => {
        options?.fail?.({
          errMsg: err.message,
        });
      },
    );
  } else {
    options?.fail?.({
      errMsg: 'The browser does not support geolocation',
    });
  }
};

export const webGetNetworkType: OriginApis['getNetworkType'] = (options = {}) => {
  let errMsg: NetworkType | string;
  if (navigator.connection) {
    // @ts-ignore ignore
    errMsg = navigator.connection.effectiveType;
    options.success?.({ networkType: errMsg as unknown as NetworkType });
  } else {
    errMsg = 'getNetworkType call faild';
    options.fail?.({ errMsg });
  }
  options.complete?.({ errMsg });
};

export const webMakePhoneCall: OriginApis['makePhoneCall'] = options => {
  const errMsg = 'makePhoneCall:fail';
  try {
    window.open(`tel:${options.phoneNumber}`);
    options.success?.({ errMsg });
  } catch (e) {
    options.fail?.({ errMsg });
  }
  options.complete?.({ errMsg });
};

export const webPageScrollTo: OriginApis['pageScrollTo'] = options => {
  let errMsg: string;
  try {
    errMsg = 'pageScrollTo:ok';
    setTimeout(() => {
      window.scrollTo({
        top: options.scrollTop,
        behavior: 'smooth',
      });
      options.success?.({ errMsg });
    }, options.duration || 200);
  } catch (err) {
    errMsg = `pageScrollTo:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};

export const webNavigateTo: OriginApis['navigateTo'] = options => {
  let errMsg: string;
  try {
    errMsg = 'navigateTo:ok';
    const monaHistory = window.__mona_history;
    const currentPath = monaHistory.location.pathname;
    const targetPath = formatPath(options.url || '', currentPath);
    monaHistory.push(targetPath);
    options.success?.({ errMsg });
  } catch (err) {
    errMsg = `navigateTo:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};
export const webRedirectTo: OriginApis['redirectTo'] = options => {
  let errMsg: string;
  try {
    errMsg = 'redirectTo:ok';
    const monaHistory = window.__mona_history;
    const currentPath = monaHistory.location.pathname;
    const targetPath = formatPath(options.url, currentPath);
    monaHistory.replace(targetPath);
    options.success?.({ errMsg });
  } catch (err) {
    errMsg = `redirectTo:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};

export const webSwitchTab: OriginApis['switchTab'] = ({ url, success, fail, complete }) => {
  webRedirectTo({ url, success, fail, complete });
};

export const webNavigateBack: OriginApis['navigateBack'] = (options = {}) => {
  let errMsg: string;
  try {
    const monaHistory = window.__mona_history;
    errMsg = 'navigateBack:ok';
    const delta = options.delta || 1;
    monaHistory.go(-delta);
    options.success?.({ errMsg });
  } catch (err) {
    errMsg = `navigateBack:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};

export const webReLaunch: OriginApis['reLaunch'] = options => {
  let errMsg: string;
  try {
    errMsg = 'reLaunch:ok';

    // clear stack
    if ((window.history as any)._stack && (window.history as any)._stack.length > 0) {
      (window.history as any)._stack = [];
      (window.history as any)._pos = -1;
      webNavigateTo(options);
    } else {
      window.location.href = options.url;
      options.success?.({ errMsg });
    }
  } catch (err) {
    errMsg = `reLaunch:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};

export const webGetClipboardData: OriginApis['getClipboardData'] = (options = {}) => {
  const errMsg = 'setClipboardData:fail';

  try {
    // TODO
    // const data = clipboard.readSync();
    const ret = { data: {} as any, errMsg: 'setClipboardData:ok' };
    options.success?.(ret);
    options.complete?.(ret);
  } catch (e) {
    options.fail?.({ errMsg });
    options.complete?.({ errMsg });
  }
};

export const webSetClipboardData: OriginApis['setClipboardData'] = options => {
  let errMsg = 'setClipboardData:fail';
  try {
    errMsg = 'setClipboardData:ok';
    // TODO
    // clipboard.writeSync(options.data);
    options.success?.({ errMsg });
    options.complete?.({ errMsg });
  } catch (e) {
    options.fail?.({ errMsg });
    options.complete?.({ errMsg });
  }
};

export const webGetSystemInfo: OriginApis['getSystemInfo'] = options => {
  try {
    const systemInfo = webGetSystemInfoSync();
    options?.success?.(systemInfo);
    options?.complete?.(systemInfo);
  } catch (e) {
    console.log('e', e);
    options?.fail?.({ errMsg: 'getSystemInfo:fail' });
    options?.complete?.({ errMsg: 'getSystemInfo:fail' });
  }
};

export const webGetSystemInfoSync: BaseApis['getSystemInfoSync'] = () => {
  const { appVersion, userAgent, appName } = navigator;
  const systemInfo = {
    system: userAgent,
    // @ts-ignore ignore
    platform: navigator?.userAgentData?.platform || navigator?.platform,
    brand: '',
    model: '',
    version: appVersion,
    SDKVersion: '',
    screenWidth: document.body.clientWidth,
    screenHeight: document.body.clientHeight,
    appName,
    windowWidth: window.screen.width,
    windowHeight: window.screen.height,
    pixelRatio: window.devicePixelRatio,
    statusBarHeight: 0,
    safeArea: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0,
    },
  };

  return systemInfo;
};
const USER_AUTHORIZATION_CACHE = '__USER_AUTHORIZATION_CACHE__';
const MONA_APPID = '__MONA_APPID__';
const MONA_JSAPI_LIST = '__MONA_JSAPI_LIST__';
const MONA_SHOW_AUTHORIZE_MODAL = '__MONA_SHOW_AUTHORIZE_MODAL__';

export const webGetSetting: OriginApis['getSetting'] = options => {
  try {
    // @ts-ignore
    const appid = window[MONA_APPID];
    const data = webGetStorageSync(USER_AUTHORIZATION_CACHE);

    if (data) {
      const apiAuthSetting = JSON.parse(data)?.[appid];
      options?.success?.({ apiAuthSetting });
      options?.complete?.({ apiAuthSetting });
    } else {
      options?.success?.({ apiAuthSetting: {} });
      options?.complete?.({ apiAuthSetting: {} });
    }
  } catch (e) {
    console.log('e', e);
    options?.fail?.({ errMsg: 'getSetting:fail' });
    options?.complete?.({ errMsg: 'getSetting:fail' });
  }
};

const removePrefix = (apiName: string) => {
  if (typeof apiName === 'string') {
    const arr = apiName.split('.');
    return arr[arr.length - 1];
  }
  return apiName;
};
export const webAuthorize: OriginApis['authorize'] = options => {
  const setAuthorzationCache = (isTrue: boolean) => {
    const data = webGetStorageSync(USER_AUTHORIZATION_CACHE);
    let dataObj: { [key: string]: { [key: string]: boolean } };
    // @ts-ignore
    const appid = window[MONA_APPID];
    if (data) {
      // 有缓存
      dataObj = JSON.parse(data);
      dataObj[appid] = { ...dataObj[appid], [options.apiName]: isTrue };
    } else {
      // 没有缓存
      dataObj = {};
      dataObj[appid] = { [options.apiName]: isTrue };
    }
    webSetStorageSync(USER_AUTHORIZATION_CACHE, JSON.stringify(dataObj));
  };
  const rejectCallback = () => {
    try {
      setAuthorzationCache(false);
      options?.success?.(false);
      options?.complete?.(false);
    } catch (err) {
      options?.fail?.({ errMsg: 'authorize:fail' });
      options?.complete?.({ errMsg: 'authorize:fail' });
    }
  };
  const allowCallback = () => {
    try {
      setAuthorzationCache(true);
      options?.success?.(true);
      options?.complete?.(true);
    } catch (err) {
      options?.fail?.({ errMsg: 'authorize:fail' });
      options?.complete?.({ errMsg: 'authorize:fail' });
    }
  };
  const authorizationText =
    // @ts-ignore
    window[MONA_JSAPI_LIST]?.find((item: any) => item?.jsApiName === removePrefix(options.apiName))?.reqAuthDesc ||
    '请求您的授权';
  // @ts-ignore
  window[MONA_SHOW_AUTHORIZE_MODAL] &&
    // @ts-ignore
    window[MONA_SHOW_AUTHORIZE_MODAL](authorizationText, allowCallback, rejectCallback);
};

export const webOpen = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

export const webNavigateToApp: BaseApis['navigateToApp'] = (info, options) => {
  window.__MONA_LIGHT_APP_NAVIGATE_CB?.(info, options);
};
