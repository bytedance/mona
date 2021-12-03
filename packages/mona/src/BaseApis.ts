interface EnterOrLaunchOptions {
  path: string;
  scene: string;
  query: object;
  referrerInfo: { appId: string; extraData: object };
  showFrom: number;
}

interface UpdateManager {
  onCheckForUpdate: (callback: (param: { hasUpdate: boolean }) => void) => void;
  onUpdateReady: (callback: () => void) => void;
  onUpdateFailed: (callback: (err: string) => void) => void;
  applyUpdate: (calllback: () => void) => void;
}

interface Callbacks<SuccessArg = any, FailArg = any> {
  success?: (arg: SuccessArg) => void;
  fail?: (arg: FailArg) => void;
  complete?: (arg: SuccessArg | FailArg) => void;
}

interface CommonErrorArgs {
  errMsg: string;
}

interface DownloadFileCallbackSuccessArgs {
  tempFilePath: string;
  statusCode: number;
}

interface DownloadFileOptions extends Callbacks<DownloadFileCallbackSuccessArgs, CommonErrorArgs> {
  url: string;
  header?: object;
}

interface ReqeustResponseProfile {
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  SSLconnectionStart: number;
  SSLconnectionEnd: number;
  requestStart: number;
  requestEnd: number;
  responseStart: number;
  responseEnd: number;
  peerIP: string;
  port: number;
  socketReused: boolean;
}

interface RequestSuccesssCallbackArgs {
  statusCode: number;
  header: object;
  data: object | string | ArrayBuffer;
  profile: ReqeustResponseProfile
}

interface RequestFailCallbackArgs extends CommonErrorArgs {
  errNo: string;
  profile?: ReqeustResponseProfile
}

interface RequestOptions extends Callbacks<RequestSuccesssCallbackArgs, RequestFailCallbackArgs> {
  url: string;
  header?: object;
  method?: 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'DELETE' | 'PUT' | 'TRACE'  | 'CONNECT'
  data?: object | string | ArrayBuffer;
  dataType?: 'json' | 'string';
  timeout?: number;
  enableCache?: boolean;
  responseType?: 'text' | 'arraybuffer';
}

interface UploadFileSuccesssCallbackArgs {
  data: string;
  statusCode: number;
}
interface UploadFileOptions extends Callbacks<UploadFileSuccesssCallbackArgs, CommonErrorArgs> {
  url: string;
  filePath: string;
  name: string;
  header?: object;
  formData?: object
}

interface ConnectSocketSuccessCallbackArgs {
  errMsg: string;
  socketTaskId: number;
}
interface ConnectSocketOptions extends Callbacks<ConnectSocketSuccessCallbackArgs, CommonErrorArgs> {
  url: string;
  header?: object;
  protocols: string[];
}

interface DownloadTask {
  abort: () => void;
  onProgress: (callback: { progress: number; totalBytesWritten: number; totalBytesExpectedToWrite: number }) => void;
}

interface RequestTask {
  abort: () => void;
}

type UploadTask = DownloadTask;

enum SocketTaskReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}

interface SocketTaskSendOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  data: string | ArrayBuffer;
}

interface SocketTaskCloseOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  code?: 1000 | 1001;
  reason?: string;
}
interface SocketTask {
  readyState?: SocketTaskReadyState;
  send: (options: SocketTaskSendOptions) => void;
  close: (options: SocketTaskCloseOptions) => void;
  onOpen: (callback: (params: {
    header: object;
    protocolType: string;
    socketType: 'ttnet' | 'tradition'
  }) => void) => void;
  onClose: (callback: (params: {
    protocolType: string;
    socketType: 'ttnet' | 'tradition',
    errMsg: string;
    reason: string;
    code: string;
  }) => void) => void
  onMessage: (callback: (params: {
    data: string | ArrayBuffer;
    protocolType: string;
    socketType: 'ttnet' | 'tradition',
  }) => void) => void
  onError: (callback: (params: {
    errMsg: string;
  }) => void) => void
}

interface ChooseImageSuccessCallbackArgs {
  tempFilePaths: string[];
  tempFiles: { path: string; size: number }[];
}
interface ChooseImageOptions extends Callbacks<ChooseImageSuccessCallbackArgs, CommonErrorArgs> {
  count?: number;
  sourceType?: ('album' | 'camera')[];
}

interface SaveImageOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  filePath: string;
}

interface PreviewImageOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  urls: string[];
  current?: string;
}

interface GetImageInfoSuccessCallbackArgs {
  errMsg: string;
  width: number;
  height: number;
  type: string;
  path: string;
  orientation: 'up' | 'up-mirrored' | 'down' | 'down-mirrored' | 'left' | 'left-mirrored' | 'right' | 'right-mirrored';
}

interface GetImageInfoOptions extends Callbacks<GetImageInfoSuccessCallbackArgs, CommonErrorArgs> {
  src: string;
}

interface CompressImageSuccessCallbackArgs {
  errMsg: string;
  tempFilePath: string;
}

interface CompressImageOptions extends Callbacks<CompressImageSuccessCallbackArgs, CommonErrorArgs> {
  src: string;
  quality?: number;
}

interface RecorderManagerStartOptions {
  duration?: number;
  sampleRate?: number;
  numberOfChannels?: number;
  encodeBitRate?: number;
  frameSize?: number;
  format?: string;
}
interface RecorderManager {
  pause: () => void;
  start: (options: RecorderManagerStartOptions) => void;
  resume: () => void;
  stop: () => void;
  onStart: (callback: () => void) => void;
  onPause: (callback: () => void) => void;
  // TODO
  onStop: (callback: (data: any) => void) => void;
  onError: (callback: (err: CommonErrorArgs) => void) => void;
  onResume: (callback: (data: any) => void) => void;
  onFrameRecorded: (callback: (data: { isLastFrame: boolean; frameBuffer: Buffer }) => void) => void;
}

