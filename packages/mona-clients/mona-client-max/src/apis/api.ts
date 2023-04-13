import { BaseApis } from '@bytedance/mona';
import { promisify } from '@bytedance/mona-shared/dist/promisify';
import {
  maxGetStorage,
  maxNavigateTo,
  maxRemoveStorage,
  maxReportAnalytics,
  maxRequest,
  maxSetStorage,
  maxGetSystemInfo,
  maxGetSystemInfoSync,
} from './utils';
import CanvasContext from './CanvasContext';

const noImplementFactory = (api: string) => (): any => {
  console.error(`not implemented "${api}" in max`);
};

export const canIUse: BaseApis['canIUse'] = noImplementFactory('canIUse');
export const base64ToArrayBuffer: BaseApis['base64ToArrayBuffer'] = noImplementFactory('base64ToArrayBuffer');
export const arrayBufferToBase64: BaseApis['arrayBufferToBase64'] = noImplementFactory('arrayBufferToBase64');
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
export const request: BaseApis['request'] = promisify(maxRequest);
export const uploadFile: BaseApis['uploadFile'] = promisify(noImplementFactory('uploadFile'));
export const connectSocket: BaseApis['connectSocket'] = promisify(noImplementFactory('connectSocket'));
export const chooseImage: BaseApis['chooseImage'] = promisify(noImplementFactory('chooseImage'));
export const saveImageToPhotosAlbum: BaseApis['saveImageToPhotosAlbum'] = promisify(
  noImplementFactory('saveImageToPhotosAlbum'),
);
export const previewImage: BaseApis['previewImage'] = promisify(noImplementFactory('previewImage'));
export const getImageInfo: BaseApis['getImageInfo'] = promisify(noImplementFactory('getImageInfo'));
export const compressImage: BaseApis['compressImage'] = promisify(noImplementFactory('compressImage'));
export const getRecorderManager: BaseApis['getRecorderManager'] = noImplementFactory('getRecorderManager');
export const getBackgroundAudioManager: BaseApis['getBackgroundAudioManager'] =
  noImplementFactory('getBackgroundAudioManager');
export const createInnerAudioContext: BaseApis['createInnerAudioContext'] =
  noImplementFactory('createInnerAudioContext');
export const chooseVideo: BaseApis['chooseVideo'] = promisify(noImplementFactory('chooseVideo'));
export const saveVideoToPhotoAlbum: BaseApis['saveVideoToPhotoAlbum'] = promisify(
  noImplementFactory('saveVideoToPhotoAlbum'),
);
export const createVideoContext: BaseApis['createVideoContext'] = noImplementFactory('createVideoContext');
export const createLivePlayerContext: BaseApis['createLivePlayerContext'] =
  noImplementFactory('createLivePlayerContext');
export const preloadVideo: BaseApis['preloadVideo'] = promisify(noImplementFactory('preloadVideo'));
export const createCameraContext: BaseApis['createCameraContext'] = noImplementFactory('createCameraContext');
export const createEffectCameraStream: BaseApis['createEffectCameraStream'] =
  noImplementFactory('createEffectCameraStream');
export const createMapContext: BaseApis['createMapContext'] = noImplementFactory('createMapContext');
export const saveFile: BaseApis['saveFile'] = promisify(noImplementFactory('saveFile'));
export const getFileInfo: BaseApis['getFileInfo'] = promisify(noImplementFactory('getFileInfo'));
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
export const navigateToApp: BaseApis['navigateToApp'] = noImplementFactory('navigateToApp');
export const navigateBackMiniProgram: BaseApis['navigateBackMiniProgram'] = promisify(
  noImplementFactory('navigateBackMiniProgram'),
);
export const chooseAddresses: BaseApis['chooseAddresses'] = promisify(noImplementFactory('chooseAddresses'));
export const getSetting: BaseApis['getSetting'] = promisify(noImplementFactory('getSetting'));
export const openSettings: BaseApis['openSettings'] = promisify(noImplementFactory('openSettings'));
export const authorize: BaseApis['authorize'] = promisify(noImplementFactory('authorize'));
export const showDouyinOpenAuth: BaseApis['showDouyinOpenAuth'] = promisify(noImplementFactory('showDouyinOpenAuth'));
export const reportAnalytics: BaseApis['reportAnalytics'] = maxReportAnalytics;
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

