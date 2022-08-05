import { BaseApis } from '@bytedance/mona';
import { webShowToast, webHideToast, webShowLoading, webShowModal, webShowActionSheet } from './components';
import {
  createCanvasContext as originCreateCanvasContext,
  canvasToTempFilePath as originCanvasToTempFilePath,
} from './Canvas';
import { promisify } from '@bytedance/mona-shared';

import {
  webChooseImage,
  webChooseVideo,
  webClearStorage,
  webClearStorageSync,
  webCreateVideoContext,
  webGetClipboardData,
  webGetFileInfo,
  webGetImageInfo,
  webGetLocation,
  webGetNetworkType,
  webGetStorage,
  webGetStorageInfo,
  webGetStorageInfoSync,
  webGetStorageSync,
  webGetSystemInfo,
  webGetSystemInfoSync,
  webMakePhoneCall,
  webNavigateBack,
  webNavigateTo,
  webOpen,
  webPageScrollTo,
  webPreviewImage,
  webRedirectTo,
  webReLaunch,
  webRemoveStorage,
  webRemoveStorageSync,
  webRequest,
  webSetClipboardData,
  webSetStorage,
  webSetStorageSync,
  webSwitchTab,
  webNavigateToApp,
} from './util';
import EventEmitter from '../EventEmitter';

const eventEmitter = new EventEmitter();

const noImplementFactory = (api: string) => (): any => {
  console.error(`no implement${api} in web`);
};

export const canIUse: BaseApis['canIUse'] = noImplementFactory('canIUse');
export const base64ToArrayBuffer: BaseApis['base64ToArrayBuffer'] = str => window.btoa(str);
export const arrayBufferToBase64: BaseApis['arrayBufferToBase64'] = str => window.atob(str);
export const getEnterOptionsSync: BaseApis['getEnterOptionsSync'] = noImplementFactory('getEnterOptionsSync');
export const getLaunchOptionsSync: BaseApis['getLaunchOptionsSync'] = noImplementFactory('getLaunchOptionsSync');
export const exitMiniProgram: BaseApis['exitMiniProgram'] = promisify(noImplementFactory('exitMiniProgram'));
export const canIPutStuffOverComponent: BaseApis['canIPutStuffOverComponent'] =
  noImplementFactory('canIPutStuffOverComponent');
export const getUpdateManager: BaseApis['getUpdateManager'] = noImplementFactory('getUpdateManager');
export const onAppShow: BaseApis['onAppShow'] = noImplementFactory('onAppShow');
export const offAppShow: BaseApis['offAppShow'] = noImplementFactory('offAppShow');
export const onAppHide: BaseApis['onAppHide'] = noImplementFactory('onAppHide');
export const offAppHide: BaseApis['offAppHide'] = noImplementFactory('offAppHide');
export const onError: BaseApis['onError'] = noImplementFactory('onError');
export const offError: BaseApis['offError'] = noImplementFactory('offError');
export const env: BaseApis['env'] = {
  VERSION: '1',
  USER_DATA_PATH: '/',
};
export const downloadFile: BaseApis['downloadFile'] = promisify(noImplementFactory('downloadFile'));
export const request: BaseApis['request'] = promisify(webRequest);
export const uploadFile: BaseApis['uploadFile'] = promisify(noImplementFactory('uploadFile'));
export const connectSocket: BaseApis['connectSocket'] = promisify(noImplementFactory('connectSocket'));
export const chooseImage: BaseApis['chooseImage'] = promisify(webChooseImage);
export const saveImageToPhotosAlbum: BaseApis['saveImageToPhotosAlbum'] = promisify(
  noImplementFactory('saveImageToPhotosAlbum'),
);
export const previewImage: BaseApis['previewImage'] = promisify(webPreviewImage);
export const getImageInfo: BaseApis['getImageInfo'] = promisify(webGetImageInfo);
export const compressImage: BaseApis['compressImage'] = promisify(noImplementFactory('compressImage'));
export const getRecorderManager: BaseApis['getRecorderManager'] = noImplementFactory('getRecorderManager');
export const getBackgroundAudioManager: BaseApis['getBackgroundAudioManager'] =
  noImplementFactory('getBackgroundAudioManager');
