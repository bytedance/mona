import { BaseApis } from '@bytedance/mona';
import { formatPath } from '@bytedance/mona-shared';

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
export const exitMiniProgram: BaseApis['exitMiniProgram'] = tt.exitMiniProgram;
export const canIPutStuffOverComponent: BaseApis['canIPutStuffOverComponent'] = tt.canIPutStuffOverComponent;
export const getUpdateManager: BaseApis['getUpdateManager'] = tt.getUpdateManager;
export const onAppShow: BaseApis['onAppShow'] = tt.onAppShow;
export const offAppShow: BaseApis['offAppShow'] = tt.offAppShow;
export const onAppHide: BaseApis['onAppHide'] = tt.onAppHide;
export const offAppHide: BaseApis['offAppHide'] = tt.offAppHide;
export const onError: BaseApis['onError'] = tt.onError;
export const offError: BaseApis['offError'] = tt.offError;
export const env: BaseApis['env'] = tt.env;
export const downloadFile: BaseApis['downloadFile'] = tt.downloadFile;
export const request: BaseApis['request'] = tt.request;
export const uploadFile: BaseApis['uploadFile'] = tt.uploadFile;
export const connectSocket: BaseApis['connectSocket'] = tt.connectSocket;
export const chooseImage: BaseApis['chooseImage'] = tt.chooseImage;
export const saveImageToPhotosAlbum: BaseApis['saveImageToPhotosAlbum'] = tt.saveImageToPhotosAlbum;
export const previewImage: BaseApis['previewImage'] = tt.previewImage;
export const getImageInfo: BaseApis['getImageInfo'] = tt.getImageInfo;
export const compressImage: BaseApis['compressImage'] = tt.compressImage;
export const getRecorderManager: BaseApis['getRecorderManager'] = tt.getRecorderManager;
export const getBackgroundAudioManager: BaseApis['getBackgroundAudioManager'] = tt.getBackgroundAudioManager;
export const createInnerAudioContext: BaseApis['createInnerAudioContext'] = tt.createInnerAudioContext;
export const chooseVideo: BaseApis['chooseVideo'] = tt.chooseVideo;
export const saveVideoToPhotoAlbum: BaseApis['saveVideoToPhotoAlbum'] = tt.saveVideoToPhotoAlbum;
export const createVideoContext: BaseApis['createVideoContext'] = tt.createVideoContext;
export const createLivePlayerContext: BaseApis['createLivePlayerContext'] = tt.createLivePlayerContext;
export const preloadVideo: BaseApis['preloadVideo'] = tt.preloadVideo;
export const createCameraContext: BaseApis['createCameraContext'] = tt.createCameraContext;
export const createEffectCameraStream: BaseApis['createEffectCameraStream'] = tt.createEffectCameraStream;
export const createMapContext: BaseApis['createMapContext'] = tt.createMapContext;
export const saveFile: BaseApis['saveFile'] = tt.saveFile;
export const getFileInfo: BaseApis['getFileInfo'] = tt.getFileInfo;
export const getSavedFileList: BaseApis['getSavedFileList'] = tt.getSavedFileList;
export const openDocument: BaseApis['openDocument'] = tt.openDocument;
export const removeSavedFile: BaseApis['removeSavedFile'] = tt.removeSavedFile;
export const getFileSystemManager: BaseApis['getFileSystemManager'] = tt.getFileSystemManager;
export const getEnvInfoSync: BaseApis['getEnvInfoSync'] = tt.getEnvInfoSync;
export const login: BaseApis['login'] = tt.login;
export const checkSession: BaseApis['checkSession'] = tt.checkSession;
export const getUserInfo: BaseApis['getUserInfo'] = tt.getUserInfo;
export const getUserInfoProfile: BaseApis['getUserInfoProfile'] = tt.getUserInfoProfile;
export const createRewardedVideoAd: BaseApis['createRewardedVideoAd'] = tt.createRewardedVideoAd;
export const createInterstitialAd: BaseApis['createInterstitialAd'] = tt.createInterstitialAd;
export const pay: BaseApis['pay'] = tt.pay;
export const navigateToMiniProgram: BaseApis['navigateToMiniProgram'] = tt.navigateToMiniProgram;
export const navigateBackMiniProgram: BaseApis['navigateBackMiniProgram'] = tt.navigateBackMiniProgram;
export const chooseAddresses: BaseApis['chooseAddresses'] = tt.chooseAddresses;
export const getSetting: BaseApis['getSetting'] = tt.getSetting;
export const openSettings: BaseApis['openSettings'] = tt.openSettings;
export const authorize: BaseApis['authorize'] = tt.authorize;
export const showDouyinOpenAuth: BaseApis['showDouyinOpenAuth'] = tt.showDouyinOpenAuth;
export const reportAnalytics: BaseApis['reportAnalytics'] = tt.reportAnalytics;
export const canRateAwemeOrders: BaseApis['canRateAwemeOrders'] = tt.canRateAwemeOrders;
export const rateAwemeOrder: BaseApis['rateAwemeOrder'] = tt.rateAwemeOrder;
export const followOfficialAccount: BaseApis['followOfficialAccount'] = tt.followOfficialAccount;
export const checkFollowState: BaseApis['checkFollowState'] = tt.checkFollowState;
export const openAwemeUserProfile: BaseApis['openAwemeUserProfile'] = tt.openAwemeUserProfile;
export const followAwemeUser: BaseApis['followAwemeUser'] = tt.followAwemeUser;
export const requestSubscribeMessage: BaseApis['requestSubscribeMessage'] = tt.requestSubscribeMessage;
export const openDouyinOrderList: BaseApis['openDouyinOrderList'] = tt.openDouyinOrderList;
export const openEcGood: BaseApis['openEcGood'] = tt.openEcGood;
export const openEcOrderDetail: BaseApis['openEcOrderDetail'] = tt.openEcOrderDetail;
export const openEcIm: BaseApis['openEcIm'] = tt.openEcIm;
export const openEcChat: BaseApis['openEcChat'] = tt.openEcChat;
export const openWebcastRoom: BaseApis['openWebcastRoom'] = tt.openWebcastRoom;
export const openDouyinProfile: BaseApis['openDouyinProfile'] = tt.openDouyinProfile;
export const openEcCoupon: BaseApis['openEcCoupon'] = tt.openEcCoupon;
export const performance: BaseApis['performance'] = tt.performance;
export const getStorage: BaseApis['getStorage'] = tt.getStorage;
export const getStorageSync: BaseApis['getStorageSync'] = tt.getStorageSync;
export const setStorage: BaseApis['setStorage'] = tt.setStorage;
export const setStorageSync: BaseApis['setStorageSync'] = tt.setStorageSync;
export const removeStorage: BaseApis['removeStorage'] = tt.removeStorage;
export const removeStorageSync: BaseApis['removeStorageSync'] = tt.removeStorageSync;
export const clearStorage: BaseApis['clearStorage'] = tt.clearStorage;
export const clearStorageSync: BaseApis['clearStorageSync'] = tt.clearStorageSync;
export const getStorageInfo: BaseApis['getStorageInfo'] = tt.getStorageInfo;
export const getStorageInfoSync: BaseApis['getStorageInfoSync'] = tt.getStorageInfoSync;
export const getLocation: BaseApis['getLocation'] = tt.getLocation;
export const chooseLocation: BaseApis['chooseLocation'] = tt.chooseLocation;
export const openLocation: BaseApis['openLocation'] = tt.openLocation;
export const getNetworkType: BaseApis['getNetworkType'] = tt.getNetworkType;
export const onNetworkStatusChange: BaseApis['onNetworkStatusChange'] = tt.onNetworkStatusChange;
export const getWifiList: BaseApis['getWifiList'] = tt.getWifiList;
export const onGetWifiList: BaseApis['onGetWifiList'] = tt.onGetWifiList;
export const offGetWifiList: BaseApis['offGetWifiList'] = tt.offGetWifiList;
export const getSystemInfo: BaseApis['getSystemInfo'] = tt.getSystemInfo;
export const getSystemInfoSync: BaseApis['getSystemInfoSync'] = tt.getSystemInfoSync;
export const getConnectedWifi: BaseApis['getConnectedWifi'] = tt.getConnectedWifi;
export const startAccelerometer: BaseApis['startAccelerometer'] = tt.startAccelerometer;
export const stopAccelerometer: BaseApis['stopAccelerometer'] = tt.stopAccelerometer;
export const onAccelerometerChange: BaseApis['onAccelerometerChange'] = tt.onAccelerometerChange;
export const startCompass: BaseApis['startCompass'] = tt.startCompass;
export const stopCompass: BaseApis['stopCompass'] = tt.stopCompass;
export const onCompassChange: BaseApis['onCompassChange'] = tt.onCompassChange;
export const makePhoneCall: BaseApis['makePhoneCall'] = tt.makePhoneCall;
export const scanCode: BaseApis['scanCode'] = tt.scanCode;
export const getClipboardData: BaseApis['getClipboardData'] = tt.getClipboardData;
export const setClipboardData: BaseApis['setClipboardData'] = tt.setClipboardData;
export const setKeepScreenOn: BaseApis['setKeepScreenOn'] = tt.setKeepScreenOn;
export const onUserCaptureScreen: BaseApis['onUserCaptureScreen'] = tt.onUserCaptureScreen;
export const offUserCaptureScreen: BaseApis['offUserCaptureScreen'] = tt.offUserCaptureScreen;
export const getScreenBrightness: BaseApis['getScreenBrightness'] = tt.getScreenBrightness;
export const setScreenBrightness: BaseApis['setScreenBrightness'] = tt.setScreenBrightness;
export const disableUserScreenRecord: BaseApis['disableUserScreenRecord'] = tt.disableUserScreenRecord;
export const enableUserScreenRecord: BaseApis['enableUserScreenRecord'] = tt.enableUserScreenRecord;
export const onUserScreenRecord: BaseApis['onUserScreenRecord'] = tt.onUserScreenRecord;
export const offUserScreenRecord: BaseApis['offUserScreenRecord'] = tt.offUserScreenRecord;
export const vibrateShort: BaseApis['vibrateShort'] = tt.vibrateShort;
export const vibrateLong: BaseApis['vibrateLong'] = tt.vibrateLong;
export const onMemoryWarning: BaseApis['onMemoryWarning'] = tt.onMemoryWarning;
export const createCanvasContext: BaseApis['createCanvasContext'] = tt.createCanvasContext;
export const createOffscreenCanvas: BaseApis['createOffscreenCanvas'] = tt.createOffscreenCanvas;
export const showToast: BaseApis['showToast'] = tt.showToast;
export const hideToast: BaseApis['hideToast'] = tt.hideToast;
export const showLoading: BaseApis['showLoading'] = tt.showLoading;
export const hideLoading: BaseApis['hideLoading'] = tt.hideLoading;
export const showModal: BaseApis['showModal'] = tt.showModal;
export const showActionSheet: BaseApis['showActionSheet'] = tt.showActionSheet;
export const showFavoriteGuide: BaseApis['showFavoriteGuide'] = tt.showFavoriteGuide;
export const showInteractionBar: BaseApis['showInteractionBar'] = tt.showInteractionBar;
export const hideInteractionBar: BaseApis['hideInteractionBar'] = tt.hideInteractionBar;
export const showNavigationBarLoading: BaseApis['showNavigationBarLoading'] = tt.showNavigationBarLoading;
export const hideNavigationBarLoading: BaseApis['hideNavigationBarLoading'] = tt.hideNavigationBarLoading;
export const hideHomeButton: BaseApis['hideHomeButton'] = tt.hideHomeButton;
export const setNavigationBarTitle: BaseApis['setNavigationBarTitle'] = tt.setNavigationBarTitle;
export const setNavigationBarColor: BaseApis['setNavigationBarColor'] = tt.setNavigationBarColor;
export const getMenuButtonBoundingClientRect: BaseApis['getMenuButtonBoundingClientRect'] =
  tt.getMenuButtonBoundingClientRect;
