import {
  BaseApis,
  Callbacks,
  StorageInfo,
  GetLocationOptions,
  CommonErrorArgs,
  GetLocationSuccessCallbackArgs,
  NetworkType,
  ShowToastOptions,
  ShowModalOptions,
  ActionSheetProps
} from '@bytedance/mona';
import formatPath from '../utils/formatPath';
import {
  webShowToast,
  webHideToast,
  webShowLoading,
  webShowModal,
  webShowActionSheet
} from './components/';

const noImplementFactory = (api: string) => (): any => {
  console.error(`no implement${api} in web`);
};

class WebApis extends BaseApis {
  canIUse = noImplementFactory('canIUse');
  base64ToArrayBuffer(str: string) {
    return window.btoa(str);
  }
  arrayBufferToBase64(str: string) {
    return window.atob(str);
  }
  getEnterOptionsSync = noImplementFactory('getEnterOptionsSync');
  getLaunchOptionsSync = noImplementFactory('getLaunchOptionsSync');
  exitMiniProgram = noImplementFactory('exitMiniProgram');
  canIPutStuffOverComponent = noImplementFactory('canIPutStuffOverComponent');
  getUpdateManager = noImplementFactory('getUpdateManager');
  onAppShow = noImplementFactory('onAppShow');
  offAppShow = noImplementFactory('offAppShow');
  onAppHide = noImplementFactory('onAppHide');
  offAppHide = noImplementFactory('offAppHide');
  onError = noImplementFactory('onError');
  offError = noImplementFactory('offError');
  env = {
    VERSION: '1',
    USER_DATA_PATH: '/',
  };
  downloadFile = noImplementFactory('downloadFile');
  request = noImplementFactory('request');
  uploadFile = noImplementFactory('uploadFile');
  connectSocket = noImplementFactory('connectSocket');
  chooseImage = noImplementFactory('chooseImage');
  saveImageToPhotosAlbum = noImplementFactory('saveImageToPhotosAlbum');
  previewImage = noImplementFactory('previewImage');
  getImageInfo = noImplementFactory('getImageInfo');
  compressImage = noImplementFactory('compressImage');
  getRecorderManager = noImplementFactory('getRecorderManager');
  getBackgroundAudioManager = noImplementFactory('getBackgroundAudioManager');
  createInnerAudioContext = noImplementFactory('createInnerAudioContext');
  chooseVideo = noImplementFactory('chooseVideo');
  saveVideoToPhotoAlbum = noImplementFactory('saveVideoToPhotoAlbum');
  createVideoContext = noImplementFactory('createVideoContext');
  createLivePlayerContext = noImplementFactory('createLivePlayerContext');
  preloadVideo = noImplementFactory('preloadVideo');
  createCameraContext = noImplementFactory('createCameraContext');
  createEffectCameraStream = noImplementFactory('createEffectCameraStream');
  createMapContext = noImplementFactory('createMapContext');
  saveFile = noImplementFactory('saveFile');
  getFileInfo = noImplementFactory('getFileInfo');
  getSavedFileList = noImplementFactory('getSavedFileList');
  openDocument = noImplementFactory('openDocument');
  removeSavedFile = noImplementFactory('removeSavedFile');
  getFileSystemManager = noImplementFactory('getFileSystemManager');
  getEnvInfoSync = noImplementFactory('getEnvInfoSync');
  login = noImplementFactory('login');
  checkSession = noImplementFactory('checkSession');
  getUserInfo = noImplementFactory('getUserInfo');
  getUserInfoProfile = noImplementFactory('getUserInfoProfile');
  createRewardedVideoAd = noImplementFactory('createRewardedVideoAd');
  createInterstitialAd = noImplementFactory('createInterstitialAd');
  pay = noImplementFactory('pay');
  navigateToMiniProgram = noImplementFactory('navigateToMiniProgram');
  navigateBackMiniProgram = noImplementFactory('navigateBackMiniProgram');
  chooseAddresses = noImplementFactory('chooseAddresses');
  getSetting = noImplementFactory('getSetting');
  openSettings = noImplementFactory('openSettings');
  authorize = noImplementFactory('authorize');
  showDouyinOpenAuth = noImplementFactory('showDouyinOpenAuth');
  reportAnalytics = noImplementFactory('reportAnalytics');
  canRateAwemeOrders = noImplementFactory('canRateAwemeOrders');
  rateAwemeOrder = noImplementFactory('rateAwemeOrder');
  followOfficialAccount = noImplementFactory('followOfficialAccount');
  checkFollowState = noImplementFactory('checkFollowState');
  openAwemeUserProfile = noImplementFactory('openAwemeUserProfile');
  followAwemeUser = noImplementFactory('followAwemeUser');
  requestSubscribeMessage = noImplementFactory('requestSubscribeMessage');
  openDouyinOrderList = noImplementFactory('openDouyinOrderList');
  openEcGood = noImplementFactory('openEcGood');
  openEcOrderDetail = noImplementFactory('openEcOrderDetail');
  openEcIm = noImplementFactory('openEcIm');
  openEcChat = noImplementFactory('openEcChat');
  openWebcastRoom = noImplementFactory('openWebcastRoom');
  openDouyinProfile = noImplementFactory('openDouyinProfile');
  openEcCoupon = noImplementFactory('openEcCoupon');
  performance = {
    getEntries: noImplementFactory('getEntries'),
    getEntriesByName: noImplementFactory('getEntriesByName'),
    getEntriesByType: noImplementFactory('getEntriesByType'),
    getCurrentPageEntries: noImplementFactory('getCurrentPageEntries'),
    getEntriesByPage: noImplementFactory('getEntriesByPage'),
    mark: noImplementFactory('mark'),
    clearMarks: noImplementFactory('clearnMarks'),
  };
  getStorage = noImplementFactory('getStorage');
  getStorageSync(key: string) {
    return window.localStorage.getItem(key);
  }
  setStorage = noImplementFactory('setStorage');
  setStorageSync(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }
  removeStorage = noImplementFactory('removeStorage');
  removeStorageSync(key: string) {
    window.localStorage.removeItem(key);
  }
  clearStorage = noImplementFactory('clearStorage');
  clearStorageSync() {
    window.localStorage.clear();
  }
  getStorageInfo = noImplementFactory('getStorageInfo');
  getStorageInfoSync(): StorageInfo {
    return {
      keys: Object.keys(window.localStorage),
      limitSize: 10240,
      currentSize: 1,
    };
  }
  getLocation(options: GetLocationOptions) {
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
  chooseLocation = noImplementFactory('chooseLocation');
  openLocation = noImplementFactory('openLocation');
  getNetworkType(
    options: Callbacks<{ networkType: NetworkType; }, CommonErrorArgs>
  ) {
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
  onNetworkStatusChange = noImplementFactory('onNetworkStatusChange');
  getWifiList = noImplementFactory('getWifiList');
  onGetWifiList = noImplementFactory('onGetWifiList');
  offGetWifiList = noImplementFactory('offGetWifiList');
  getSystemInfo = noImplementFactory('getSystemInfo');
  getSystemInfoSync = noImplementFactory('getSystemInfoSync');
  getConnectedWifi = noImplementFactory('getConnectedWifi');
  startAccelerometer = noImplementFactory('startAccelerometer');
  stopAccelerometer = noImplementFactory('stopAccelerometer');
  onAccelerometerChange = noImplementFactory('onAccelerometerChange');
  startCompass = noImplementFactory('startCompass');
  stopCompass = noImplementFactory('stopCompass');
  onCompassChange = noImplementFactory('onCompassChange');
  makePhoneCall = noImplementFactory('makePhoneCall');
  scanCode = noImplementFactory('scanCode');
  getClipboardData = noImplementFactory('getClipboardData');
  setClipboardData = noImplementFactory('setClipboardData');
  setKeepScreenOn = noImplementFactory('setKeepScreenOn');
  onUserCaptureScreen = noImplementFactory('onUserCaptureScreen');
  offUserCaptureScreen = noImplementFactory('offUserCaptureScreen');
  getScreenBrightness = noImplementFactory('getScreenBrightness');
  setScreenBrightness = noImplementFactory('setScreenBrightness');
  disableUserScreenRecord = noImplementFactory('disableUserScreenRecord');
  enableUserScreenRecord = noImplementFactory('enableUserScreenRecord');
  onUserScreenRecord = noImplementFactory('onUserScreenRecord');
  offUserScreenRecord = noImplementFactory('offUserScreenRecord');
  vibrateShort = noImplementFactory('vibrateShort');
  vibrateLong = noImplementFactory('vibrateLong');
  onMemoryWarning = noImplementFactory('onMemoryWarning');
  createCanvasContext = noImplementFactory('createCanvasContext');
  createOffscreenCanvas = noImplementFactory('createOffscreenCanvas');
  showToast(config: ShowToastOptions) {
    webShowToast(config);
  }
  hideToast = webHideToast;
  showLoading(options: { title: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>) {
    webShowLoading(options);
  }
  hideLoading = webHideToast;
  showModal(options: ShowModalOptions) {
    webShowModal(options);
  }
  showActionSheet(options: ActionSheetProps) {
    webShowActionSheet(options);
  }

  showFavoriteGuide = noImplementFactory('showFavoriteGuide');
  showInteractionBar = noImplementFactory('showInteractionBar');
  hideInteractionBar = noImplementFactory('hideInteractionBar');
  showNavigationBarLoading = noImplementFactory('showNavigationBarLoading');
  hideNavigationBarLoading = noImplementFactory('hideNavigationBarLoading');
  hideHomeButton = noImplementFactory('hideHomeButton');
  setNavigationBarTitle = noImplementFactory('setNavigationBarTitle');
  setNavigationBarColor = noImplementFactory('setNavigationBarColor');
  getMenuButtonBoundingClientRect = noImplementFactory(
    'getMenuButtonBoundingClientRect'
  );
  createAnimation = noImplementFactory('createAnimation');
  pageScrollTo(
    options: { scrollTop: number; duration?: number; } & Callbacks<
      CommonErrorArgs,
      CommonErrorArgs
    >
  ) {
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
  setSwipeBackMode = noImplementFactory('setSwipeBackMode');
  startPullDownRefresh = noImplementFactory('startPullDownRefresh');
  showTabBarRedDot = noImplementFactory('showTabBarRedDot');
  showTabBar = noImplementFactory('showTabBar');
  setTabBarStyle = noImplementFactory('setTabBarStyle');
  setTabBarItem = noImplementFactory('setTabBarItem');
  setTabBarBadge = noImplementFactory('setTabBarBadge');
  removeTabBarBadge = noImplementFactory('removeTabBarBadge');
  hideTabBarRedDot = noImplementFactory('hideTabBarRedDot');
  hideTabBar = noImplementFactory('hideTabBar');
  getAlgorithmManager = noImplementFactory('getAlgorithmManager');
  createStickerManager = noImplementFactory('createStickerManager');
  createBytennEngineContext = noImplementFactory('createBytennEngineContext');
  navigateTo(
    options: { url: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>
  ) {
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
  redirectTo(
    options: { url: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>
  ) {
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
  switchTab = noImplementFactory('switchTab');
  navigateBack(
    options: { delta?: number; } & Callbacks<CommonErrorArgs, CommonErrorArgs>
  ) {
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
  reLaunch(
    options: { url: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>
  ) {
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
  showShareMenu = noImplementFactory('showShareMenu');
  hideShareMenu = noImplementFactory('hideShareMenu');
  navigateToVideoView = noImplementFactory('navigateToVideoView');
  getExtConfig = noImplementFactory('getExtConfig');
  getExtConfigSync = noImplementFactory('getExtConfigSync');
  createSelectorQuery = noImplementFactory('createSelectorQuery');
  createIntersectionObserver = noImplementFactory('createIntersectionObserver');
  createLiveReportContext = noImplementFactory('createLiveReportContext');
  getRoomInfo = noImplementFactory('getRoomInfo');
  getLiveUserInfo = noImplementFactory('getLiveUserInfo');
  getSelfCommentCountDuringPluginRunning = noImplementFactory(
    'getSelfCommentCountDuringPluginRunning'
  );
  isFollowingAnchor = noImplementFactory('isFollowingAnchor');
  onReceiveAudiencesFollowAction = noImplementFactory(
    'onReceiveAudiencesFollowAction'
  );
  subscribeAudiencesFollowAction = noImplementFactory(
    'subscribeAudiencesFollowAction'
  );
  unsubscribeAudiencesFollowAction = noImplementFactory(
    'unsubscribeAudiencesFollowAction'
  );
  subscribeSpecifiedContentComment = noImplementFactory(
    'subscribeSpecifiedContentComment'
  );
  subscribeSpecifiedUserComment = noImplementFactory(
    'subscribeSpecifiedUserComment'
  );
  unsubscribeAllSpecifiedContentComment = noImplementFactory(
    'unsubscribeAllSpecifiedContentComment'
  );
  unsubscribeAllSpecifiedUserComment = noImplementFactory(
    'unsubscribeAllSpecifiedUserComment'
  );
  onReceiveSpecifiedComment = noImplementFactory('onReceiveSpecifiedComment');
  open = noImplementFactory('open');
}

export default WebApis;
