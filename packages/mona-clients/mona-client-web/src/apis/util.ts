import formatPath from '@/utils/formatPath';
import {
  GetImageInfoSuccessCallbackArgs,
  RequestTask,
  BaseApis,
  ChooseImageSuccessCallbackArgs,
  GetLocationSuccessCallbackArgs,
  NetworkType
} from '@bytedance/mona';
import clipboard from 'clipboardy';

import { showPreviewImage } from './components/';

export const webRequest: BaseApis['request'] = (data): RequestTask => {
  const controller = new AbortController();
  const promise = fetch(
    {
      url: data.url,
      // @ts-ignore ignore
      headers: data.header ?
        data.header :
        {
          'Content-Type': 'application/json',
        },
      method: data.method || 'GET',
    },
    {
      signal: controller.signal,
    }
  );

  promise
    .then(r => {
      data.success?.({
        statusCode: r.status,
        header: r.headers,
        data: r.json(),
        // @ts-ignore ignore
        profile: '',
      });
    })
    .catch(err => {
      data.fail?.({
        errMsg: err.message,
        errNo: '',
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
};

export const webChooseImage: BaseApis['chooseImage'] = options => {
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

export const webPreviewImage: BaseApis['previewImage'] = options => showPreviewImage(options);

export const webGetImageInfo: BaseApis['getImageInfo'] = options => {
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

export const webChooseVideo: BaseApis['chooseVideo'] = options => {
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

export const webGetFileInfo: BaseApis['getFileInfo'] = options => {
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

export const webGetStorage: BaseApis['getStorage'] = options => {
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

export const webSetStorage: BaseApis['setStorage'] = options => {
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

export const webRemoveStorage: BaseApis['removeStorage'] = options => {
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

export const webClearStorage: BaseApis['clearStorage'] = options => {
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

export const webGetStorageInfo: BaseApis['getStorageInfo'] = options => {
  let errMsg = 'clearStorage:fail';
  try {
    errMsg = 'clearStorage:ok';
    const data = webGetStorageInfoSync();
    options.success?.({ ...data, errMsg });
  } catch (e) {
    options.fail?.({ errMsg });
  }
  options.complete?.({ errMsg });
};

export const webGetStorageInfoSync: BaseApis['getStorageInfoSync'] = () => ({
  keys: Object.keys(window.localStorage),
  limitSize: 10240,
  currentSize: 1,
});

export const webGetLocation: BaseApis['getLocation'] = options => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        options.success?.(position.coords as unknown as GetLocationSuccessCallbackArgs);
      },
      err => {
        options?.fail?.({
          errMsg: err.message,
        });
      }
    );
  } else {
    options.fail?.({
      errMsg: 'The browser does not support geolocation',
    });
  }
};

export const webGetNetworkType: BaseApis['getNetworkType'] = options => {
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

export const webMakePhoneCall: BaseApis['makePhoneCall'] = options => {
  const errMsg = 'makePhoneCall:fail';
  try {
    window.open(`tel:${options.phoneNumber}`);
    options.success?.({ errMsg });
  } catch (e) {
    options.fail?.({ errMsg });
  }
  options.complete?.({ errMsg });
};

export const webPageScrollTo: BaseApis['pageScrollTo'] = options => {
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

export const webNavigateTo: BaseApis['navigateTo'] = options => {
  let errMsg: string;
  try {
    errMsg = 'navigateTo:ok';
    history.pushState({}, '', formatPath(options.url));
    options.success?.({ errMsg });
  } catch (err) {
    errMsg = `navigateTo:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};
export const webRedirectTo: BaseApis['redirectTo'] = options => {
  let errMsg: string;
  try {
    errMsg = 'redirectTo:ok';
    history.replaceState({}, '', formatPath(options.url));
    options.success?.({ errMsg });
  } catch (err) {
    errMsg = `redirectTo:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};

export const webNavigateBack: BaseApis['navigateBack'] = options => {
  let errMsg: string;
  try {
    errMsg = 'navigateBack:ok';
    const delta = options.delta || 1;
    history.go(-delta);
    options.success?.({ errMsg });
  } catch (err) {
    errMsg = `navigateBack:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};

export const webReLaunch: BaseApis['reLaunch'] = options => {
  let errMsg: string;
  try {
    errMsg = 'reLaunch:ok';
    window.location.href = options.url;
    options.success?.({ errMsg });
  } catch (err) {
    errMsg = `reLaunch:fail${err}`;
    options.fail?.({ errMsg });
  }

  options.complete?.({ errMsg });
};

export const webGetClipboardData: BaseApis['getClipboardData'] = options => {
  const errMsg = 'setClipboardData:fail';

  try {
    const data = clipboard.readSync();
    const ret = { data, errMsg: 'setClipboardData:ok' };
    options.success?.(ret);
    options.complete?.(ret);
  } catch (e) {
    options.fail?.({ errMsg });
    options.complete?.({ errMsg });
  }
};

export const webSetClipboardData: BaseApis['setClipboardData'] = options => {
  let errMsg = 'setClipboardData:fail';
  try {
    errMsg = 'setClipboardData:ok';
    clipboard.writeSync(options.data);
    options.success?.({ errMsg });
    options.complete?.({ errMsg });
  } catch (e) {
    options.fail?.({ errMsg });
    options.complete?.({ errMsg });
  }
};

export const webGetSystemInfo: BaseApis['getSystemInfo'] = options => {
  try {
    const systemInfo = webGetSystemInfoSync();
    options.success?.(systemInfo);
    options.complete?.(systemInfo);
  } catch (e) {
    options.fail?.({ errMsg: 'getSystemInfo:fail' });
    options.complete?.({ errMsg: 'getSystemInfo:fail' });
  }
};

export const webGetSystemInfoSync: BaseApis['getSystemInfoSync'] = () => {
  const { appVersion, userAgent, appName } = navigator;
  const systemInfo = {
    system: userAgent,
    // @ts-ignore ignore
    platform: navigator.userAgentData.platform,
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

export const webOpen = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