export const createAnimation: BaseApis['createAnimation'] = tt.createAnimation;
export const pageScrollTo: BaseApis['pageScrollTo'] = tt.pageScrollTo;
export const setSwipeBackMode: BaseApis['setSwipeBackMode'] = tt.setSwipeBackMode;
export const startPullDownRefresh: BaseApis['startPullDownRefresh'] = tt.startPullDownRefresh;
export const showTabBarRedDot: BaseApis['showTabBarRedDot'] = tt.showTabBarRedDot;
export const showTabBar: BaseApis['showTabBar'] = tt.showTabBar;
export const setTabBarStyle: BaseApis['setTabBarStyle'] = tt.setTabBarStyle;
export const setTabBarItem: BaseApis['setTabBarItem'] = tt.setTabBarItem;
export const setTabBarBadge: BaseApis['setTabBarBadge'] = tt.setTabBarBadge;
export const removeTabBarBadge: BaseApis['removeTabBarBadge'] = tt.removeTabBarBadge;
export const hideTabBarRedDot: BaseApis['hideTabBarRedDot'] = tt.hideTabBarRedDot;
export const hideTabBar: BaseApis['hideTabBar'] = tt.hideTabBar;
export const getAlgorithmManager: BaseApis['getAlgorithmManager'] = tt.getAlgorithmManager;
export const createStickerManager: BaseApis['createStickerManager'] = tt.createStickerManager;
export const createBytennEngineContext: BaseApis['createBytennEngineContext'] = tt.createBytennEngineContext;
export const navigateTo: BaseApis['navigateTo'] = options =>
  tt.navigateTo({ ...options, url: formatPath(options.url) });