interface BackgroundAudioManager {
  src?: string;
  startTime?: number;
  title?: string;
  epname?: string;
  singer?: string;
  coverImgUrl?: string;
  webUrl?: string;
  protocol?: string;
  audioPage?: { path: string; query: { name: string } };
  duration?: number;
  currentTime?: number;
  paused?: boolean;
  buffered?: number;
  playbackRate?: number;
  referrerPolicy?: string;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  onCanplay: (callback: (data: any) => void) => void;
  onPlay: (callback: (data: any) => void) => void;
  onPause: (callback: (data: any) => void) => void;
  onStop: (callback: (data: any) => void) => void;
  onEnded: (callback: (data: any) => void) => void;
  onTimeUpdate: (callback: (data: any) => void) => void;
  onError: (callback: (data: { errMsg: string; errCode: number }) => void) => void;
  onWaiting: (callback: (data: any) => void) => void;
  onSeek: (callback: (data: any) => void) => void;
  onNext: (callback: (data: any) => void) => void;
  onSeeking: (callback: (data: any) => void) => void;
  onPrev: (callback: (data: any) => void) => void;
  offTimeUpdate: (callback: (data: any) => void) => void;
}

interface InnerAudioContext {
  src: string;
  startTime?: number;
  autoplay?: boolean
  loop?: boolean;
  obeyMuteSwitch?: boolean;
  duration?: boolean;
  currentTime: number;
  paused?: boolean;
  buffered?: number;
  volume?: number;
  playbackRate?: number;
  referrerPolicy?: string;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  destroy: () => void;
  offCanplay: (callback: (data: any) => void) => void;
  onCanplay: (callback: (data: any) => void) => void;
  onPlay: (callback: (data: any) => void) => void;
  onPause: (callback: (data: any) => void) => void;
  onStop: (callback: (data: any) => void) => void;
  onEnded: (callback: (data: any) => void) => void;
  onTimeUpdate: (callback: (data: any) => void) => void;
  onError: (callback: (data: { errMsg: string; errCode: number }) => void) => void;
  onWaiting: (callback: (data: any) => void) => void;
  onSeeking: (callback: (data: any) => void) => void;
  onSeeked: (callback: (data: any) => void) => void;
  offPlay: (callback: (data: any) => void) => void;
  offPause: (callback: (data: any) => void) => void;
  offStop: (callback: (data: any) => void) => void;
  offEnded: (callback: (data: any) => void) => void;
  offTimeUpdate: (callback: (data: any) => void) => void;
  offError: (callback: (data: any) => void) => void;
  offWaiting: (callback: (data: any) => void) => void;
  offSeeking: (callback: (data: any) => void) => void;
  offSeeked: (callback: (data: any) => void) => void;
}

interface ChooseVideoSuccessCallbackArgs {
  errMsg: string;
  tempFilePath: string;
  duraction: number;
  size: number;
  width: number;
  height: number;
}
interface ChooseVideoOptions extends Callbacks<ChooseVideoSuccessCallbackArgs, CommonErrorArgs> {
  sourceType?: ('album' | 'camera')[];
  compressed?: boolean;
  camera?: 'back' | 'front';
  maxDuration?: number;
}

interface SaveVideoOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  filePath: string;
}

interface VideoContext {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  requestFullScreen: () => void;
  exitFullScreen: () => void;
}

interface LivePlayerContext {
  play: () => void;
  stop: () => void;
  mute: () => void;
  unmute: () => void;
  requestFullScreen: (options: { direction: 0 | 90 | -90 }) => void;
  exitFullScreen: () => void;
}

interface PreloadVideoOptions {
  src: string;
  size?: number;
}

interface PreloadVideoTask {
  abort: () => void;
}

interface CameraFrameListener {
  start: (options: Callbacks) => void;
  stop: (options: Callbacks) => void;
}

interface CameraContextOnCameraFrameCallbackArgs {
  width: number;
  height: number;
  data: ArrayBuffer;
  timestamp: number
}

interface CameraContextSetZoomSuccessCallbackArgs {
  width: number;
  errMsg: string;
  height: number;
  data: ArrayBuffer;
}

interface CameraContextSetZoomFailCallbackArgs extends CommonErrorArgs {
  errCode: number;
}
interface CameraContextSetZoomOptions extends Callbacks<CameraContextSetZoomSuccessCallbackArgs, CameraContextSetZoomFailCallbackArgs>{
  zoom: number;
}
interface CameraContext {
  onCameraFrame: (callback: (args: CameraContextOnCameraFrameCallbackArgs) => void) => CameraFrameListener;
  setZoom: (options: CameraContextSetZoomOptions) => void;
}

interface EffectCameraPaintToFailCallbackArgs extends CommonErrorArgs {
  errNo: number;
}
interface EffectCameraPaintToOptions extends Callbacks<CommonErrorArgs, EffectCameraPaintToFailCallbackArgs>{
  canvas: any;
  dx?: number;
  dy?: number
  sx?: number;
  sy?: number;
}

interface EffectCameraVideo {
  width: number;
  height: number;
}

interface EffectCameraStream {
  request: (options: { orientation: 'back' | 'front' }) => void;
  play: () => void;
  stop: () => void;
  paintTo: (options: EffectCameraPaintToOptions) => void;
  onRequest: (callback: (data: any) => void) => void;
  offRequest: (callback: (data: any) => void) => void;
  onPlay: (callback: (data: any) => void) => EffectCameraVideo;
  offPlay: (callback: (data: any) => void) => void;
  onStop: (callback: (data: any) => void) => void;
  offStop: (callback: (data: any) => void) => void;
  onError: (callback: (data: { type: string; errMsg: string }) => void) => void;
  offError: (callback: (data: any) => void) => void;
  dispose: () => void;
}

interface Coordinates {
  longtitude: number;
  latitude: number;
}


interface MapContextGetCenterLocationOptions extends Callbacks<Coordinates, CommonErrorArgs> {}

interface MapContextGetRegionSuccessCallbackArgs {
  southwest: Coordinates;
  northeast: Coordinates;
}

interface MapContextGetRegionOptions extends Callbacks<MapContextGetRegionSuccessCallbackArgs, CommonErrorArgs> {}

interface MapContextGetScaleSuccessCallbackArgs {
  scale: number;
}
interface MapContextGetScaleOptions extends Callbacks<MapContextGetScaleSuccessCallbackArgs, CommonErrorArgs> {}

interface MapContextMoveToLocationOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs>, Coordinates {}