export const getStorage: BaseApis['getStorage'] = promisify(maxGetStorage);
export const getStorageSync: BaseApis['getStorageSync'] = noImplementFactory('getStorageSync');

export const setStorage: BaseApis['setStorage'] = promisify(maxSetStorage);
export const setStorageSync: BaseApis['setStorageSync'] = noImplementFactory('setStorageSync');
export const removeStorage: BaseApis['removeStorage'] = promisify(maxRemoveStorage);
export const removeStorageSync: BaseApis['removeStorageSync'] = noImplementFactory('removeStorageSync');
export const clearStorage: BaseApis['clearStorage'] = promisify(noImplementFactory('clearStorage'));
export const clearStorageSync: BaseApis['clearStorageSync'] = noImplementFactory('clearStorageSync');
export const getStorageInfo: BaseApis['getStorageInfo'] = promisify(noImplementFactory('getStorageInfo'));
export const getStorageInfoSync: BaseApis['getStorageInfoSync'] = noImplementFactory('getStorageInfoSync');
export const getLocation: BaseApis['getLocation'] = promisify(noImplementFactory('getLocation'));
export const chooseLocation: BaseApis['chooseLocation'] = promisify(noImplementFactory('chooseLocation'));
export const openLocation: BaseApis['openLocation'] = promisify(noImplementFactory('openLocation'));
export const getNetworkType: BaseApis['getNetworkType'] = promisify(noImplementFactory('getNetworkType'));
export const onNetworkStatusChange: BaseApis['onNetworkStatusChange'] = noImplementFactory('onNetworkStatusChange');
export const getWifiList: BaseApis['getWifiList'] = promisify(noImplementFactory('getWifiList'));
export const onGetWifiList: BaseApis['onGetWifiList'] = noImplementFactory('onGetWifiList');
export const offGetWifiList: BaseApis['offGetWifiList'] = noImplementFactory('offGetWifiList');
export const getSystemInfo: BaseApis['getSystemInfo'] = promisify(maxGetSystemInfo);
export const getSystemInfoSync: BaseApis['getSystemInfoSync'] = maxGetSystemInfoSync;
export const getConnectedWifi: BaseApis['getConnectedWifi'] = promisify(noImplementFactory('getConnectedWifi'));
export const startAccelerometer: BaseApis['startAccelerometer'] = promisify(noImplementFactory('startAccelerometer'));
export const stopAccelerometer: BaseApis['stopAccelerometer'] = promisify(noImplementFactory('stopAccelerometer'));
export const onAccelerometerChange: BaseApis['onAccelerometerChange'] = noImplementFactory('onAccelerometerChange');
export const startCompass: BaseApis['startCompass'] = promisify(noImplementFactory('startCompass'));
export const stopCompass: BaseApis['stopCompass'] = promisify(noImplementFactory('stopCompass'));
export const onCompassChange: BaseApis['onCompassChange'] = noImplementFactory('onCompassChange');
export const makePhoneCall: BaseApis['makePhoneCall'] = promisify(noImplementFactory('makePhoneCall'));
export const scanCode: BaseApis['scanCode'] = promisify(noImplementFactory('scanCode'));
export const getClipboardData: BaseApis['getClipboardData'] = promisify(noImplementFactory('getClipboardData'));
export const setClipboardData: BaseApis['setClipboardData'] = promisify(noImplementFactory('setClipboardData'));
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
export const createCanvasContext: BaseApis['createCanvasContext'] = canvasId => {
  const context = new CanvasContext(lynx.createCanvas(canvasId));
  // Compatible with miniapp' usage
  context.draw = () => {};
  return context;
};
export const canvasToTempFilePath: BaseApis['canvasToTempFilePath'] = promisify(
  noImplementFactory('canvasToTempFilePath'),
);
export const createOffscreenCanvas: BaseApis['createOffscreenCanvas'] = lynx.createOffscreenCanvas;
export const showToast: BaseApis['showToast'] = promisify(noImplementFactory('showToast'));
export const hideToast: BaseApis['hideToast'] = promisify(noImplementFactory('hideToast'));
export const showLoading: BaseApis['showLoading'] = promisify(noImplementFactory('showLoading'));
export const hideLoading: BaseApis['hideLoading'] = promisify(noImplementFactory('hideLoading'));
export const showModal: BaseApis['showModal'] = promisify(noImplementFactory('showModal'));
export const showActionSheet: BaseApis['showActionSheet'] = promisify(noImplementFactory('createOffscreenCanvas'));
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
export const setNavigationBarTitle: BaseApis['setNavigationBarTitle'] = promisify(
  noImplementFactory('setNavigationBarTitle'),
);
export const setNavigationBarColor: BaseApis['setNavigationBarColor'] = promisify(
  noImplementFactory('setNavigationBarColor'),
);
export const getMenuButtonBoundingClientRect: BaseApis['getMenuButtonBoundingClientRect'] = noImplementFactory(
  'getMenuButtonBoundingClientRect',
);
export const createAnimation: BaseApis['createAnimation'] = noImplementFactory('createAnimation');
export const pageScrollTo: BaseApis['pageScrollTo'] = promisify(noImplementFactory('pageScrollTo'));
export const setSwipeBackMode: BaseApis['setSwipeBackMode'] = noImplementFactory('setSwipeBackMode');
export const startPullDownRefresh: BaseApis['startPullDownRefresh'] = promisify(
  noImplementFactory('startPullDownRefresh'),
);
export const showTabBar: BaseApis['showTabBar'] = promisify(noImplementFactory('showTabBar'));
export const hideTabBar: BaseApis['hideTabBar'] = promisify(noImplementFactory('hideTabBar'));
export const showTabBarRedDot: BaseApis['showTabBarRedDot'] = promisify(noImplementFactory('showTabBarRedDot'));
export const hideTabBarRedDot: BaseApis['hideTabBarRedDot'] = promisify(noImplementFactory('hideTabBarRedDot'));
export const setTabBarStyle: BaseApis['setTabBarStyle'] = promisify(noImplementFactory('setTabBarStyle'));
export const setTabBarItem: BaseApis['setTabBarItem'] = promisify(noImplementFactory('setTabBarItem'));
export const setTabBarBadge: BaseApis['setTabBarBadge'] = promisify(noImplementFactory('setTabBarBadge'));
export const removeTabBarBadge: BaseApis['removeTabBarBadge'] = promisify(noImplementFactory('removeTabBarBadge'));
export const getAlgorithmManager: BaseApis['getAlgorithmManager'] = promisify(
  noImplementFactory('getAlgorithmManager'),
);
export const createStickerManager: BaseApis['createStickerManager'] = noImplementFactory('createStickerManager');
export const createBytennEngineContext: BaseApis['createBytennEngineContext'] =
  noImplementFactory('createBytennEngineContext');
export const navigateTo: BaseApis['navigateTo'] = promisify(maxNavigateTo);
export const redirectTo: BaseApis['redirectTo'] = promisify(noImplementFactory('redirectTo'));
export const switchTab: BaseApis['switchTab'] = promisify(noImplementFactory('switchTab'));
export const navigateBack: BaseApis['navigateBack'] = promisify(noImplementFactory('navigateBack'));
export const reLaunch: BaseApis['reLaunch'] = promisify(noImplementFactory('reLaunch'));
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
export const open: BaseApis['open'] = noImplementFactory('open');