export const redirectTo: BaseApis['redirectTo'] = options =>
  tt.redirectTo({ ...options, url: formatPath(options.url) });
export const switchTab: BaseApis['switchTab'] = options => tt.switchTab({ ...options, url: formatPath(options.url) });
export const navigateBack: BaseApis['navigateBack'] = tt.navigateBack;
export const reLaunch: BaseApis['reLaunch'] = tt.reLaunch;
export const showShareMenu: BaseApis['showShareMenu'] = tt.showShareMenu;
export const hideShareMenu: BaseApis['hideShareMenu'] = tt.hideShareMenu;
export const navigateToVideoView: BaseApis['navigateToVideoView'] = tt.navigateToVideoView;
export const getExtConfig: BaseApis['getExtConfig'] = tt.getExtConfig;
export const getExtConfigSync: BaseApis['getExtConfigSync'] = tt.getExtConfigSync;
export const createSelectorQuery: BaseApis['createSelectorQuery'] = tt.createSelectorQuery;
export const createIntersectionObserver: BaseApis['createIntersectionObserver'] = tt.createIntersectionObserver;
export const createLiveReportContext: BaseApis['createLiveReportContext'] = tt.createLiveReportContext;
export const getRoomInfo: BaseApis['getRoomInfo'] = tt.getRoomInfo;
export const getLiveUserInfo: BaseApis['getLiveUserInfo'] = tt.getLiveUserInfo;
export const getSelfCommentCountDuringPluginRunning: BaseApis['getSelfCommentCountDuringPluginRunning'] =
  tt.getSelfCommentCountDuringPluginRunning;