interface MapContextGetRotateSuccessCallbackArgs {
  errMsg: string;
  rotate: number;
}
interface MapContextGetRotateOptions extends Callbacks<MapContextGetRotateSuccessCallbackArgs, CommonErrorArgs> {}
interface MapContextIncludePointsOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  points: Coordinates[];
  padding?: [number, number, number, number];
}

interface MapContextGetSkewSuccessCallbackArgs {
  errMsg: string;
  skew: number;
}
interface MapContextGetSkewOptions extends Callbacks<MapContextGetSkewSuccessCallbackArgs, CommonErrorArgs> {}

interface MapContextTranslateMarkerOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  markerId: number;
  destination: Coordinates;
  autoRotate?: boolean;
  rotate?: number;
  moveWithRotate?: boolean;
  duration?: number;
  animationEnd?: () => void;
}

interface MapContextMoveAlongOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  markerId: number;
  path: Coordinates[];
  autoRotate?: boolean;
  duration?: number;
  animationEnd?: () => void;
}

interface MapContextMapToScreenSuccessCallbackArgs {
  errMsg: string;
  x: number;
  y: number;
}

interface MapContextMapToScreenOptions extends Callbacks<MapContextMapToScreenSuccessCallbackArgs, CommonErrorArgs>, Coordinates {}

interface MapContextScreenToMapSuccessCallbackArgs {
  errMsg: string;
  longtitude: number;
  latitude: number;
}
interface MapContextScreenToMapOptions extends Callbacks<MapContextScreenToMapSuccessCallbackArgs, CommonErrorArgs> {
  x: number;
  y: number;
}

interface MapContext {
  getCenterLocation: (options: MapContextGetCenterLocationOptions) => void;
  getRegion: (options: MapContextGetRegionOptions) => void;
  getScale: (options: MapContextGetScaleOptions) => void;
  moveToLocation: (options: MapContextMoveToLocationOptions) => void;
  getRotate: (options: MapContextGetRotateOptions) => void;
  includePoints: (options: MapContextIncludePointsOptions) => void;
  getSkew: (options: MapContextGetSkewOptions) => void;
  translateMarker: (options: MapContextTranslateMarkerOptions) => void;
  moveAlong: (options: MapContextMoveAlongOptions) => void;
  mapToScreen: (options: MapContextMapToScreenOptions) => void;
  screenToMap: (options: MapContextScreenToMapOptions) => void;
}

interface SaveFileSuccessCallbackArgs {
  errMsg: string;
  savedFilePath: string;
}

interface SaveFileFailCallbackArgs extends CommonErrorArgs {
  errNo: number;
}

interface SaveFileOptions extends Callbacks<SaveFileSuccessCallbackArgs, SaveFileFailCallbackArgs> {
  tempFilePath: string;
  filePath?: string;
}

interface GetFileInfoSuccessCallbackArgs {
  size: number;
}

type GetFileInfoFailCallbackArgs = SaveFileFailCallbackArgs;
interface GetFileInfoOptions extends Callbacks<GetFileInfoSuccessCallbackArgs, GetFileInfoFailCallbackArgs> {
  filePath: string;
}

interface FileItem {
  filePath: string;
  size: number;
  createTime: number;
}

interface GetSavedFileListSuccessCallbackArgs {
  fileList: FileItem[]
}
interface GetSavedFileListOptions extends Callbacks<GetSavedFileListSuccessCallbackArgs, CommonErrorArgs> {}

interface OpenDocumentOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  filePath: string;
  fileType?: string;
  fileName?: string
}

type RemoveSavedFileFailCallbackArgs = SaveFileFailCallbackArgs;

interface RemoveSavedFileOptions extends Callbacks<CommonErrorArgs, RemoveSavedFileFailCallbackArgs> {
  filePath: string;
}

type FileSystemManagerAccessFailCallbackArgs =  SaveFileFailCallbackArgs;

interface FileSystemManagerSaveFileSuccessCallbackArgs {
  errMsg: string;
  savedFilePath: string;
}

type FileSystemManagerSaveFileFailCallbackArgs =  SaveFileFailCallbackArgs;

interface FileSystemManagerSaveFileOptions extends Callbacks<FileSystemManagerSaveFileSuccessCallbackArgs, FileSystemManagerSaveFileFailCallbackArgs> {
  tempFilePath: string;
  filePath?: string;
}

type FileSystemManagerCopyFileFailCallbackArgs =  SaveFileFailCallbackArgs;

type CommonExtendsErrorArgs = SaveFileFailCallbackArgs;

interface FileSystemManagerCopyFileOptions extends Callbacks<CommonErrorArgs, FileSystemManagerCopyFileFailCallbackArgs> {
  srcPath: string;
  destPath: string;
}

interface FileSystemManagerMakedirOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  dirPath: string;
}

interface FileSystemManagerSuccessCallbackArgs {
  errMsg: string;
  files: string[];
}
interface FileSystemManagerReaddirOptions extends Callbacks<FileSystemManagerSuccessCallbackArgs, CommonExtendsErrorArgs> {
  dirPath: string;
}

type Encoding = 'ascii' | 'base64' | 'binary' | 'hex' | 'ucs2' | 'ucs-2' | 'utf16le' | 'utf-16le' | 'utf-8' | 'utf8' | 'latin1';

interface FileSystemManagerReadFileSuccessCallbackArgs {
  data: string | ArrayBuffer;
}

interface FileSystemManagerReadFileOptions extends Callbacks<FileSystemManagerReadFileSuccessCallbackArgs, CommonExtendsErrorArgs> {
  filePath: string;
  encoding?: Encoding;
}

interface FileSystemManagerRenameOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>{
  oldPath: string;
  newPath: string;
}

interface FileSystemManagerRmdirOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  dirPath: string;
}

interface Stats {
  mode: string;
  size: number;
  lastAccessedTime: number;
  lastModifiedTime: number;
  isDirectory: () => boolean;
  isFile: () => boolean;
}

interface FileSystemManagerStatSuccessCallbackArgs {
  errMsg: string;
  stat: Stats;
}
interface FileSystemManagerStatOptions extends Callbacks<FileSystemManagerStatSuccessCallbackArgs, CommonExtendsErrorArgs> {
  path: string;
}

interface FileSystemManagerUnlinkOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  filePath: string;
}

interface FileSystemManagerUnzipOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  zipFilePath: string;
  targetPath: string;
}

interface FileSystemManagerWriteFileOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  filePath: string;
  data: string | ArrayBuffer;
  encoding?: Encoding
}
interface FileSystemManager {
  accessSync: (path: string) => void;
  access: (options: Callbacks<CommonErrorArgs, FileSystemManagerAccessFailCallbackArgs>) => void;
  saveFileSync: (tempFilePath: string, filePath?: string) => string;
  saveFile: (options: FileSystemManagerSaveFileOptions) => void;
  getSavedFileList: (options: GetSavedFileListOptions) => void;
  removeSavedFile: (options: RemoveSavedFileOptions) => void;
  copyFileSync: (srcPath: string, destPath: string) => void;
  copyFile: (options: FileSystemManagerCopyFileOptions) => void;
  getFileInfo: (options: GetFileInfoOptions) => void;
  mkdirSync: (dirPath: string) => void;
  mkdir: (options: FileSystemManagerMakedirOptions) => void;
  readdirSync: (dirPath: string) => string[];
  readdir: (options: FileSystemManagerReaddirOptions) => void;
  readFileSync: (filePath: string, encoding?: Encoding) => string | ArrayBuffer;
  readFile: (options: FileSystemManagerReadFileOptions) => void;
  renameSync: (oldPath: string, newPath: string) => void;
  rename: (options: FileSystemManagerRenameOptions) => void;
  rmdirSync: (dirPath: string) => void;
  rmdir: (options: FileSystemManagerRmdirOptions) => void;
  statSync: (path: string) => Stats;
  stat: (options: FileSystemManagerStatOptions) => void;
  unlinkSync: (filePath: string) => void;
  unlink: (options: FileSystemManagerUnlinkOptions) => void;
  unzip: (options: FileSystemManagerUnzipOptions) => void;
  writeFileSync: (filePath: string, data: string | ArrayBuffer, encoding?: Encoding) => void;
  writeFile: (options: FileSystemManagerWriteFileOptions) => void;
}

interface EnvInfo {
  microapp: {
    mpVersion: string;
    envType: 'production' | 'development' | 'preview'
    appId: string;
  },
  common: {
    USER_DATA_PATH: string;
  }
}

interface LoginSuccessCallbackArgs {
  errMsg: string;
  code: string;
  anonymousCode: string;
  isLogin: boolean;
}
interface LoginOptions extends Callbacks<LoginSuccessCallbackArgs, CommonErrorArgs> {
  force?: boolean;
}

interface CheckSessionOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {}

interface UserInfo {
  avatarUrl: string;
  nickName: string;
  gender: 0 | 1 | 2;
  city: string;
  provider: string;
  country: string;
  language: string;
}

interface GetUserInfoSuccessCallbackArgs {
  errMsg: string;
  rawData: string
  userInfo: UserInfo;
  signature?: string;
  encryptedData: string;
  iv: string;
}

interface GetUserInfoOptions extends Callbacks<GetUserInfoSuccessCallbackArgs, CommonErrorArgs> {
  withCredentials?: boolean;
}

interface GetUserInfoProfileOptions extends Callbacks<GetUserInfoSuccessCallbackArgs, CommonExtendsErrorArgs> {

}

interface CreateRewardedVideoAdOptions {
  adUnitId: string;
}

interface RewardedVideoAd {
  show: () => void;
  onLoad: (callback: (data: any) => void) => void;
  offLoad: (callback: (data: any) => void) => void;
  load: () => Promise<any>
  onError: (callback: (data: any) => void) => void;
  offError: (callback: (data: any) => void) => void;
  onClose: (callback: (data: any) => void) => void;
  offClose: (callback: (data: any) => void) => void;
}

interface InterstitialAd extends RewardedVideoAd {
  ddestroy: () => void;
}

interface PayOptions {
  orderInfo: {
    order_id: string;
    order_token: string;
  },
  service: number;
  _debug?: number
  success?: (args: { code: number }) => void;
  fail?: (args: { errMsg: string }) => void;
}

interface NavigateToMiniProgramOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  appId: string;
  path?: string;
  extraData?: object;
  envVersion?: string;
}
interface NavigateBackMiniProgramOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  envVersion?: string;
}

interface ChooseAddressesSuccessCallbackArgs {
  errMsg: string;
  userName: string;
  provinceName: string;
  cityName: string;
  countryName: string;
  detailInfo: string;
  telNumber: string;
}

interface ChooseAddressesOptions extends Callbacks<ChooseAddressesSuccessCallbackArgs, CommonErrorArgs> {}

interface GetSettingSuccessCallbackArgs {
  errMsg: string;
  authSetting: {
    'scope.userInfo'?: boolean;
    'scope.userLocation'?: boolean;
    'scope.address'?: boolean;
    'scope.record'?: boolean;
    'scope.album'?: boolean;
    'scope.camera'?: boolean;
  }
}
interface GetSettingOptions extends Callbacks<GetSettingSuccessCallbackArgs, CommonErrorArgs> {}
type OpenSettingsOptions = GetSettingOptions;

type Scope = 'scope.userInfo' | 'scope.userLocation' | 'scope.address' | 'scope.record' | 'scope.album' | 'scope.camera';

interface AuthorizeOptions extends Callbacks {
  scope: Scope
}

interface ShowDouyinOpenAuthSuccessCallbackArgs {
  errMsg: string;
  ticket: string;
  grantPermissions: string[];
}

interface ShowDouyinOpenAuthOptions extends Callbacks<ShowDouyinOpenAuthSuccessCallbackArgs, CommonExtendsErrorArgs> {
  scopes: object;
}


interface CanRateAwemeOrdersOptions extends Callbacks<{ result: string[]; errMsg: string; }, CommonExtendsErrorArgs> {
  orderIds: string[]
}

interface RateAwemeOrderOptions extends Callbacks<{ result: boolean; errMsg: string; }> {
  orderId: string
}

