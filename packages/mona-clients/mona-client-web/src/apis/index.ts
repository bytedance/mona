import {
  BaseApis,
  GetLocationSuccessCallbackArgs,
  NetworkType,
} from '@bytedance/mona';
import formatPath from '../utils/formatPath';
import {
  webShowToast,
  webHideToast,
  webShowLoading,
  webShowModal,
  webShowActionSheet
} from './components/';
import { createCanvasContext as originCreateCanvasContext, canvasToTempFilePath as originCanvasToTempFilePath } from './Canvas';

const noImplementFactory = (api: string) => (): any => {
  console.error(`no implement${api} in web`);
};

export const canIUse: BaseApis["canIUse"] = noImplementFactory('canIUse');
export const base64ToArrayBuffer: BaseApis["base64ToArrayBuffer"] = function(str) {
  return window.btoa(str);
}
export const arrayBufferToBase64: BaseApis["arrayBufferToBase64"] = function(str) {
  return window.atob(str);
}
export const getEnterOptionsSync: BaseApis["getEnterOptionsSync"] = noImplementFactory('getEnterOptionsSync');
export const getLaunchOptionsSync: BaseApis["getLaunchOptionsSync"] = noImplementFactory('getLaunchOptionsSync');
export const exitMiniProgram: BaseApis["exitMiniProgram"] = noImplementFactory('exitMiniProgram');
export const canIPutStuffOverComponent: BaseApis["canIPutStuffOverComponent"] = noImplementFactory('canIPutStuffOverComponent');
export const getUpdateManager: BaseApis["getUpdateManager"] = noImplementFactory('getUpdateManager');
export const onAppShow: BaseApis["onAppShow"] = noImplementFactory('onAppShow');
export const offAppShow: BaseApis["offAppShow"] = noImplementFactory('offAppShow');
export const onAppHide: BaseApis["onAppHide"] = noImplementFactory('onAppHide');
export const offAppHide: BaseApis["offAppHide"] = noImplementFactory('offAppHide');
export const onError: BaseApis["onError"] = noImplementFactory('onError');
export const offError: BaseApis["offError"] = noImplementFactory('offError');
export const env: BaseApis["env"] = {
  VERSION: '1',
  USER_DATA_PATH: '/',
};
export const downloadFile: BaseApis["downloadFile"] = noImplementFactory('downloadFile');
export const request: BaseApis["request"] = noImplementFactory('request');
export const uploadFile: BaseApis["uploadFile"] = noImplementFactory('uploadFile');
export const connectSocket: BaseApis["connectSocket"] = noImplementFactory('connectSocket');
export const chooseImage: BaseApis["chooseImage"] = noImplementFactory('chooseImage');
export const saveImageToPhotosAlbum: BaseApis["saveImageToPhotosAlbum"] = noImplementFactory('saveImageToPhotosAlbum');
export const previewImage: BaseApis["previewImage"] = noImplementFactory('previewImage');
export const getImageInfo: BaseApis["getImageInfo"] = noImplementFactory('getImageInfo');
export const compressImage: BaseApis["compressImage"] = noImplementFactory('compressImage');
export const getRecorderManager: BaseApis["getRecorderManager"] = noImplementFactory('getRecorderManager');
export const getBackgroundAudioManager: BaseApis["getBackgroundAudioManager"] = noImplementFactory('getBackgroundAudioManager');
export const createInnerAudioContext: BaseApis["createInnerAudioContext"] = noImplementFactory('createInnerAudioContext');
export const chooseVideo: BaseApis["chooseVideo"] = noImplementFactory('chooseVideo');
export const saveVideoToPhotoAlbum: BaseApis["saveVideoToPhotoAlbum"] = noImplementFactory('saveVideoToPhotoAlbum');
export const createVideoContext: BaseApis["createVideoContext"] = noImplementFactory('createVideoContext');
export const createLivePlayerContext: BaseApis["createLivePlayerContext"] = noImplementFactory('createLivePlayerContext');
export const preloadVideo: BaseApis["preloadVideo"] = noImplementFactory('preloadVideo');
export const createCameraContext: BaseApis["createCameraContext"] = noImplementFactory('createCameraContext');
export const createEffectCameraStream: BaseApis["createEffectCameraStream"] = noImplementFactory('createEffectCameraStream');
export const createMapContext: BaseApis["createMapContext"] = noImplementFactory('createMapContext');
export const saveFile: BaseApis["saveFile"] = noImplementFactory('saveFile');
export const getFileInfo: BaseApis["getFileInfo"] = noImplementFactory('getFileInfo');
export const getSavedFileList: BaseApis["getSavedFileList"] = noImplementFactory('getSavedFileList');
export const openDocument: BaseApis["openDocument"] = noImplementFactory('openDocument');
export const removeSavedFile: BaseApis["removeSavedFile"] = noImplementFactory('removeSavedFile');
export const getFileSystemManager: BaseApis["getFileSystemManager"] = noImplementFactory('getFileSystemManager');
export const getEnvInfoSync: BaseApis["getEnvInfoSync"] = noImplementFactory('getEnvInfoSync');
export const login: BaseApis["login"] = noImplementFactory('login');
export const checkSession: BaseApis["checkSession"] = noImplementFactory('checkSession');
export const getUserInfo: BaseApis["getUserInfo"] = noImplementFactory('getUserInfo');
export const getUserInfoProfile: BaseApis["getUserInfoProfile"] = noImplementFactory('getUserInfoProfile');
export const createRewardedVideoAd: BaseApis["createRewardedVideoAd"] = noImplementFactory('createRewardedVideoAd');
export const createInterstitialAd: BaseApis["createInterstitialAd"] = noImplementFactory('createInterstitialAd');
export const pay: BaseApis["pay"] = noImplementFactory('pay');
export const navigateToMiniProgram: BaseApis["navigateToMiniProgram"] = noImplementFactory('navigateToMiniProgram');
export const navigateBackMiniProgram: BaseApis["navigateBackMiniProgram"] = noImplementFactory('navigateBackMiniProgram');
export const chooseAddresses: BaseApis["chooseAddresses"] = noImplementFactory('chooseAddresses');
export const getSetting: BaseApis["getSetting"] = noImplementFactory('getSetting');
export const openSettings: BaseApis["openSettings"] = noImplementFactory('openSettings');
export const authorize: BaseApis["authorize"] = noImplementFactory('authorize');
export const showDouyinOpenAuth: BaseApis["showDouyinOpenAuth"] = noImplementFactory('showDouyinOpenAuth');
export const reportAnalytics: BaseApis["reportAnalytics"] = noImplementFactory('reportAnalytics');
export const canRateAwemeOrders: BaseApis["canRateAwemeOrders"] = noImplementFactory('canRateAwemeOrders');
export const rateAwemeOrder: BaseApis["rateAwemeOrder"] = noImplementFactory('rateAwemeOrder');
export const followOfficialAccount: BaseApis["followOfficialAccount"] = noImplementFactory('followOfficialAccount');
export const checkFollowState: BaseApis["checkFollowState"] = noImplementFactory('checkFollowState');
export const openAwemeUserProfile: BaseApis["openAwemeUserProfile"] = noImplementFactory('openAwemeUserProfile');
export const followAwemeUser: BaseApis["followAwemeUser"] = noImplementFactory('followAwemeUser');
export const requestSubscribeMessage: BaseApis["requestSubscribeMessage"] = noImplementFactory('requestSubscribeMessage');
export const openDouyinOrderList: BaseApis["openDouyinOrderList"] = noImplementFactory('openDouyinOrderList');
export const openEcGood: BaseApis["openEcGood"] = noImplementFactory('openEcGood');
export const openEcOrderDetail: BaseApis["openEcOrderDetail"] = noImplementFactory('openEcOrderDetail');
export const openEcIm: BaseApis["openEcIm"] = noImplementFactory('openEcIm');
export const openEcChat: BaseApis["openEcChat"] = noImplementFactory('openEcChat');
export const openWebcastRoom: BaseApis["openWebcastRoom"] = noImplementFactory('openWebcastRoom');
export const openDouyinProfile: BaseApis["openDouyinProfile"] = noImplementFactory('openDouyinProfile');
export const openEcCoupon: BaseApis["openEcCoupon"] = noImplementFactory('openEcCoupon');
export const performance: BaseApis["performance"] = {
  getEntries: noImplementFactory('getEntries'),
  getEntriesByName: noImplementFactory('getEntriesByName'),
  getEntriesByType: noImplementFactory('getEntriesByType'),
  getCurrentPageEntries: noImplementFactory('getCurrentPageEntries'),
  getEntriesByPage: noImplementFactory('getEntriesByPage'),
  mark: noImplementFactory('mark'),
  clearMarks: noImplementFactory('clearnMarks'),
};
export const getStorage: BaseApis["getStorage"] = noImplementFactory('getStorage');
export const getStorageSync: BaseApis["getStorageSync"] = function(key) {
  return window.localStorage.getItem(key);
}
export const setStorage: BaseApis["setStorage"] = noImplementFactory('setStorage');
export const setStorageSync: BaseApis["setStorageSync"] = function(key, value) {
  window.localStorage.setItem(key, value);
}
export const removeStorage: BaseApis["removeStorage"] = noImplementFactory('removeStorage');
export const removeStorageSync: BaseApis["removeStorageSync"] = function(key: string) {
  window.localStorage.removeItem(key);
}
export const clearStorage: BaseApis["clearStorage"] = noImplementFactory('clearStorage');
export const clearStorageSync: BaseApis["clearStorageSync"] = function() {
  window.localStorage.clear();
}
export const getStorageInfo: BaseApis["getStorageInfo"] = noImplementFactory('getStorageInfo');
export const getStorageInfoSync: BaseApis["getStorageInfoSync"] = function() {
  return {
    keys: Object.keys(window.localStorage),
    limitSize: 10240,
    currentSize: 1,
  };
}
export const getLocation: BaseApis["getLocation"] = function(options) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        options.success?.(
          position.coords as unknown as GetLocationSuccessCallbackArgs
        );
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
}
export const chooseLocation: BaseApis["chooseLocation"] = noImplementFactory('chooseLocation');
export const openLocation: BaseApis["openLocation"] = noImplementFactory('openLocation');
export const getNetworkType: BaseApis["getNetworkType"] = function(options) {
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
}
export const onNetworkStatusChange: BaseApis["onNetworkStatusChange"] = noImplementFactory('onNetworkStatusChange');
export const getWifiList: BaseApis["getWifiList"] = noImplementFactory('getWifiList');
export const onGetWifiList: BaseApis["onGetWifiList"] = noImplementFactory('onGetWifiList');
export const offGetWifiList: BaseApis["offGetWifiList"] = noImplementFactory('offGetWifiList');
export const getSystemInfo: BaseApis["getSystemInfo"] = noImplementFactory('getSystemInfo');
export const getSystemInfoSync: BaseApis["getSystemInfoSync"] = noImplementFactory('getSystemInfoSync');
export const getConnectedWifi: BaseApis["getConnectedWifi"] = noImplementFactory('getConnectedWifi');
export const startAccelerometer: BaseApis["startAccelerometer"] = noImplementFactory('startAccelerometer');
export const stopAccelerometer: BaseApis["stopAccelerometer"] = noImplementFactory('stopAccelerometer');
export const onAccelerometerChange: BaseApis["onAccelerometerChange"] = noImplementFactory('onAccelerometerChange');
export const startCompass: BaseApis["startCompass"] = noImplementFactory('startCompass');
export const stopCompass: BaseApis["stopCompass"] = noImplementFactory('stopCompass');
export const onCompassChange: BaseApis["onCompassChange"] = noImplementFactory('onCompassChange');
export const makePhoneCall: BaseApis["makePhoneCall"] = noImplementFactory('makePhoneCall');
export const scanCode: BaseApis["scanCode"] = noImplementFactory('scanCode');
export const getClipboardData: BaseApis["getClipboardData"] = noImplementFactory('getClipboardData');
export const setClipboardData: BaseApis["setClipboardData"] = noImplementFactory('setClipboardData');
export const setKeepScreenOn: BaseApis["setKeepScreenOn"] = noImplementFactory('setKeepScreenOn');
export const onUserCaptureScreen: BaseApis["onUserCaptureScreen"] = noImplementFactory('onUserCaptureScreen');
export const offUserCaptureScreen: BaseApis["offUserCaptureScreen"] = noImplementFactory('offUserCaptureScreen');
export const getScreenBrightness: BaseApis["getScreenBrightness"] = noImplementFactory('getScreenBrightness');
export const setScreenBrightness: BaseApis["setScreenBrightness"] = noImplementFactory('setScreenBrightness');
export const disableUserScreenRecord: BaseApis["disableUserScreenRecord"] = noImplementFactory('disableUserScreenRecord');
export const enableUserScreenRecord: BaseApis["enableUserScreenRecord"] = noImplementFactory('enableUserScreenRecord');
export const onUserScreenRecord: BaseApis["onUserScreenRecord"] = noImplementFactory('onUserScreenRecord');
export const offUserScreenRecord: BaseApis["offUserScreenRecord"] = noImplementFactory('offUserScreenRecord');
export const vibrateShort: BaseApis["vibrateShort"] = noImplementFactory('vibrateShort');
export const vibrateLong: BaseApis["vibrateLong"] = noImplementFactory('vibrateLong');
export const onMemoryWarning: BaseApis["onMemoryWarning"] = noImplementFactory('onMemoryWarning');
export const createCanvasContext: BaseApis["createCanvasContext"] = originCreateCanvasContext;
export const canvasToTempFilePath: BaseApis["canvasToTempFilePath"] = originCanvasToTempFilePath;
export const createOffscreenCanvas: BaseApis["createOffscreenCanvas"] = noImplementFactory('createOffscreenCanvas');
export const showToast: BaseApis["showToast"] = function(config) {
  webShowToast(config);
}
export const hideToast: BaseApis["hideToast"] = webHideToast;
export const showLoading: BaseApis["showLoading"] = function(options) {
  webShowLoading(options);
}
export const hideLoading: BaseApis["hideLoading"] = webHideToast;
export const showModal: BaseApis['showModal'] = function(options) {
  webShowModal(options);
}
export const showActionSheet: BaseApis["showActionSheet"] = function(options) {
  webShowActionSheet(options);
}