export const createInnerAudioContext: BaseApis['createInnerAudioContext'] =
  noImplementFactory('createInnerAudioContext');
export const chooseVideo: BaseApis['chooseVideo'] = promisify(webChooseVideo);
export const saveVideoToPhotoAlbum: BaseApis['saveVideoToPhotoAlbum'] = promisify(
  noImplementFactory('saveVideoToPhotoAlbum'),
);
export const createVideoContext: BaseApis['createVideoContext'] = webCreateVideoContext;
export const createLivePlayerContext: BaseApis['createLivePlayerContext'] =
  noImplementFactory('createLivePlayerContext');
export const preloadVideo: BaseApis['preloadVideo'] = promisify(noImplementFactory('preloadVideo'));
export const createCameraContext: BaseApis['createCameraContext'] = noImplementFactory('createCameraContext');
export const createEffectCameraStream: BaseApis['createEffectCameraStream'] =
  noImplementFactory('createEffectCameraStream');
export const createMapContext: BaseApis['createMapContext'] = noImplementFactory('createMapContext');
export const saveFile: BaseApis['saveFile'] = promisify(noImplementFactory('saveFile'));
export const getFileInfo: BaseApis['getFileInfo'] = promisify(webGetFileInfo);
export const getSavedFileList: BaseApis['getSavedFileList'] = promisify(noImplementFactory('getSavedFileList'));
export const openDocument: BaseApis['openDocument'] = promisify(noImplementFactory('openDocument'));
export const removeSavedFile: BaseApis['removeSavedFile'] = promisify(noImplementFactory('removeSavedFile'));
export const getFileSystemManager: BaseApis['getFileSystemManager'] = noImplementFactory('getFileSystemManager');
export const getEnvInfoSync: BaseApis['getEnvInfoSync'] = noImplementFactory('getEnvInfoSync');
export const login: BaseApis['login'] = promisify(noImplementFactory('login'));
export const checkSession: BaseApis['checkSession'] = promisify(noImplementFactory('checkSession'));
export const getUserInfo: BaseApis['getUserInfo'] = promisify(noImplementFactory('getUserInfo'));
export const getUserInfoProfile: BaseApis['getUserInfoProfile'] = promisify(noImplementFactory('getUserInfoProfile'));
export const createRewardedVideoAd: BaseApis['createRewardedVideoAd'] = noImplementFactory('createRewardedVideoAd');
export const createInterstitialAd: BaseApis['createInterstitialAd'] = noImplementFactory('createInterstitialAd');
export const pay: BaseApis['pay'] = promisify(noImplementFactory('pay'));
export const navigateToMiniProgram: BaseApis['navigateToMiniProgram'] = promisify(
  noImplementFactory('navigateToMiniProgram'),
);
export const navigateToApp: BaseApis['navigateToApp'] = window.__MONA_LIGHT_APP_NAVIGATE_CB
  ? promisify(webNavigateToApp)
  : noImplementFactory('navigateToApp');