interface RequestSubscribeMessageSuccessCallbackArgs {
  errMsg: string;
  TEMPLATE_ID: 'accept' | 'reject' | 'ban' | 'fail'
}
interface RequestSubscribeMessageOptions extends Callbacks<RequestSubscribeMessageSuccessCallbackArgs, CommonExtendsErrorArgs> {
  tmplIds: string[];
}

interface OpenEcGoodOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  promotionId: string;
}

interface OpenEcOrderDetailOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  orderId: string;
  shopId: string;
}

interface OpenEcImOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  shopId: string;
  orderId?: string;
  promotionId?: string
}

interface OpenEcChatOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  shopId: string;
}
interface OpenWebcastRoomOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  streamerId?: string;
}
interface OpenDouyinProfileOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  userId: string;
  shopId: string;
}
interface OpenEcCouponOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  couponId: string;
  shopId: string;
}

interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

interface GetStorageOptions extends Callbacks<{ data: any }, any> {
  key: string;
}
interface SetStorageOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  key: string;
  data: any;
}
interface RemoveStorageOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  key: string;
}

interface StorageInfo {
  keys: string[];
  currentSize: number;
  limitSize: number;
}
interface GetStorageInfoOptions extends Callbacks<StorageInfo & CommonErrorArgs, CommonErrorArgs> {

}

interface GetLocationSuccessCallbackArgs {
  errMsg: string;
  latitude: number;
  longtitude: number;
  altitude: number;
  accuracy: number;
  verticalAccuracy: number;
  horizontalAccuracy: number;
  speed: number;
  city: string;
}
interface GetLocationOptions extends Callbacks<GetLocationSuccessCallbackArgs, CommonErrorArgs> {
  type?: 'wgs84' | 'gcj02'
}

interface ChooseLocationSuccessCallbackArgs {
  errMsg: string;
  name: string;
  address: string;
  latitude: number;
  longtitude: number;
}

interface ChooseLocationOptions extends Callbacks<ChooseLocationSuccessCallbackArgs, CommonErrorArgs> {
  latitude: number;
  longtitude: number;
}

interface OpenLocationOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  latitude: number
  longtitude: number;
  scale: number;
  name: string;
  address: string;
}

type NetworkType = 'wifi' | '2g' | '3g' | '4g' | 'unknown' | 'none'
type WifiInfo = {
  SSID: string;
  BSSID: string;
  secure: boolean;
  signalStrength: number;
}

interface SafeArea {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}
interface SystemInfo {
  system: string;
  platform: string;
  brand: string;
  model: string;
  version: string;
  appName: string;
  SDKVersion: string;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  pixelRatio: number;
  statusBarHeight: number;
  safeArea: SafeArea;
}

interface GetSystemInfoOptions extends Callbacks<SystemInfo, CommonErrorArgs> {

}
interface MakePhoneCallOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  phoneNumber: string;
}
interface SetClipboardDataOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  data: string;
}

interface CanvasContext {
  beginPath(): void;
  clip(): void;
  draw(reserve?: boolean, callback?: () => void): void;
  lineTo(x: number, y: number): void;
  setFontSize(fontSize: number): void;
  setFillStyle(color: string): void;
  createLinearGradient(sx: number, sy: number, dx: number, dy: number): CanvasGradient;
  setStrokeStyle(color: string): void;
  setGlobalAlpha(alpha: number): void;
  transform(scaleX: number, skewX: number, skewY: number, scaleY: number, translateX: number, translateY: number): void;
  fill(): void;
  stroke(): void;
  setLineDash(pattern: number[], offset: number): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  strokeRect(x: number, y: number, width: number, height: number): void;
  drawImage(imageResource: string, sx: number, sy: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void;
  measureText(text: string): { width: number };
  scale(scaleWidth: number, scaleHeight: number): void;
  rotate(rotate: number): void;
  translate(x: number, y: number): void;
  save(): void;
  restore(): void;
  clearRect(x: number, y: number, width: number, height: number): void;
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
  setTextAlign(align: 'left' | 'center' | 'right'): void;
  setLineCap(lineCap: 'butt' | 'round' | 'square'): void;
  setLineJoin(lineJoin: 'bevel' | 'round' | 'miter'): void;
  setLineWidth(lineWidth: number): void;
  setMiterLimit(miterLimit: number): void;
  setTextBaseline(textBaseline: 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom'): void;
  setTransform(scaleX: number, skewX: number, skewY: number, scaleY: number, translateX: number, translateY: number): void;
  moveTo(x: number, y: number): void;
  rect(x: number, y: number, width: number, height: number): void;
  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, anticlockwise: string): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  closePath(): void;
}

interface OffscreenCanvas {
  getContext(type: '2d' | 'webgl'): CanvasRenderingContext2D | WebGLRenderingContext;
}

interface ShowToastOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  title: string;
  icon?: 'success' | 'loading' | 'none' | 'fail';
  duration?: number;
}

interface ShowModalOptions extends Callbacks<{ confirm: boolean; cancel: boolean; } & CommonErrorArgs, CommonErrorArgs> {
  title?: string;
  content?: string;
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
}

interface ShowFavoriteGuideOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> { type?: string; content?: string; position?: string }

interface Animation {
  opacity: number;
  backgroundColor: string;
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface CreateAnimationOptions {
  duration?: number;
  timingFunction?: string;
  delay?: number;
  transformOrigin?: string;
}

interface SetTabBarStyleOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  color?: string;
  selectedColor?: string;
  backgroundColor?: string;
  borderStyle?: 'black' | 'white';
}

interface SetTabBarItemOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  index: number;
  text?: string;
  iconPath?: string;
  selectedIconPath?: string;
}

interface AlgorithmManager {
  doExecute(options: {
    input: ArrayBuffer;
    width: number;
    height: number;
    timeStamp: number;
    success?: (data: any) => void;
    fail?: (args: { errMsg: string }) => void
  }): void;
}
interface GetAlgorithmManagerOptions extends Callbacks<{ algorithmManager: AlgorithmManager } & CommonErrorArgs, CommonErrorArgs> {
  width: number;
  height: number;
  useSyncMode: boolean;
  requirements: ['skeleton'] | ['face106'] | ['nail'] | ['foot'] | ['trackingAr'];
}

