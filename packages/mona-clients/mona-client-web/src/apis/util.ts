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

export const LIGHT_APP_GET_TOEKN = '__MONA_LIGHT_APP_GET_TOEKN';

export function webRequest(data: Omit<RequestOptions, 'url'>): RequestTask;
export function webRequest(data: Omit<RequestOptions, 'fn'>): RequestTask;
export function webRequest(data: RequestOptions): RequestTask;

// @ts-ignore ignore
export async function webRequest(data: Partial<RequestOptions>): RequestTask | Promise<any> {
  if (typeof data.url === 'undefined' && typeof data.fn === 'undefined') {
    return Promise.reject(new Error('url and funcName must be specified'));
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

  const isLightApp = data.fn && window.__MONA_LIGHT_APP_GET_TOEKN;
  let token = '';
  // light app
  if (isLightApp) {
    token = await window.__MONA_LIGHT_APP_GET_TOEKN!();
    init.credentials = 'include';
    init.method = 'POST';
    init.headers = {
      ...init.headers,
      'x-open-token': token,
      'x-use-test': window.__MONA_LIGHT_USE_TEST,
      'x-open-compass': window?.__MONA_LIGHT_APP_GET_COMPASS_TOKEN ? window.__MONA_LIGHT_APP_GET_COMPASS_TOKEN() : '',
    };
    const appId = window.__MONA_LIGHT_APP_LIFE_CYCLE_LANUCH_QUERY.appId;
    data.data = {
      appId,
      method: data.fn,
      param: JSON.stringify(data.data),
    };
  }

  if (data.credentials) init.credentials = data.credentials;

  // if app not mirco app ,but set fn params, prompt waring
  if (data.fn && !isLightApp) {
    console.error(`必须在主端调用微应用${data.fn}`);
  }

  const url = isLightApp ? `https://${window.__MONA_LIGNT_APP_DOMAIN_NAME}/invoke` : data.url;

  if ((init.method as string).toUpperCase() === 'POST') {
    init.body = data.body ? data.body : data.data ? JSON.stringify(data.data) : '';
  }
  const promise = fetch(url as string, init);

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
            console.warn(`not valid json for ${r.data}, use origin data`);
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

export const webGetSetting: OriginApis['getSetting'] = options => {
  try {
    // @ts-ignore
    const appid = window[MONA_APPID];
    console.log('appid', appid);
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

const showModal = (() => {
  const lockImageSrc =
    'https://lf3-cm.ecombdstatic.com/obj/ecom-ecop/16859664756206317f28becf25b894f90ca1c8c01ef438e29d.png';
  let hasCreateModalFlag = false;
  let modalOverlayElement: HTMLDivElement;
  let modalElement: HTMLDivElement;
  let modalBodyElement: HTMLDivElement;
  let rejectButtonElement: HTMLButtonElement;
  let allowButtonElement: HTMLButtonElement;
  let modalCloseButtonElement: HTMLDivElement;
  //预加载图片
  const modalImgElement = new Image();
  modalImgElement.src = lockImageSrc;

  return (authorizationText: string, allowCallback: any, rejectCallback: any) => {
    const closeModal = () => {
      modalOverlayElement.style.display = 'none';
      modalElement.style.display = 'none';
      allowButtonElement.removeEventListener('click', handleAllow);
      rejectButtonElement.removeEventListener('click', handleReject);
      modalCloseButtonElement.removeEventListener('click', handleReject);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
    const handleAllow = () => {
      closeModal();
      allowCallback();
    };
    const handleReject = () => {
      closeModal();
      rejectCallback();
    };
    // 控制底层不可滑动
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (hasCreateModalFlag) {
      modalBodyElement.innerText = authorizationText;
      allowButtonElement.addEventListener('click', handleAllow);
      rejectButtonElement.addEventListener('click', handleReject);
      modalCloseButtonElement.addEventListener('click', handleReject);
      modalOverlayElement.style.display = 'block';
      modalElement.style.display = 'flex';
    } else {
      hasCreateModalFlag = true;
      // 创建弹窗元素
      modalOverlayElement = document.createElement('div');
      modalOverlayElement.classList.add('modal-overlay');
      modalElement = document.createElement('div');
      modalElement.classList.add('modal');
      // 创建关闭按钮元素
      modalCloseButtonElement = document.createElement('div');
      modalCloseButtonElement.classList.add('modal-close-button');
      modalCloseButtonElement.addEventListener('click', handleReject);
      const modalCloseIconElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      modalCloseIconElement.setAttribute('width', '12');
      modalCloseIconElement.setAttribute('height', '12');
      modalCloseIconElement.setAttribute('viewBox', '0 0 12 12');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        'M11.0139 9.59969C11.4045 9.99021 11.4045 10.6234 11.0139 11.0139C10.6234 11.4044 9.99024 11.4044 9.59972 11.0139L6.00003 7.41421L2.40034 11.0139C2.00982 11.4044 1.37665 11.4044 0.986131 11.0139C0.595606 10.6234 0.595606 9.99021 0.986131 9.59969L4.58582 6L0.986131 2.40031C0.595606 2.00979 0.595606 1.37662 0.986131 0.9861C1.37665 0.595576 2.00982 0.595576 2.40034 0.9861L6.00003 4.58579L9.59972 0.9861C9.99024 0.595576 10.6234 0.595576 11.0139 0.9861C11.4045 1.37662 11.4045 2.00979 11.0139 2.40031L7.41424 6L11.0139 9.59969Z',
      );
      path.setAttribute('fill', '#161823');
      modalCloseIconElement.appendChild(path);
      modalCloseButtonElement.appendChild(modalCloseIconElement);

      // 图片元素
      modalImgElement.classList.add('modal-img');

      // 创建标题元素
      const modalTitleElement = document.createElement('div');
      modalTitleElement.classList.add('modal-title');
      modalTitleElement.innerText = '应用程序请求授权';

      // 创建正文元素
      modalBodyElement = document.createElement('div');
      modalBodyElement.classList.add('modal-body');
      modalBodyElement.innerText = authorizationText;

      // 创建底部按钮元素
      const modalFooterElement = document.createElement('div');
      modalFooterElement.classList.add('modal-footer');
      rejectButtonElement = document.createElement('button');
      rejectButtonElement.classList.add('modal-button', 'reject-button');
      rejectButtonElement.innerText = '拒绝';
      rejectButtonElement.type = 'button';
      rejectButtonElement.addEventListener('click', handleReject);
      allowButtonElement = document.createElement('button');
      allowButtonElement.classList.add('modal-button', 'allow-button');
      allowButtonElement.innerText = '允许';
      allowButtonElement.type = 'button';
      allowButtonElement.addEventListener('click', handleAllow);
      modalFooterElement.appendChild(rejectButtonElement);
      modalFooterElement.appendChild(allowButtonElement);

      // 将所有子元素添加到弹窗元素中
      modalElement.appendChild(modalCloseButtonElement);
      modalElement.appendChild(modalImgElement);
      modalElement.appendChild(modalTitleElement);
      modalElement.appendChild(modalBodyElement);
      modalElement.appendChild(modalFooterElement);

      // 将弹窗元素添加到body中
      document.body.appendChild(modalOverlayElement);
      document.body.appendChild(modalElement);
      const styleElement = document.createElement('style');
      styleElement.textContent = `
.modal-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: #000000;
opacity: 0.6;
display: block;
}

.modal {
border-top-left-radius: 12px;
border-top-right-radius: 12px;
position: fixed;
bottom: 0;
left: 0;
background: #fff;
width: 100%;
box-sizing: border-box;
height: 334px;
display: flex;
flex-direction: column;
align-items: center;
color: black;
padding: 31px 16px 46px 16px;
font-family: 'PingFang SC';
font-style: normal;
}

.modal-close-button {
width: 28px;
height: 28px;
border-radius: 50%;
background: rgba(22, 24, 35, 0.05);
position: absolute;
top: 12px;
right: 12px;
display: flex;
align-items: center;
justify-content: center;
}


.modal-img {
width: 160px;
height: 122px;
margin: 0 auto;
}

.modal-header {
padding: 16px;
}

.modal-title {
margin-top: 14px;
font-weight: 500;
font-size: 17px;
line-height: 24px;
text-align: center;
color: #161823;
}

.modal-body {
font-weight: 400;
font-size: 14px;
line-height: 20px;
text-align: center;
color: rgba(22, 24, 35, 0.75);
margin: 8px 0 24px 0;
}

.modal-footer {
display: flex;
justify-content: center;
align-items: center;
}

.modal-button {
width: 167.5px;
height: 44px;
font-weight: 500;
font-size: 15px;
line-height: 21px;
border-radius: 4px;
border: 0;
cursor: pointer;
display: flex;
justify-content: center;
align-items: center;
}

.allow-button {
background-color: #1966ff;
margin-left: 4px;
color: #fff;
}

.reject-button {
background-color: rgba(22, 24, 35, 0.05);
margin-right: 4px;
color: #161823;
}
`;
      // 将样式元素添加到head中
      document.head.appendChild(styleElement);
    }
  };
})();
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
    window[MONA_JSAPI_LIST]?.find((item: any) => item?.jsApiName === options.apiName)?.reqAuthDesc || '请求您的授权';
  showModal(authorizationText, allowCallback, rejectCallback);
};

export const webOpen = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

export const webNavigateToApp: BaseApis['navigateToApp'] = (info, options) => {
  window.__MONA_LIGHT_APP_NAVIGATE_CB?.(info, options);
};