export const navigateBackMiniProgram: BaseApis['navigateBackMiniProgram'] = promisify(
  noImplementFactory('navigateBackMiniProgram'),
);
export const chooseAddresses: BaseApis['chooseAddresses'] = promisify(noImplementFactory('chooseAddresses'));
export const getSetting: BaseApis['getSetting'] = promisify(noImplementFactory('getSetting'));
export const openSettings: BaseApis['openSettings'] = promisify(noImplementFactory('openSettings'));
export const authorize: BaseApis['authorize'] = promisify(noImplementFactory('authorize'));
export const showDouyinOpenAuth: BaseApis['showDouyinOpenAuth'] = promisify(noImplementFactory('showDouyinOpenAuth'));
export const reportAnalytics: BaseApis['reportAnalytics'] = noImplementFactory('reportAnalytics');
export const canRateAwemeOrders: BaseApis['canRateAwemeOrders'] = promisify(noImplementFactory('canRateAwemeOrders'));
export const rateAwemeOrder: BaseApis['rateAwemeOrder'] = promisify(noImplementFactory('rateAwemeOrder'));
export const followOfficialAccount: BaseApis['followOfficialAccount'] = promisify(
  noImplementFactory('followOfficialAccount'),
);
export const checkFollowState: BaseApis['checkFollowState'] = promisify(noImplementFactory('checkFollowState'));
export const openAwemeUserProfile: BaseApis['openAwemeUserProfile'] = promisify(
  noImplementFactory('openAwemeUserProfile'),
);
export const followAwemeUser: BaseApis['followAwemeUser'] = promisify(noImplementFactory('followAwemeUser'));
export const requestSubscribeMessage: BaseApis['requestSubscribeMessage'] = promisify(
  noImplementFactory('requestSubscribeMessage'),
);
export const openDouyinOrderList: BaseApis['openDouyinOrderList'] = promisify(
  noImplementFactory('openDouyinOrderList'),
);
export const openEcGood: BaseApis['openEcGood'] = promisify(noImplementFactory('openEcGood'));
export const openEcOrderDetail: BaseApis['openEcOrderDetail'] = promisify(noImplementFactory('openEcOrderDetail'));
export const openEcIm: BaseApis['openEcIm'] = promisify(noImplementFactory('openEcIm'));
export const openEcChat: BaseApis['openEcChat'] = promisify(noImplementFactory('openEcChat'));
export const openWebcastRoom: BaseApis['openWebcastRoom'] = promisify(noImplementFactory('openWebcastRoom'));
export const openDouyinProfile: BaseApis['openDouyinProfile'] = promisify(noImplementFactory('openDouyinProfile'));
export const openEcCoupon: BaseApis['openEcCoupon'] = promisify(noImplementFactory('openEcCoupon'));
export const performance: BaseApis['performance'] = {
  getEntries: noImplementFactory('getEntries'),
  getEntriesByName: noImplementFactory('getEntriesByName'),
  getEntriesByType: noImplementFactory('getEntriesByType'),
  getCurrentPageEntries: noImplementFactory('getCurrentPageEntries'),
  getEntriesByPage: noImplementFactory('getEntriesByPage'),
  mark: noImplementFactory('mark'),
  clearMarks: noImplementFactory('clearnMarks'),
};

export const getStorage: BaseApis['getStorage'] = promisify(webGetStorage);
export const getStorageSync: BaseApis['getStorageSync'] = webGetStorageSync;