export const isFollowingAnchor: BaseApis['isFollowingAnchor'] = tt.isFollowingAnchor;
export const onReceiveAudiencesFollowAction: BaseApis['onReceiveAudiencesFollowAction'] =
  tt.onReceiveAudiencesFollowAction;
export const subscribeAudiencesFollowAction: BaseApis['subscribeAudiencesFollowAction'] =
  tt.subscribeAudiencesFollowAction;
export const unsubscribeAudiencesFollowAction: BaseApis['unsubscribeAudiencesFollowAction'] =
  tt.unsubscribeAudiencesFollowAction;
export const subscribeSpecifiedContentComment: BaseApis['subscribeSpecifiedContentComment'] =
  tt.subscribeSpecifiedContentComment;
export const subscribeSpecifiedUserComment: BaseApis['subscribeSpecifiedUserComment'] =
  tt.subscribeSpecifiedUserComment;
export const unsubscribeAllSpecifiedContentComment: BaseApis['unsubscribeAllSpecifiedContentComment'] =
  tt.unsubscribeAllSpecifiedContentComment;
export const unsubscribeAllSpecifiedUserComment: BaseApis['unsubscribeAllSpecifiedUserComment'] =
  tt.unsubscribeAllSpecifiedUserComment;
export const onReceiveSpecifiedComment: BaseApis['onReceiveSpecifiedComment'] = tt.onReceiveSpecifiedComment;
