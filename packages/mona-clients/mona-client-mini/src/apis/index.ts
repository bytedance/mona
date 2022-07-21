import { BaseApis } from '@bytedance/mona';
import { formatPath, promisify } from '@bytedance/mona-shared';

const MonaApi: Partial<BaseApis> = {
  open: () => {
    throw Error('not implemented in miniapp');
  },
  navigateTo: options => tt.navigateTo({ ...options, url: formatPath(options.url) }),
  redirectTo: options => tt.redirectTo({ ...options, url: formatPath(options.url) }),
  switchTab: options => tt.switchTab({ ...options, url: formatPath(options.url) }),
};

export const Mona: BaseApis = new Proxy({} as any, {
  get: function (_, property: keyof BaseApis) {
    if (MonaApi[property]) {
      return MonaApi[property];
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

export const canIUse: BaseApis['canIUse'] = tt.canIUse;
export const base64ToArrayBuffer: BaseApis['base64ToArrayBuffer'] = tt.base64ToArrayBuffer;
export const arrayBufferToBase64: BaseApis['arrayBufferToBase64'] = tt.arrayBufferToBase64;
export const getEnterOptionsSync: BaseApis['getEnterOptionsSync'] = tt.getEnterOptionsSync;
export const getLaunchOptionsSync: BaseApis['getLaunchOptionsSync'] = tt.getLaunchOptionsSync;
export const exitMiniProgram: BaseApis['exitMiniProgram'] = promisify(tt.exitMiniProgram);
export const canIPutStuffOverComponent: BaseApis['canIPutStuffOverComponent'] = tt.canIPutStuffOverComponent;
export const getUpdateManager: BaseApis['getUpdateManager'] = tt.getUpdateManager;
export const onAppShow: BaseApis['onAppShow'] = tt.onAppShow;
export const offAppShow: BaseApis['offAppShow'] = tt.offAppShow;
export const onAppHide: BaseApis['onAppHide'] = tt.onAppHide;
export const offAppHide: BaseApis['offAppHide'] = tt.offAppHide;
export const onError: BaseApis['onError'] = tt.onError;
export const offError: BaseApis['offError'] = tt.offError;
export const env: BaseApis['env'] = tt.env;
export const downloadFile: BaseApis['downloadFile'] = promisify(tt.downloadFile);
export const request: BaseApis['request'] = promisify(tt.request);
export const uploadFile: BaseApis['uploadFile'] = promisify(tt.uploadFile);
export const connectSocket: BaseApis['connectSocket'] = promisify(tt.connectSocket);
export const chooseImage: BaseApis['chooseImage'] = promisify(tt.chooseImage);
export const saveImageToPhotosAlbum: BaseApis['saveImageToPhotosAlbum'] = promisify(tt.saveImageToPhotosAlbum);
export const previewImage: BaseApis['previewImage'] = promisify(tt.previewImage);
export const getImageInfo: BaseApis['getImageInfo'] = promisify(tt.getImageInfo);
export const compressImage: BaseApis['compressImage'] = promisify(tt.compressImage);
export const getRecorderManager: BaseApis['getRecorderManager'] = tt.getRecorderManager;
export const getBackgroundAudioManager: BaseApis['getBackgroundAudioManager'] = tt.getBackgroundAudioManager;
export const createInnerAudioContext: BaseApis['createInnerAudioContext'] = tt.createInnerAudioContext;
export const chooseVideo: BaseApis['chooseVideo'] = promisify(tt.chooseVideo);
export const saveVideoToPhotoAlbum: BaseApis['saveVideoToPhotoAlbum'] = tt.saveVideoToPhotoAlbum;
export const createVideoContext: BaseApis['createVideoContext'] = promisify(tt.createVideoContext);
export const createLivePlayerContext: BaseApis['createLivePlayerContext'] = tt.createLivePlayerContext;
export const preloadVideo: BaseApis['preloadVideo'] = promisify(tt.preloadVideo);
export const createCameraContext: BaseApis['createCameraContext'] = tt.createCameraContext;
export const createEffectCameraStream: BaseApis['createEffectCameraStream'] = tt.createEffectCameraStream;
export const createMapContext: BaseApis['createMapContext'] = tt.createMapContext;
export const saveFile: BaseApis['saveFile'] = promisify(tt.saveFile);
export const getFileInfo: BaseApis['getFileInfo'] = promisify(tt.getFileInfo);
export const getSavedFileList: BaseApis['getSavedFileList'] = promisify(tt.getSavedFileList);
export const openDocument: BaseApis['openDocument'] = promisify(tt.openDocument);
export const removeSavedFile: BaseApis['removeSavedFile'] = promisify(tt.removeSavedFile);
export const getFileSystemManager: BaseApis['getFileSystemManager'] = tt.getFileSystemManager;
export const getEnvInfoSync: BaseApis['getEnvInfoSync'] = tt.getEnvInfoSync;
export const login: BaseApis['login'] = promisify(tt.login);
export const checkSession: BaseApis['checkSession'] = promisify(tt.checkSession);
export const getUserInfo: BaseApis['getUserInfo'] = promisify(tt.getUserInfo);
export const getUserInfoProfile: BaseApis['getUserInfoProfile'] = promisify(tt.getUserInfoProfile);
export const createRewardedVideoAd: BaseApis['createRewardedVideoAd'] = tt.createRewardedVideoAd;
export const createInterstitialAd: BaseApis['createInterstitialAd'] = tt.createInterstitialAd;
export const pay: BaseApis['pay'] = promisify(tt.pay);
export const navigateToMiniProgram: BaseApis['navigateToMiniProgram'] = promisify(tt.navigateToMiniProgram);
export const navigateBackMiniProgram: BaseApis['navigateBackMiniProgram'] = promisify(tt.navigateBackMiniProgram);
export const chooseAddresses: BaseApis['chooseAddresses'] = promisify(tt.chooseAddresses);
export const getSetting: BaseApis['getSetting'] = promisify(tt.getSetting);
export const openSettings: BaseApis['openSettings'] = promisify(tt.openSettings);
export const authorize: BaseApis['authorize'] = promisify(tt.authorize);
export const showDouyinOpenAuth: BaseApis['showDouyinOpenAuth'] = promisify(tt.showDouyinOpenAuth);
export const reportAnalytics: BaseApis['reportAnalytics'] = tt.reportAnalytics;
export const canRateAwemeOrders: BaseApis['canRateAwemeOrders'] = promisify(tt.canRateAwemeOrders);
export const rateAwemeOrder: BaseApis['rateAwemeOrder'] = promisify(tt.rateAwemeOrder);
export const followOfficialAccount: BaseApis['followOfficialAccount'] = promisify(tt.followOfficialAccount);
export const checkFollowState: BaseApis['checkFollowState'] = promisify(tt.checkFollowState);
export const openAwemeUserProfile: BaseApis['openAwemeUserProfile'] = promisify(tt.openAwemeUserProfile);
export const followAwemeUser: BaseApis['followAwemeUser'] = promisify(tt.followAwemeUser);
export const requestSubscribeMessage: BaseApis['requestSubscribeMessage'] = promisify(tt.requestSubscribeMessage);
export const openDouyinOrderList: BaseApis['openDouyinOrderList'] = promisify(tt.openDouyinOrderList);
export const openEcGood: BaseApis['openEcGood'] = promisify(tt.openEcGood);
export const openEcOrderDetail: BaseApis['openEcOrderDetail'] = promisify(tt.openEcOrderDetail);
export const openEcIm: BaseApis['openEcIm'] = promisify(tt.openEcIm);
export const openEcChat: BaseApis['openEcChat'] = promisify(tt.openEcChat);
export const openWebcastRoom: BaseApis['openWebcastRoom'] = promisify(tt.openWebcastRoom);
export const openDouyinProfile: BaseApis['openDouyinProfile'] = promisify(tt.openDouyinProfile);
export const openEcCoupon: BaseApis['openEcCoupon'] = promisify(tt.openEcCoupon);
export const performance: BaseApis['performance'] = tt.performance;
export const getStorage: BaseApis['getStorage'] = promisify(tt.getStorage);
export const getStorageSync: BaseApis['getStorageSync'] = tt.getStorageSync;
export const setStorage: BaseApis['setStorage'] = promisify(tt.setStorage);
export const setStorageSync: BaseApis['setStorageSync'] = tt.setStorageSync;
export const removeStorage: BaseApis['removeStorage'] = promisify(tt.removeStorage);
export const removeStorageSync: BaseApis['removeStorageSync'] = tt.removeStorageSync;
export const clearStorage: BaseApis['clearStorage'] = promisify(tt.clearStorage);
export const clearStorageSync: BaseApis['clearStorageSync'] = tt.clearStorageSync;
export const getStorageInfo: BaseApis['getStorageInfo'] = promisify(tt.getStorageInfo);
export const getStorageInfoSync: BaseApis['getStorageInfoSync'] = tt.getStorageInfoSync;
export const getLocation: BaseApis['getLocation'] = promisify(tt.getLocation);
export const chooseLocation: BaseApis['chooseLocation'] = promisify(tt.chooseLocation);
export const openLocation: BaseApis['openLocation'] = promisify(tt.openLocation);
export const getNetworkType: BaseApis['getNetworkType'] = promisify(tt.getNetworkType);
export const onNetworkStatusChange: BaseApis['onNetworkStatusChange'] = tt.onNetworkStatusChange;
export const getWifiList: BaseApis['getWifiList'] = promisify(tt.getWifiList);
export const onGetWifiList: BaseApis['onGetWifiList'] = tt.onGetWifiList;
export const offGetWifiList: BaseApis['offGetWifiList'] = tt.offGetWifiList;
export const getSystemInfo: BaseApis['getSystemInfo'] = promisify(tt.getSystemInfo);
export const getSystemInfoSync: BaseApis['getSystemInfoSync'] = tt.getSystemInfoSync;
export const getConnectedWifi: BaseApis['getConnectedWifi'] = promisify(tt.getConnectedWifi);
export const startAccelerometer: BaseApis['startAccelerometer'] = promisify(tt.startAccelerometer);
export const stopAccelerometer: BaseApis['stopAccelerometer'] = promisify(tt.stopAccelerometer);
export const onAccelerometerChange: BaseApis['onAccelerometerChange'] = tt.onAccelerometerChange;
export const startCompass: BaseApis['startCompass'] = promisify(tt.startCompass);
export const stopCompass: BaseApis['stopCompass'] = promisify(tt.stopCompass);
export const onCompassChange: BaseApis['onCompassChange'] = tt.onCompassChange;
export const makePhoneCall: BaseApis['makePhoneCall'] = promisify(tt.makePhoneCall);
export const scanCode: BaseApis['scanCode'] = promisify(tt.scanCode);
export const getClipboardData: BaseApis['getClipboardData'] = promisify(tt.getClipboardData);
export const setClipboardData: BaseApis['setClipboardData'] = promisify(tt.setClipboardData);
export const setKeepScreenOn: BaseApis['setKeepScreenOn'] = promisify(tt.setKeepScreenOn);
export const onUserCaptureScreen: BaseApis['onUserCaptureScreen'] = tt.onUserCaptureScreen;
export const offUserCaptureScreen: BaseApis['offUserCaptureScreen'] = tt.offUserCaptureScreen;
export const getScreenBrightness: BaseApis['getScreenBrightness'] = promisify(tt.getScreenBrightness);
export const setScreenBrightness: BaseApis['setScreenBrightness'] = promisify(tt.setScreenBrightness);
export const disableUserScreenRecord: BaseApis['disableUserScreenRecord'] = promisify(tt.disableUserScreenRecord);
export const enableUserScreenRecord: BaseApis['enableUserScreenRecord'] = promisify(tt.enableUserScreenRecord);
export const onUserScreenRecord: BaseApis['onUserScreenRecord'] = tt.onUserScreenRecord;
export const offUserScreenRecord: BaseApis['offUserScreenRecord'] = tt.offUserScreenRecord;
export const vibrateShort: BaseApis['vibrateShort'] = promisify(tt.vibrateShort);
export const vibrateLong: BaseApis['vibrateLong'] = promisify(tt.vibrateLong);
export const onMemoryWarning: BaseApis['onMemoryWarning'] = tt.onMemoryWarning;
export const createCanvasContext: BaseApis['createCanvasContext'] = tt.createCanvasContext;
export const createOffscreenCanvas: BaseApis['createOffscreenCanvas'] = tt.createOffscreenCanvas;
export const showToast: BaseApis['showToast'] = promisify(tt.showToast);
export const hideToast: BaseApis['hideToast'] = promisify(tt.hideToast);
export const showLoading: BaseApis['showLoading'] = promisify(tt.showLoading);
export const hideLoading: BaseApis['hideLoading'] = promisify(tt.hideLoading);
export const showModal: BaseApis['showModal'] = promisify(tt.showModal);
export const showActionSheet: BaseApis['showActionSheet'] = promisify(tt.showActionSheet);
export const showFavoriteGuide: BaseApis['showFavoriteGuide'] = promisify(tt.showFavoriteGuide);
export const showInteractionBar: BaseApis['showInteractionBar'] = promisify(tt.showInteractionBar);
export const hideInteractionBar: BaseApis['hideInteractionBar'] = promisify(tt.hideInteractionBar);
export const showNavigationBarLoading: BaseApis['showNavigationBarLoading'] = promisify(tt.showNavigationBarLoading);
export const hideNavigationBarLoading: BaseApis['hideNavigationBarLoading'] = promisify(tt.hideNavigationBarLoading);
export const hideHomeButton: BaseApis['hideHomeButton'] = promisify(tt.hideHomeButton);
export const setNavigationBarTitle: BaseApis['setNavigationBarTitle'] = promisify(tt.setNavigationBarTitle);
export const setNavigationBarColor: BaseApis['setNavigationBarColor'] = promisify(tt.setNavigationBarColor);
export const getMenuButtonBoundingClientRect: BaseApis['getMenuButtonBoundingClientRect'] =
  tt.getMenuButtonBoundingClientRect;
export const createAnimation: BaseApis['createAnimation'] = tt.createAnimation;
export const pageScrollTo: BaseApis['pageScrollTo'] = promisify(tt.pageScrollTo);
export const setSwipeBackMode: BaseApis['setSwipeBackMode'] = tt.setSwipeBackMode;
export const startPullDownRefresh: BaseApis['startPullDownRefresh'] = promisify(tt.startPullDownRefresh);
export const showTabBarRedDot: BaseApis['showTabBarRedDot'] = promisify(tt.showTabBarRedDot);
export const showTabBar: BaseApis['showTabBar'] = promisify(tt.showTabBar);
export const setTabBarStyle: BaseApis['setTabBarStyle'] = promisify(tt.setTabBarStyle);
export const setTabBarItem: BaseApis['setTabBarItem'] = promisify(tt.setTabBarItem);
export const setTabBarBadge: BaseApis['setTabBarBadge'] = promisify(tt.setTabBarBadge);
export const removeTabBarBadge: BaseApis['removeTabBarBadge'] = promisify(tt.removeTabBarBadge);
export const hideTabBarRedDot: BaseApis['hideTabBarRedDot'] = promisify(tt.hideTabBarRedDot);
export const hideTabBar: BaseApis['hideTabBar'] = promisify(tt.hideTabBar);
export const getAlgorithmManager: BaseApis['getAlgorithmManager'] = promisify(tt.getAlgorithmManager);
export const createStickerManager: BaseApis['createStickerManager'] = tt.createStickerManager;
export const createBytennEngineContext: BaseApis['createBytennEngineContext'] = tt.createBytennEngineContext;
export const navigateTo: BaseApis['navigateTo'] = promisify(options =>
  tt.navigateTo({ ...options, url: formatPath(options.url) }),
);
export const redirectTo: BaseApis['redirectTo'] = promisify(options =>
  tt.redirectTo({ ...options, url: formatPath(options.url) }),
);
export const switchTab: BaseApis['switchTab'] = promisify(options =>
  tt.switchTab({ ...options, url: formatPath(options.url) }),
);
export const navigateBack: BaseApis['navigateBack'] = promisify(tt.navigateBack);
export const reLaunch: BaseApis['reLaunch'] = promisify(tt.reLaunch);
export const showShareMenu: BaseApis['showShareMenu'] = promisify(tt.showShareMenu);
export const hideShareMenu: BaseApis['hideShareMenu'] = promisify(tt.hideShareMenu);
export const navigateToVideoView: BaseApis['navigateToVideoView'] = promisify(tt.navigateToVideoView);
export const getExtConfig: BaseApis['getExtConfig'] = promisify(tt.getExtConfig);
export const getExtConfigSync: BaseApis['getExtConfigSync'] = tt.getExtConfigSync;
export const createSelectorQuery: BaseApis['createSelectorQuery'] = tt.createSelectorQuery;
export const createIntersectionObserver: BaseApis['createIntersectionObserver'] = tt.createIntersectionObserver;
export const createLiveReportContext: BaseApis['createLiveReportContext'] = tt.createLiveReportContext;
export const getRoomInfo: BaseApis['getRoomInfo'] = promisify(tt.getRoomInfo);
export const getLiveUserInfo: BaseApis['getLiveUserInfo'] = promisify(tt.getLiveUserInfo);
export const getSelfCommentCountDuringPluginRunning: BaseApis['getSelfCommentCountDuringPluginRunning'] = promisify(
  tt.getSelfCommentCountDuringPluginRunning,
);
export const isFollowingAnchor: BaseApis['isFollowingAnchor'] = promisify(tt.isFollowingAnchor);
export const onReceiveAudiencesFollowAction: BaseApis['onReceiveAudiencesFollowAction'] =
  tt.onReceiveAudiencesFollowAction;
export const subscribeAudiencesFollowAction: BaseApis['subscribeAudiencesFollowAction'] = promisify(
  tt.subscribeAudiencesFollowAction,
);
export const unsubscribeAudiencesFollowAction: BaseApis['unsubscribeAudiencesFollowAction'] = promisify(
  tt.unsubscribeAudiencesFollowAction,
);
export const subscribeSpecifiedContentComment: BaseApis['subscribeSpecifiedContentComment'] = promisify(
  tt.subscribeSpecifiedContentComment,
);
export const subscribeSpecifiedUserComment: BaseApis['subscribeSpecifiedUserComment'] = promisify(
  tt.subscribeSpecifiedUserComment,
);
export const unsubscribeAllSpecifiedContentComment: BaseApis['unsubscribeAllSpecifiedContentComment'] = promisify(
  tt.unsubscribeAllSpecifiedContentComment,
);
export const unsubscribeAllSpecifiedUserComment: BaseApis['unsubscribeAllSpecifiedUserComment'] = promisify(
  tt.unsubscribeAllSpecifiedUserComment,
);
export const onReceiveSpecifiedComment: BaseApis['onReceiveSpecifiedComment'] = tt.onReceiveSpecifiedComment;