export const setStorage: BaseApis['setStorage'] = promisify(webSetStorage);
export const setStorageSync: BaseApis['setStorageSync'] = webSetStorageSync;
export const removeStorage: BaseApis['removeStorage'] = promisify(webRemoveStorage);
export const removeStorageSync: BaseApis['removeStorageSync'] = webRemoveStorageSync;
export const clearStorage: BaseApis['clearStorage'] = promisify(webClearStorage);
export const clearStorageSync: BaseApis['clearStorageSync'] = webClearStorageSync;
export const getStorageInfo: BaseApis['getStorageInfo'] = promisify(webGetStorageInfo);
export const getStorageInfoSync: BaseApis['getStorageInfoSync'] = webGetStorageInfoSync;
export const getLocation: BaseApis['getLocation'] = promisify(webGetLocation);
export const chooseLocation: BaseApis['chooseLocation'] = promisify(noImplementFactory('chooseLocation'));
export const openLocation: BaseApis['openLocation'] = promisify(noImplementFactory('openLocation'));
export const getNetworkType: BaseApis['getNetworkType'] = promisify(webGetNetworkType);
export const onNetworkStatusChange: BaseApis['onNetworkStatusChange'] = noImplementFactory('onNetworkStatusChange');
export const getWifiList: BaseApis['getWifiList'] = promisify(noImplementFactory('getWifiList'));
export const onGetWifiList: BaseApis['onGetWifiList'] = noImplementFactory('onGetWifiList');
export const offGetWifiList: BaseApis['offGetWifiList'] = noImplementFactory('offGetWifiList');
export const getSystemInfo: BaseApis['getSystemInfo'] = promisify(webGetSystemInfo);
export const getSystemInfoSync: BaseApis['getSystemInfoSync'] = webGetSystemInfoSync;
export const getConnectedWifi: BaseApis['getConnectedWifi'] = promisify(noImplementFactory('getConnectedWifi'));
export const startAccelerometer: BaseApis['startAccelerometer'] = promisify(noImplementFactory('startAccelerometer'));
export const stopAccelerometer: BaseApis['stopAccelerometer'] = promisify(noImplementFactory('stopAccelerometer'));
export const onAccelerometerChange: BaseApis['onAccelerometerChange'] = noImplementFactory('onAccelerometerChange');
export const startCompass: BaseApis['startCompass'] = promisify(noImplementFactory('startCompass'));
export const stopCompass: BaseApis['stopCompass'] = promisify(noImplementFactory('stopCompass'));
export const onCompassChange: BaseApis['onCompassChange'] = noImplementFactory('onCompassChange');
export const makePhoneCall: BaseApis['makePhoneCall'] = promisify(webMakePhoneCall);
export const scanCode: BaseApis['scanCode'] = promisify(noImplementFactory('scanCode'));
export const getClipboardData: BaseApis['getClipboardData'] = promisify(webGetClipboardData);
export const setClipboardData: BaseApis['setClipboardData'] = promisify(webSetClipboardData);
export const setKeepScreenOn: BaseApis['setKeepScreenOn'] = promisify(noImplementFactory('setKeepScreenOn'));
export const onUserCaptureScreen: BaseApis['onUserCaptureScreen'] = noImplementFactory('onUserCaptureScreen');
export const offUserCaptureScreen: BaseApis['offUserCaptureScreen'] = noImplementFactory('offUserCaptureScreen');
export const getScreenBrightness: BaseApis['getScreenBrightness'] = promisify(
  noImplementFactory('getScreenBrightness'),
);
export const setScreenBrightness: BaseApis['setScreenBrightness'] = promisify(
  noImplementFactory('setScreenBrightness'),
);
export const disableUserScreenRecord: BaseApis['disableUserScreenRecord'] = promisify(
  noImplementFactory('disableUserScreenRecord'),
);
export const enableUserScreenRecord: BaseApis['enableUserScreenRecord'] = promisify(
  noImplementFactory('enableUserScreenRecord'),
);
export const onUserScreenRecord: BaseApis['onUserScreenRecord'] = noImplementFactory('onUserScreenRecord');
export const offUserScreenRecord: BaseApis['offUserScreenRecord'] = noImplementFactory('offUserScreenRecord');
export const vibrateShort: BaseApis['vibrateShort'] = promisify(noImplementFactory('vibrateShort'));
export const vibrateLong: BaseApis['vibrateLong'] = promisify(noImplementFactory('vibrateLong'));
export const onMemoryWarning: BaseApis['onMemoryWarning'] = noImplementFactory('onMemoryWarning');
export const createCanvasContext: BaseApis['createCanvasContext'] = originCreateCanvasContext;
export const canvasToTempFilePath: BaseApis['canvasToTempFilePath'] = promisify(originCanvasToTempFilePath);
export const createOffscreenCanvas: BaseApis['createOffscreenCanvas'] = noImplementFactory('createOffscreenCanvas');
export const showToast: BaseApis['showToast'] = promisify(webShowToast);
export const hideToast: BaseApis['hideToast'] = promisify(webHideToast);
export const showLoading: BaseApis['showLoading'] = promisify(webShowLoading);
export const hideLoading: BaseApis['hideLoading'] = promisify(webHideToast);
export const showModal: BaseApis['showModal'] = promisify(webShowModal);
export const showActionSheet: BaseApis['showActionSheet'] = promisify(webShowActionSheet);
export const showFavoriteGuide: BaseApis['showFavoriteGuide'] = promisify(noImplementFactory('showFavoriteGuide'));
export const showInteractionBar: BaseApis['showInteractionBar'] = promisify(noImplementFactory('showInteractionBar'));
export const hideInteractionBar: BaseApis['hideInteractionBar'] = promisify(noImplementFactory('hideInteractionBar'));
export const showNavigationBarLoading: BaseApis['showNavigationBarLoading'] = promisify(
  noImplementFactory('showNavigationBarLoading'),
);
export const hideNavigationBarLoading: BaseApis['hideNavigationBarLoading'] = promisify(
  noImplementFactory('hideNavigationBarLoading'),
);
export const hideHomeButton: BaseApis['hideHomeButton'] = promisify(noImplementFactory('hideHomeButton'));
export const setNavigationBarTitle: BaseApis['setNavigationBarTitle'] = promisify(((options: any) => {
  eventEmitter.emit('setNavigationBarTitle', options);
}) as any);
export const setNavigationBarColor: BaseApis['setNavigationBarColor'] = promisify(((options: any) => {
  eventEmitter.emit('setNavigationBarColor', options);
}) as any);
export const getMenuButtonBoundingClientRect: BaseApis['getMenuButtonBoundingClientRect'] = noImplementFactory(
  'getMenuButtonBoundingClientRect',
);
export const createAnimation: BaseApis['createAnimation'] = noImplementFactory('createAnimation');
export const pageScrollTo: BaseApis['pageScrollTo'] = promisify(webPageScrollTo);
export const setSwipeBackMode: BaseApis['setSwipeBackMode'] = noImplementFactory('setSwipeBackMode');
export const startPullDownRefresh: BaseApis['startPullDownRefresh'] = promisify(
  noImplementFactory('startPullDownRefresh'),
);
export const showTabBar: BaseApis['showTabBar'] = promisify(((options: any) => {
  eventEmitter.emit('setTabBarToggle', true, options);
}) as any);
export const hideTabBar: BaseApis['hideTabBar'] = promisify(((options: any) => {
  eventEmitter.emit('setTabBarToggle', false, options);
}) as any);
export const showTabBarRedDot: BaseApis['showTabBarRedDot'] = promisify(((options: any) => {
  eventEmitter.emit('setTabBarDotToggle', true, options);
}) as any);
export const hideTabBarRedDot: BaseApis['hideTabBarRedDot'] = promisify(((options: any) => {
  eventEmitter.emit('setTabBarDotToggle', false, options);
}) as any);
export const setTabBarStyle: BaseApis['setTabBarStyle'] = promisify(((options: any) => {
  eventEmitter.emit('setTabBarStyle', options);
}) as any);
export const setTabBarItem: BaseApis['setTabBarItem'] = promisify(((options: any) => {
  eventEmitter.emit('setTabBarItem', options);
}) as any);
export const setTabBarBadge: BaseApis['setTabBarBadge'] = promisify(((options: any) => {
  eventEmitter.emit('setTabBarBadge', options);
}) as any);
export const removeTabBarBadge: BaseApis['removeTabBarBadge'] = promisify(((options: any) => {
  eventEmitter.emit('removeTabBarBadge', options);
}) as any);
export const getAlgorithmManager: BaseApis['getAlgorithmManager'] = promisify(
  noImplementFactory('getAlgorithmManager'),
);
export const createStickerManager: BaseApis['createStickerManager'] = noImplementFactory('createStickerManager');
export const createBytennEngineContext: BaseApis['createBytennEngineContext'] =
  noImplementFactory('createBytennEngineContext');