export const showFavoriteGuide: BaseApis["showFavoriteGuide"] = noImplementFactory('showFavoriteGuide');
export const showInteractionBar: BaseApis["showInteractionBar"] = noImplementFactory('showInteractionBar');
export const hideInteractionBar: BaseApis["hideInteractionBar"] = noImplementFactory('hideInteractionBar');
export const showNavigationBarLoading: BaseApis["showNavigationBarLoading"] = noImplementFactory('showNavigationBarLoading');
export const hideNavigationBarLoading: BaseApis["hideNavigationBarLoading"] = noImplementFactory('hideNavigationBarLoading');
export const hideHomeButton: BaseApis["hideHomeButton"] = noImplementFactory('hideHomeButton');
export const setNavigationBarTitle: BaseApis["setNavigationBarTitle"] = noImplementFactory('setNavigationBarTitle');
export const setNavigationBarColor: BaseApis["setNavigationBarColor"] = noImplementFactory('setNavigationBarColor');
export const getMenuButtonBoundingClientRect: BaseApis["getMenuButtonBoundingClientRect"] = noImplementFactory(
  'getMenuButtonBoundingClientRect'
);
export const createAnimation: BaseApis["createAnimation"] = noImplementFactory('createAnimation');
export const pageScrollTo: BaseApis["pageScrollTo"] = function(options) {
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
}
export const setSwipeBackMode: BaseApis["setSwipeBackMode"] = noImplementFactory('setSwipeBackMode');
export const startPullDownRefresh: BaseApis["startPullDownRefresh"] = noImplementFactory('startPullDownRefresh');
export const showTabBarRedDot: BaseApis["showTabBarRedDot"] = noImplementFactory('showTabBarRedDot');
export const showTabBar: BaseApis["showTabBar"] = noImplementFactory('showTabBar');
export const setTabBarStyle: BaseApis["setTabBarStyle"] = noImplementFactory('setTabBarStyle');
export const setTabBarItem: BaseApis["setTabBarItem"] = noImplementFactory('setTabBarItem');
export const setTabBarBadge: BaseApis["setTabBarBadge"] = noImplementFactory('setTabBarBadge');
export const removeTabBarBadge: BaseApis["removeTabBarBadge"] = noImplementFactory('removeTabBarBadge');
export const hideTabBarRedDot: BaseApis["hideTabBarRedDot"] = noImplementFactory('hideTabBarRedDot');
export const hideTabBar: BaseApis["hideTabBar"] = noImplementFactory('hideTabBar');
export const getAlgorithmManager: BaseApis["getAlgorithmManager"] = noImplementFactory('getAlgorithmManager');
export const createStickerManager: BaseApis["createStickerManager"] = noImplementFactory('createStickerManager');
export const createBytennEngineContext: BaseApis["createBytennEngineContext"] = noImplementFactory('createBytennEngineContext');
export const navigateTo: BaseApis["navigateTo"] = function(options) {
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
}
export const redirectTo: BaseApis["redirectTo"] = function(options) {
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
}
export const switchTab: BaseApis["switchTab"] = noImplementFactory('switchTab');
export const navigateBack: BaseApis["navigateBack"] = function(options) {
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
}
export const reLaunch: BaseApis["reLaunch"] = function(options) {
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
}
export const showShareMenu: BaseApis["showShareMenu"] = noImplementFactory('showShareMenu');
export const hideShareMenu: BaseApis["hideShareMenu"] = noImplementFactory('hideShareMenu');
export const navigateToVideoView: BaseApis["navigateToVideoView"] = noImplementFactory('navigateToVideoView');
export const getExtConfig: BaseApis["getExtConfig"] = noImplementFactory('getExtConfig');
export const getExtConfigSync: BaseApis["getExtConfigSync"] = noImplementFactory('getExtConfigSync');
export const createSelectorQuery: BaseApis["createSelectorQuery"] = noImplementFactory('createSelectorQuery');
export const createIntersectionObserver: BaseApis["createIntersectionObserver"] = noImplementFactory('createIntersectionObserver');
export const createLiveReportContext: BaseApis["createLiveReportContext"] = noImplementFactory('createLiveReportContext');
export const getRoomInfo: BaseApis["getRoomInfo"] = noImplementFactory('getRoomInfo');
export const getLiveUserInfo: BaseApis["getLiveUserInfo"] = noImplementFactory('getLiveUserInfo');
export const getSelfCommentCountDuringPluginRunning: BaseApis["getSelfCommentCountDuringPluginRunning"] = noImplementFactory(
  'getSelfCommentCountDuringPluginRunning'
);
export const isFollowingAnchor: BaseApis["isFollowingAnchor"] = noImplementFactory('isFollowingAnchor');
export const onReceiveAudiencesFollowAction: BaseApis["onReceiveAudiencesFollowAction"] = noImplementFactory(
  'onReceiveAudiencesFollowAction'
);
export const subscribeAudiencesFollowAction: BaseApis["subscribeAudiencesFollowAction"] = noImplementFactory(
  'subscribeAudiencesFollowAction'
);
export const unsubscribeAudiencesFollowAction: BaseApis["unsubscribeAudiencesFollowAction"] = noImplementFactory(
  'unsubscribeAudiencesFollowAction'
);
export const subscribeSpecifiedContentComment: BaseApis["subscribeSpecifiedContentComment"] = noImplementFactory(
  'subscribeSpecifiedContentComment'
);
export const subscribeSpecifiedUserComment: BaseApis["subscribeSpecifiedUserComment"] = noImplementFactory(
  'subscribeSpecifiedUserComment'
);
export const unsubscribeAllSpecifiedContentComment: BaseApis["unsubscribeAllSpecifiedContentComment"] = noImplementFactory(
  'unsubscribeAllSpecifiedContentComment'
);
export const unsubscribeAllSpecifiedUserComment: BaseApis["unsubscribeAllSpecifiedUserComment"] = noImplementFactory(
  'unsubscribeAllSpecifiedUserComment'
);
export const onReceiveSpecifiedComment: BaseApis["onReceiveSpecifiedComment"] = noImplementFactory('onReceiveSpecifiedComment');
export const open: BaseApis["open"] = noImplementFactory('open');