interface StickerProcessor {
  paintToTexture(inputTexture: any, outputTexture: any): void;
}
interface StickerManager {
  onLoad: (callback: (processor: StickerProcessor) => void) => void;
  onError: (callback: (res: { errMsg: string }) => void) => void;
  load(): void;
}

interface DataConfig {
  data: ArrayBuffer;
  width: number;
  height: number;
  channel: number;
  batch: number;
  dataType: 'U8' | 'I8' | 'U16' | 'I16' | 'F16' | 'F32' | 'F64';
  dataFormat: 'NCHW' | 'NHWC';
}

interface InputConfig {
  inputChannel: number;
  weight: number;
}
interface SingleChannelConvertConfig {
  outputChannel: number;
  normalizeFactor: number;
  offset: number;
  inputConfig: InputConfig[];
}
interface BytennEngineInferSyncOptions extends Callbacks {
  dataConfig: DataConfig;
  converConfig: SingleChannelConvertConfig[];
}

interface BytennEngine {
  inferSync(options: BytennEngineInferSyncOptions): any;
}

interface BytennEngineContext {
  load(): void;
  onError(callback: () => void): void;
  onLoad(callback: (engine: BytennEngine) => void): void;
}

interface EngineConfig {
  numThread: number;
  backend: 'auto' | 'cup' | 'gpu';
}

interface NodesRefBoundingClientRectCallbackArgs {
  id: string;
  dataset: object;
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

interface NodesRefScrollOffsetCallbackArgs {
  id: string;
  dataset: object;
  scrollLeft: number;
  scrollTop: number;
}
interface NodesRefFieldsCallbackArgs extends NodesRefBoundingClientRectCallbackArgs {
  scrollLeft: number;
  scrollTop: number;
}

interface NodesRefFields {
  id?: boolean;
  dataset?: boolean;
  rect?: boolean;
  size?: boolean;
  scrollOffset?: boolean;
  node?: boolean;
}

interface NodesRef {
  boundingClientRect(callback: (res: NodesRefBoundingClientRectCallbackArgs) => void): SelectorQuery;
  scrollOffset(callback: (res: NodesRefScrollOffsetCallbackArgs) => void): SelectorQuery;
  fields(fields: NodesRefFields, callback?: (res: NodesRefFieldsCallbackArgs) => void): SelectorQuery;
  node(callback: (res: { node: object }) => void): SelectorQuery;
}

interface SelectorQuery {
  in(component: any): SelectorQuery;
  select(selector: string): NodesRef;
  selectAll(selector: string): NodesRef;
  selectViewport(): NodesRef;
  exec(callback: (arr: any[]) => void): NodesRef;
}

interface CreateIntersectionObserverOptions {
  thresholds?: number[];
  initialRatio?: number;
  observeAll?: boolean;
}

interface IntersectionObserverMargins {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

interface IntersectionObserverCallbackArgs {
  id:	string;
  dataset:	object;
  intersectionRatio:	number;
  intersectionRect:	IntersectionRect;
  boundingClientRect:	IntersectionRect;
  relativeRect:	RelativeRect;
  time:	number;
}

interface IntersectionRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

interface RelativeRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
interface IntersectionObserver {
  relativeTo(selector: string, margins?: IntersectionObserverMargins): IntersectionObserver;
  relativeToViewport(margins?: IntersectionObserverMargins): IntersectionObserver;
  observer(targetSelector: string, callback: (res: IntersectionObserverCallbackArgs) => void): void;
  disconnect(): void;
}

interface LiveReportContextOrderConfirmPageShowOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  productId: string;
  productName: string;
  shopId: string;
  shopName: string;
  amount: number;
  orderNum: string;
  customer: string;
  phoneNumber: string;
  remark: string;
}

interface LiveReportContextProductDetailsShowOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  productId: string;
  productName: string;
  shopId: string;
  shopName: string;
}

interface LiveUserInfo {
  openUID: string;
  secNickname: string;
  secAvatarURL: string;
  role: string;
}

interface GetLiveUserInfoOptions extends Callbacks<{ userInfo: LiveUserInfo } & CommonErrorArgs, CommonExtendsErrorArgs> {}
interface LiveReportContext {
  orderConfirmPageShow(options: LiveReportContextOrderConfirmPageShowOptions): void;
  orderSubmit(options: LiveReportContextOrderConfirmPageShowOptions): void;
  productDetailsShow(options: LiveReportContextProductDetailsShowOptions): void;
  productSelect(options: LiveReportContextProductDetailsShowOptions): void;
  productShareClick(options: LiveReportContextProductDetailsShowOptions): void;
  shelfShow(options: { showFrom: number } & LiveReportContextProductDetailsShowOptions): void;
}

interface FollowInfo {
  openUID: string;
  secNickname: string;
  secAvatarURL: string;
  action: number;
  timestamp: number;
}
interface onReceiveAudiencesFollowActionCallbackArgs {
  followInfoList: FollowInfo[];
}

interface Comment {
  openUID: string;
  secNickname: string;
  secAvatarURL: string;
  content: string;
  timestamp: number;
}

interface OnReceiveSpecifiedCommentOptions {
  commnetList: Comment[];
}