export const navigateTo: BaseApis['navigateTo'] = promisify(webNavigateTo);
export const redirectTo: BaseApis['redirectTo'] = promisify(webRedirectTo);
export const switchTab: BaseApis['switchTab'] = promisify(webSwitchTab);
export const navigateBack: BaseApis['navigateBack'] = promisify(webNavigateBack);
export const reLaunch: BaseApis['reLaunch'] = promisify(webReLaunch);
export const showShareMenu: BaseApis['showShareMenu'] = promisify(noImplementFactory('showShareMenu'));
export const hideShareMenu: BaseApis['hideShareMenu'] = promisify(noImplementFactory('hideShareMenu'));
export const navigateToVideoView: BaseApis['navigateToVideoView'] = promisify(
  noImplementFactory('navigateToVideoView'),
);
export const getExtConfig: BaseApis['getExtConfig'] = promisify(noImplementFactory('getExtConfig'));
export const getExtConfigSync: BaseApis['getExtConfigSync'] = noImplementFactory('getExtConfigSync');
export const createSelectorQuery: BaseApis['createSelectorQuery'] = noImplementFactory('createSelectorQuery');
export const createIntersectionObserver: BaseApis['createIntersectionObserver'] =
  noImplementFactory('createIntersectionObserver');
export const createLiveReportContext: BaseApis['createLiveReportContext'] =
  noImplementFactory('createLiveReportContext');
