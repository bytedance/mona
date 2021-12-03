import { BaseApis } from '@bytedance/mona'
import formatPath from '../utils/formatPath';

const noImplementFactory = (api: string) => {
  return (): any => {
    console.error('no implement' + api + ' in web')
  };
}

class WebApis extends BaseApis {
  canIUse = noImplementFactory('canIUse')
  // base64ToArrayBuffer = tt.base64ToArrayBuffer
  // arrayBufferToBase64 = tt.arrayBufferToBase64
  // getEnterOptionsSync = tt.getEnterOptionsSync
  // getLaunchOptionsSync = tt.getLaunchOptionsSync
  // exitMiniProgram = tt.exitMiniProgram
  // canIPutStuffOverComponent = tt.canIPutStuffOverComponent
  // getUpdateManager = tt.getUpdateManager
  // onAppShow = tt.onAppShow
  // offAppShow = tt.offAppShow
  // onAppHide = tt.onAppHide
  // offAppHide = tt.offAppHide
  // onError = tt.onError
  // offError = tt.offError
  // env = tt.env
  // downloadFile = tt.downloadFile
  // request = tt.request
  // uploadFile = tt.uploadFile
  // connectSocket = tt.connectSocket
  // chooseImage = tt.chooseImage
  // saveImageToPhotosAlbum = tt.saveImageToPhotosAlbum
  // previewImage = tt.previewImage
  // getImageInfo = tt.getImageInfo
  // compressImage = tt.compressImage
  // getRecorderManager = tt.getRecorderManager
  // getBackgroundAudioManager = tt.getBackgroundAudioManager
  // createInnerAudioContext = tt.createInnerAudioContext
  // chooseVideo = tt.chooseVideo
  // saveVideoToPhotoAlbum = tt.saveVideoToPhotoAlbum
  // createVideoContext = tt.createVideoContext
  // craeteLivePlayerContext = tt.craeteLivePlayerContext
  // preloadVideo = tt.preloadVideo
  // createCameraContext = tt.createCameraContext
  // createEffectCameraStream = tt.createEffectCameraStream
  // createMapContext = tt.createMapContext
  // saveFile = tt.saveFile
  // getFileInfo = tt.getFileInfo
  // getSavedFileList = tt.getSavedFileList
  // openDocument = tt.openDocument
  // removeSavedFile = tt.removeSavedFile
  // getFileSystemManager = tt.getFileSystemManager
  // getEnvInfoSync = tt.getEnvInfoSync
  // login = tt.login
  // checkSession = tt.checkSession
  // getUserInfo = tt.getUserInfo
  // getUserInfoProfile = tt.getUserInfoProfile
  // createRewardedVideoAd = tt.createRewardedVideoAd
  // createInterstitialAd = tt.createInterstitialAd
  // pay = tt.pay
  // navigateToMiniProgram = tt.navigateToMiniProgram
  // navigateBackMiniProgram = tt.navigateBackMiniProgram
  // chooseAddresses = tt.chooseAddresses
  // getSetting = tt.getSetting
  // openSettings = tt.openSettings
  // authorize = tt.authorize
  // showDouyinOpenAuth = tt.showDouyinOpenAuth
  // reportAnalytics = tt.reportAnalytics
  // canRateAwemeOrders = tt.canRateAwemeOrders
  // rateAwemeOrder = tt.rateAwemeOrder
  // followOfficialAccount = tt.followOfficialAccount
  // checkFollowState = tt.checkFollowState
  // openAwemeUserProfile = tt.openAwemeUserProfile
  // followAwemeUser = tt.followAwemeUser
  // requestSubscribeMessage = tt.requestSubscribeMessage
  // openDouyinOrderList = tt.openDouyinOrderList
  // openEcGood = tt.openEcGood
  // openEcOrderDetail = tt.openEcOrderDetail
  // openEcIm = tt.openEcIm
  // openEcChat = tt.openEcChat
  // openWebcastRoom = tt.openWebcastRoom
  // openDouyinProfile = tt.openDouyinProfile
  // openEcCoupon = tt.openEcCoupon
  // performance = tt.performance
  // getStorage = tt.getStorage
  // getStorageSync = tt.getStorageSync
  // setStorage = tt.setStorage
  // setStorageSync = tt.setStorageSync
  // removeStorage = tt.removeStorage
  // removeStorageSync = tt.removeStorageSync
  // clearStorage = tt.clearStorage
  // clearStorageSync = tt.clearStorageSync
  // getStorageInfo = tt.getStorageInfo
  // getStorageInfoSync = tt.getStorageInfoSync
  // getLocation = tt.getLocation
  // chooseLocation = tt.chooseLocation
  // openLocation = tt.openLocation
  // getNetworkType = tt.getNetworkType
  // onNetworkStatusChange = tt.onNetworkStatusChange
  // getWifiList = tt.getWifiList
  // onGetWifiList = tt.onGetWifiList
  // offGetWifiList = tt.offGetWifiList
  // getSystemInfo = tt.getSystemInfo
  // getSystemInfoSync = tt.getSystemInfoSync
  // getConnectedWifi = tt.getConnectedWifi
  // startAccelerometer = tt.startAccelerometer
  // stopAccelerometer = tt.stopAccelerometer
  // onAccelerometerChange = tt.onAccelerometerChange
  // startCompass = tt.startCompass
  // stopCompass = tt.stopCompass
  // onCompassChange = tt.onCompassChange
  // makePhoneCall = tt.makePhoneCall
  // scanCode = tt.scanCode
  // getClipboardData = tt.getClipboardData
  // setClipboardData = tt.setClipboardData
  // setKeepScreenOn = tt.setKeepScreenOn
  // onUserCaptureScreen = tt.onUserCaptureScreen
  // offUserCaptureScreen = tt.offUserCaptureScreen
  // getScreenBrightness = tt.getScreenBrightness
  // setScreenBrightness = tt.setScreenBrightness
  // disableUserScreenRecord = tt.disableUserScreenRecord
  // enableUserScreenRecord = tt.enableUserScreenRecord
  // onUserScreenRecord = tt.onUserScreenRecord
  // offUserScreenRecord = tt.offUserScreenRecord
  // vibrateShort = tt.vibrateShort
  // vibrateLong = tt.vibrateLong
  // onMemoryWarning = tt.onMemoryWarning
  // createCanvasContext = tt.createCanvasContext
  // createOffscreenCanvas = tt.createOffscreenCanvas
  // showToast = tt.showToast
  // hideToast = tt.hideToast
  // showLoading = tt.showLoading
  // hideLoading = tt.hideLoading
  // showModal = tt.showModal
  // showActionSheet = tt.showActionSheet
  // showFavoriteGuide = tt.showFavoriteGuide
  // showInteractionBar = tt.showInteractionBar
  // hideInteractionBar = tt.hideInteractionBar
  // showNavigationBarLoading = tt.showNavigationBarLoading
  // hideNavigationBarLoading = tt.hideNavigationBarLoading
  // hideHomeButton = tt.hideHomeButton
  // setNavigationBarTitle = tt.setNavigationBarTitle
  // setNavigationBarColor = tt.setNavigationBarColor
  // getMenuButtonBoundingClientRect = tt.getMenuButtonBoundingClientRect
  // createAnimation = tt.createAnimation
  // pageScrollTo = tt.pageScrollTo
  // setSwipeBackMode = tt.setSwipeBackMode
  // startPullDownRefresh = tt.startPullDownRefresh
  // showTabBarRedDot = tt.showTabBarRedDot
  // showTabBar = tt.showTabBar
  // setTabBarStyle = tt.setTabBarStyle
  // setTabBarItem = tt.setTabBarItem
  // setTabBarBadge = tt.setTabBarBadge
  // removeTabBarBadge = tt.removeTabBarBadge
  // hideTabBarRedDot = tt.hideTabBarRedDot
  // hideTabBar = tt.hideTabBar
  // getAlgorithmManager = tt.getAlgorithmManager
  // createStickerManager = tt.createStickerManager
  // createBytennEngineContext = tt.createBytennEngineContext
  // navigateTo = tt.navigateTo
  // redirectTo = tt.redirectTo
  // switchTab = tt.switchTab
  // navigateBack = tt.navigateBack
  // reLaunch = tt.reLaunch
  // showShareMenu = tt.showShareMenu
  // hideShareMenu = tt.hideShareMenu
  // navigateToVideoView = tt.navigateToVideoView
  // getExtConfig = tt.getExtConfig
  // getExtConfigSync = tt.getExtConfigSync
  // createSelectorQuery = tt.createSelectorQuery
  // createIntersectionObserver = tt.createIntersectionObserver
  // createLiveReportContext = tt.createLiveReportContext
  // getRoomInfo = tt.getRoomInfo
  // getLiveUserInfo = tt.getLiveUserInfo
  // getSelfCommentCountDuringPluginRunning = tt.getSelfCommentCountDuringPluginRunning
  // isFollowingAnchor = tt.isFollowingAnchor
  // onReceiveAudiencesFollowAction = tt.onReceiveAudiencesFollowAction
  // subscribeAudiencesFollowAction = tt.subscribeAudiencesFollowAction
  // unsubscribeAudiencesFollowAction = tt.unsubscribeAudiencesFollowAction
  // subscribeSpecifiedContentComment = tt.subscribeSpecifiedContentComment
  // subscribeSpecifiedUserComment = tt.subscribeSpecifiedUserComment
  // unsubscribeAllSpecifiedContentComment = tt.unsubscribeAllSpecifiedContentComment
  // unsubscribeAllSpecifiedUserComment = tt.unsubscribeAllSpecifiedUserComment
  // onReceiveSpecifiedComment = tt.onReceiveSpecifiedComment
  open = () => { throw Error('not implemented in miniapp') }

  // showToast(params: any) {
  //   window.alert(params.title);
  //   return Promise.resolve();
  // }
  // navigateTo(params: any) {
  //   const url = typeof params === 'string' ? params : params.url;
  //   history.pushState({}, '', formatPath(url));
  //   return Promise.resolve();
  // }
  // redirectTo(params: any) {
  //   const url = typeof params === 'string' ? params : params.url;
  //   window.location.href = formatPath(url);
  //   return Promise.resolve();
  // }
  // open(params: any) {
  //   const url = typeof params === 'string' ? params : params.url;
  //   window.open(formatPath(url));
  //   return Promise.resolve();
  // }
}

export default WebApis