abstract class Api {
  // 基础
  abstract canIUse(schema: string): boolean
  abstract base64ToArrayBuffer(str: string): ArrayBuffer
  abstract arrayBufferToBase64(obj: ArrayBuffer): string
  // 生命周期
  abstract getEnterOptionsSync(): EnterOrLaunchOptions
  abstract getLaunchOptionsSync(): EnterOrLaunchOptions
  abstract exitMiniProgram(callbacks: Callbacks): void
  abstract canIPutStuffOverComponent(componentName: string): boolean
  // 更新
  abstract getUpdateManager(): UpdateManager;
  // 应用级事件
  abstract onAppShow(callback: (param: EnterOrLaunchOptions) => void): void;
  abstract offAppShow(callback: () => void): void;
  abstract onAppHide(callback: () => void): void;
  abstract offAppHide(callback: () => void): void;
  abstract onError(callback: (err: string) => void): void;
  abstract offError(callback: (err: string) => void): void;
  // 环境变量
  abstract env: {
    VERSION: string;
    USER_DATA_PATH: string
  }
  // 网络
  abstract downloadFile(options: DownloadFileOptions): DownloadTask;
  abstract request(options: RequestOptions): RequestTask;
  abstract uploadFile(options: UploadFileOptions): UploadTask;
  abstract connectSocket(options: ConnectSocketOptions): SocketTask;
  // 媒体
  // 图片
  abstract chooseImage(options: ChooseImageOptions): void;
  abstract saveImageToPhotosAlbum(options: SaveImageOptions): void;
  abstract previewImage(options: PreviewImageOptions): void;
  abstract getImageInfo(options: GetImageInfoOptions): void;
  abstract compressImage(options: CompressImageOptions): void;
  // 录音
  abstract getRecorderManager(): RecorderManager;
  // 音频
  abstract getBackgroundAudioManager(): BackgroundAudioManager;
  abstract createInnerAudioContext(): InnerAudioContext;
  // 视频
  abstract chooseVideo(options: ChooseVideoOptions): void;
  abstract saveVideoToPhotoAlbum(options: SaveVideoOptions): void;
  abstract createVideoContext(id: string, component?: any): VideoContext;
  abstract craeteLivePlayerContext(id: string, component?: any): LivePlayerContext;
  abstract preloadVideo(options: PreloadVideoOptions): PreloadVideoTask;
  // 相机
  abstract createCameraContext(): CameraContext;
  // 特效相机
  abstract createEffectCameraStream(page: any): EffectCameraStream;
  //  地图
  abstract createMapContext(mapId: string, component?: any): MapContext;
  // 文件
  abstract saveFile(options: SaveFileOptions): void;
  abstract getFileInfo(options: GetFileInfoOptions): void;
  abstract getSavedFileList(options: GetSavedFileListOptions): void;
  abstract openDocument(options: OpenDocumentOptions): void;
  abstract removeSavedFile(options: RemoveSavedFileOptions): void;
  abstract getFileSystemManager(): FileSystemManager;
  // 开放接口
  // 环境信息
  abstract getEnvInfoSync(): EnvInfo;
  // 登录
  abstract login(options: LoginOptions): void;
  abstract checkSession(options: CheckSessionOptions): void;
  // 用户信息
  abstract getUserInfo(options: GetUserInfoOptions): void;
  abstract getUserInfoProfile(options: GetUserInfoProfileOptions): void;
  // 广告
  abstract createRewardedVideoAd(options: CreateRewardedVideoAdOptions): RewardedVideoAd;
  abstract createInterstitialAd(options: CreateRewardedVideoAdOptions): InterstitialAd;
  // 支付
  abstract pay(options: PayOptions): void;
  // 小程序跳转
  abstract navigateToMiniProgram(options: NavigateToMiniProgramOptions): void;
  abstract navigateBackMiniProgram(options: NavigateBackMiniProgramOptions): void;
  // 收获地址
  abstract chooseAddresses(options: ChooseAddressesOptions): void;
  // 设置
  abstract getSetting(options: GetSettingOptions): void;
  abstract openSettings(options: OpenSettingsOptions): void;
  // 授权
  abstract authorize(options: AuthorizeOptions): void;
  abstract showDouyinOpenAuth(options: ShowDouyinOpenAuthOptions): void;
  // 数据分析
  abstract reportAnalytics(eventName: string, data: { key: string; value: string | number | boolean }): void;
  // 评价能力
  abstract canRateAwemeOrders(options: CanRateAwemeOrdersOptions): void;
  abstract rateAwemeOrder(options: RateAwemeOrderOptions): void;
  // 引导关注             
  abstract followOfficialAccount(options: Callbacks<CommonExtendsErrorArgs, CommonErrorArgs>): void;
  abstract checkFollowState(options: Callbacks<{ errMsg: string; result: boolean }, CommonErrorArgs>): void;
  abstract openAwemeUserProfile(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract followAwemeUser(options: Callbacks<{ errMsg: string; followed: boolean }, CommonErrorArgs>): void;
  // 订阅消息
  abstract requestSubscribeMessage(options: RequestSubscribeMessageOptions): void;
  // 电商融合方案
  abstract openDouyinOrderList(options: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract openEcGood(options: OpenEcGoodOptions): void;
  abstract openEcOrderDetail(options: OpenEcOrderDetailOptions): void;
  abstract openEcIm(options: OpenEcImOptions): void;
  abstract openEcChat(options: OpenEcChatOptions): void;
  abstract openWebcastRoom(options: OpenWebcastRoomOptions): void;
  abstract openDouyinProfile(options: OpenDouyinProfileOptions): void;
  abstract openEcCoupon(options: OpenEcCouponOptions): void;
  // 性能
  abstract performance: {
    getEntries(): PerformanceEntry[]
    getEntriesByName(name: string, entryType?: string): PerformanceEntry[]
    getEntriesByType(entryType: string): PerformanceEntry[]
    getCurrentPageEntries(): PerformanceEntry[]
    getEntriesByPage(pagePath: string): PerformanceEntry[]
    mark(name: string): PerformanceEntry | undefined
    clearnMarks(name: string): void
  }
  // 数据缓存
  abstract getStorage(options: GetStorageOptions): void;
  abstract getStorageSync(key: string): any;
  abstract setStorage(options: SetStorageOptions): void;
  abstract setStorageSync(key: string, data: any): void;
  abstract removeStorage(options: RemoveStorageOptions): void;
  abstract removeStorageSync(key: string): void;
  abstract clearStorage(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract clearStorageSync(): void;
  abstract getStorageInfo(options: GetStorageInfoOptions): void;
  abstract getStorageInfoSync(): StorageInfo;
  // 地理位置
  abstract getLocation(options: GetLocationOptions): void;
  abstract chooseLocation(options: ChooseLocationOptions): void;
  abstract openLocation(options: OpenLocationOptions): void;
  // 设备
  // 网络状态
  abstract getNetworkType(options: Callbacks<{ networkType: NetworkType }, CommonErrorArgs>): void;
  abstract onNetworkStatusChange(callback: (args: { networkType: NetworkType, isConnected: boolean }) => void): void;
  abstract getWifiList(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract onGetWifiList(callback: (args: { wifiList: WifiInfo[] }) => void): void;
  abstract offGetWifiList(callback: () => void): void;
  // 系统信息
  abstract getSystemInfo(options: GetSystemInfoOptions): void;
  abstract getSystemInfoSync(): SystemInfo;
  // WIFI
  abstract getConnectedWifi(options: Callbacks<WifiInfo, CommonErrorArgs>): void;
  // 加速度计
  abstract startAccelerometer(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract stopAccelerometer(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract onAccelerometerChange(callback: (args: { x: number; y: number; z: number; }) => void): void;
  // 罗盘
  abstract startCompass(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract stopCompass(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract onCompassChange(options: Callbacks<{ duration: number }, CommonErrorArgs>): void;
  // 拨打电话
  abstract makePhoneCall(options: MakePhoneCallOptions): void;
  // 扫码
  abstract scanCode(options: Callbacks<{ result: string }, CommonErrorArgs>): void;
  // 剪切板
  abstract getClipboardData(options: Callbacks<{ data: string } & CommonErrorArgs, CommonErrorArgs>): void;
  abstract setClipboardData(options: SetClipboardDataOptions): void;
  // 屏幕
  abstract setKeepScreenOn(options: { keepScreenOn: boolean } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract onUserCaptureScreen(callback: () => void): void;
  abstract offUserCaptureScreen(callback: () => void): void;
  abstract getScreenBrightness(options: Callbacks<{ value: string } & CommonErrorArgs, CommonErrorArgs>): void;
  abstract setScreenBrightness(options: { value: number } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract disableUserScreenRecord(options: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract enableUserScreenRecord(options: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract onUserScreenRecord(callback: (args: { state: 'start' | 'end' }) => void): void;
  abstract offUserScreenRecord(callback: () => void): void;
  // 震动
  abstract vibrateShort(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract vibrateLong(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 性能
  abstract onMemoryWarning(callback: (args: { level: 5 | 10 | 15 }) => void): void;
  // 画布
  abstract createCanvasContext(canvasId: string): CanvasContext;
  abstract createOffscreenCanvas(): OffscreenCanvas;
  // 界面
  // 交互反馈
  abstract showToast(options: ShowToastOptions): void;
  abstract hideToast(options:  Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract showLoading(options: { title: string } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideLoading(options:  Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract showModal(options: ShowModalOptions): void;
  abstract showActionSheet(options: { itemList: string[] } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract showFavoriteGuide(options: ShowFavoriteGuideOptions): void;
  abstract showInteractionBar(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideInteractionBar(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 导航栏
  abstract showNavigationBarLoading(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideNavigationBarLoading(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideHomeButton(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract setNavigationBarTitle(options: { title: string } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract setNavigationBarColor(options: { frontColor: string; backgroundColor: string } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 菜单
  abstract getMenuButtonBoundingClientRect(): { errMsg: string; width: number; height: number; top: number; right: number; bottom: number; left: number };
  // 动画
  abstract createAnimation(options: CreateAnimationOptions): Animation;
  // 页面位置
  abstract pageScrollTo(options: { scrollTop: number; duration?: number } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 滑动返回
  abstract setSwipeBackMode(mode: 0 | 1 | 2): void;
  // 下拉刷新
  abstract startPullDownRefresh(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // TabBar
  abstract showTabBarRedDot(options: { index: number } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract showTabBar(options: { animation?: boolean } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract setTabBarStyle(options: SetTabBarStyleOptions): void;
  abstract setTabBarItem(options: SetTabBarItemOptions): void;
  abstract setTabBarBadge(options: { index: number; text: string } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract removeTabBarBadge(options: { index: number } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideTabBarRedDot(options: { index: number } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideTabBar(options: { animation?: boolean } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // AI/AR
  // TODO
  abstract getAlgorithmManager(options: GetAlgorithmManagerOptions): void;
  // 特效贴纸方案
  abstract createStickerManager(stickerId: string): StickerManager;
  // 原生神经网络
  abstract createBytennEngineContext(modelName: string, engineConfig?: EngineConfig): BytennEngineContext;
  // 导航
  abstract navigateTo(options: { url: string } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract redirectTo(options: { url: string } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract switchTab(options: { url: string } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract navigateBack(options: { delta?: number } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract reLaunch(options: { url: string } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 转发
  abstract showShareMenu(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideShareMenu(options: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract navigateToVideoView(options: { videoId?: string; encryptedId?: string } & Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  // 第三方平台
  abstract getExtConfig(options: Callbacks<{ extConfig: object }>): void;
  abstract getExtConfigSync(): object;
  // TTML
  abstract createSelectorQuery(): SelectorQuery;
  abstract createIntersectionObserver(instance: any, options?: CreateIntersectionObserverOptions): IntersectionObserver;
  // 直播能力
  abstract createLiveReportContext(): LiveReportContext;
  abstract getRoomInfo(options: Callbacks<{ roomInfo: { roomId: string; liveDuraction: number } } & CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract getLiveUserInfo(options: GetLiveUserInfoOptions): void;
  abstract getSelfCommentCountDuringPluginRunning(options: Callbacks<{ commentCount: number } & CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract isFollowingAnchor(options: Callbacks<{ isFollowing: boolean } & CommonErrorArgs, CommonExtendsErrorArgs>): void;
  // 直播间关注互动数据
  abstract onReceiveAudiencesFollowAction(callback: (res: onReceiveAudiencesFollowActionCallbackArgs) => void): void;
  abstract subscribeAudiencesFollowAction(options: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract unsubscribeAudiencesFollowAction(options: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  // 直播间评论互动数据
  abstract subscribeSpecifiedContentComment(options: { keyWordList: string [] } & Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract subscribeSpecifiedUserComment(options: { openUIDList: string [] } & Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract unsubscribeAllSpecifiedContentComment(options: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract unsubscribeAllSpecifiedUserComment(options: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract onReceiveSpecifiedComment(callback: (res: OnReceiveSpecifiedCommentOptions) => void): void;
  // 自定义
  abstract open(url: string): void;
}

export default Api