export const getRoomInfo: BaseApis['getRoomInfo'] = promisify(noImplementFactory('getRoomInfo'));
export const getLiveUserInfo: BaseApis['getLiveUserInfo'] = promisify(noImplementFactory('getLiveUserInfo'));
export const getSelfCommentCountDuringPluginRunning: BaseApis['getSelfCommentCountDuringPluginRunning'] = promisify(
  noImplementFactory('getSelfCommentCountDuringPluginRunning'),
);
export const isFollowingAnchor: BaseApis['isFollowingAnchor'] = promisify(noImplementFactory('isFollowingAnchor'));
export const onReceiveAudiencesFollowAction: BaseApis['onReceiveAudiencesFollowAction'] = noImplementFactory(
  'onReceiveAudiencesFollowAction',
);
export const subscribeAudiencesFollowAction: BaseApis['subscribeAudiencesFollowAction'] = promisify(
  noImplementFactory('subscribeAudiencesFollowAction'),
);
export const unsubscribeAudiencesFollowAction: BaseApis['unsubscribeAudiencesFollowAction'] = promisify(
  noImplementFactory('unsubscribeAudiencesFollowAction'),
);
export const subscribeSpecifiedContentComment: BaseApis['subscribeSpecifiedContentComment'] = promisify(
  noImplementFactory('subscribeSpecifiedContentComment'),
);
export const subscribeSpecifiedUserComment: BaseApis['subscribeSpecifiedUserComment'] = promisify(
  noImplementFactory('subscribeSpecifiedUserComment'),
);
export const unsubscribeAllSpecifiedContentComment: BaseApis['unsubscribeAllSpecifiedContentComment'] = promisify(
  noImplementFactory('unsubscribeAllSpecifiedContentComment'),
);
export const unsubscribeAllSpecifiedUserComment: BaseApis['unsubscribeAllSpecifiedUserComment'] = promisify(
  noImplementFactory('unsubscribeAllSpecifiedUserComment'),
);
export const onReceiveSpecifiedComment: BaseApis['onReceiveSpecifiedComment'] =
  noImplementFactory('onReceiveSpecifiedComment');
export const open: BaseApis['open'] = webOpen;
export const monaStorage: BaseApis['monaStorage'] = window.__MONA_LIGHT_APP_LOCAL_STORAGE;
export const exitLightApp: BaseApis['exitLightApp'] = window.__MONA_LIGHT_APP_EXIT_APP_CB
  ? window.__MONA_LIGHT_APP_EXIT_APP_CB
  : noImplementFactory('exitLightApp');
