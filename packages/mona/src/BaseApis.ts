export interface EnterOrLaunchOptions {
  path: string;
  scene: string;
  query: object;
  referrerInfo: { appId: string; extraData: object; };
  showFrom: number;
}

export interface UpdateManager {
  onCheckForUpdate: (callback: (param: { hasUpdate: boolean; }) => void) => void;
  onUpdateReady: (callback: () => void) => void;
  onUpdateFailed: (callback: (err: string) => void) => void;
  applyUpdate: (calllback: () => void) => void;
}

export interface Callbacks<SuccessArg = any, FailArg = any> {
  success?: (arg: SuccessArg) => void;
  fail?: (arg: FailArg) => void;
  complete?: (arg: SuccessArg | FailArg) => void;
}

export interface CommonErrorArgs {
  errMsg: string;
}

export interface DownloadFileCallbackSuccessArgs {
  tempFilePath: string;
  statusCode: number;
}

export interface DownloadFileOptions extends Callbacks<DownloadFileCallbackSuccessArgs, CommonErrorArgs> {
  url: string;
  header?: object;
}

export interface ReqeustResponseProfile {
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

export interface RequestSuccesssCallbackArgs {
  statusCode: number;
  header: object;
  data: object | string | ArrayBuffer;
  profile: ReqeustResponseProfile;
}

export interface RequestFailCallbackArgs extends CommonErrorArgs {
  errNo: string;
  profile?: ReqeustResponseProfile;
}

export interface RequestOptions extends Callbacks<RequestSuccesssCallbackArgs, RequestFailCallbackArgs> {
  url: string;
  header?: object;
  method?: 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'DELETE' | 'PUT' | 'TRACE' | 'CONNECT';
  data?: object | string | ArrayBuffer;
  dataType?: 'json' | 'string';
  timeout?: number;
  enableCache?: boolean;
  responseType?: 'text' | 'arraybuffer';
}

export interface UploadFileSuccesssCallbackArgs {
  data: string;
  statusCode: number;
}
export interface UploadFileOptions extends Callbacks<UploadFileSuccesssCallbackArgs, CommonErrorArgs> {
  url: string;
  filePath: string;
  name: string;
  header?: object;
  formData?: object;
}

export interface ConnectSocketSuccessCallbackArgs {
  errMsg: string;
  socketTaskId: number;
}
export interface ConnectSocketOptions extends Callbacks<ConnectSocketSuccessCallbackArgs, CommonErrorArgs> {
  url: string;
  header?: object;
  protocols: string[];
}

export interface DownloadTask {
  abort: () => void;
  onProgress: (callback: { progress: number; totalBytesWritten: number; totalBytesExpectedToWrite: number; }) => void;
}

export interface RequestTask {
  abort: () => void;
}

type UploadTask = DownloadTask;

enum SocketTaskReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}

export interface SocketTaskSendOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  data: string | ArrayBuffer;
}

export interface SocketTaskCloseOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  code?: 1000 | 1001;
  reason?: string;
}
export interface SocketTask {
  readyState?: SocketTaskReadyState;
  send: (options: SocketTaskSendOptions) => void;
  close: (options: SocketTaskCloseOptions) => void;
  onOpen: (callback: (params: {
    header: object;
    protocolType: string;
    socketType: 'ttnet' | 'tradition';
  }) => void) => void;
  onClose: (callback: (params: {
    protocolType: string;
    socketType: 'ttnet' | 'tradition',
    errMsg: string;
    reason: string;
    code: string;
  }) => void) => void;
  onMessage: (callback: (params: {
    data: string | ArrayBuffer;
    protocolType: string;
    socketType: 'ttnet' | 'tradition',
  }) => void) => void;
  onError: (callback: (params: {
    errMsg: string;
  }) => void) => void;
}

export interface ChooseImageSuccessCallbackArgs {
  tempFilePaths: string[];
  tempFiles: { path: string; size: number; }[];
}
export interface ChooseImageOptions extends Callbacks<ChooseImageSuccessCallbackArgs, CommonErrorArgs> {
  count?: number;
  sourceType?: ('album' | 'camera')[];
}

export interface SaveImageOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  filePath: string;
}

export interface PreviewImageOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  urls: string[];
  current?: string;
}

export interface GetImageInfoSuccessCallbackArgs {
  errMsg: string;
  width: number;
  height: number;
  type: string;
  path: string;
  orientation: 'up' | 'up-mirrored' | 'down' | 'down-mirrored' | 'left' | 'left-mirrored' | 'right' | 'right-mirrored';
}

export interface GetImageInfoOptions extends Callbacks<GetImageInfoSuccessCallbackArgs, CommonErrorArgs> {
  src: string;
}

export interface CompressImageSuccessCallbackArgs {
  errMsg: string;
  tempFilePath: string;
}

export interface CompressImageOptions extends Callbacks<CompressImageSuccessCallbackArgs, CommonErrorArgs> {
  src: string;
  quality?: number;
}

export interface RecorderManagerStartOptions {
  duration?: number;
  sampleRate?: number;
  numberOfChannels?: number;
  encodeBitRate?: number;
  frameSize?: number;
  format?: string;
}
export interface RecorderManager {
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
  onFrameRecorded: (callback: (data: { isLastFrame: boolean; frameBuffer: Buffer; }) => void) => void;
}

export interface BackgroundAudioManager {
  src?: string;
  startTime?: number;
  title?: string;
  epname?: string;
  singer?: string;
  coverImgUrl?: string;
  webUrl?: string;
  protocol?: string;
  audioPage?: { path: string; query: { name: string; }; };
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
  onError: (callback: (data: { errMsg: string; errCode: number; }) => void) => void;
  onWaiting: (callback: (data: any) => void) => void;
  onSeek: (callback: (data: any) => void) => void;
  onNext: (callback: (data: any) => void) => void;
  onSeeking: (callback: (data: any) => void) => void;
  onPrev: (callback: (data: any) => void) => void;
  offTimeUpdate: (callback: (data: any) => void) => void;
}

export interface InnerAudioContext {
  src: string;
  startTime?: number;
  autoplay?: boolean;
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
  onError: (callback: (data: { errMsg: string; errCode: number; }) => void) => void;
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

export interface ChooseVideoSuccessCallbackArgs {
  errMsg: string;
  tempFilePath: string;
  duration: number;
  size: number;
  width: number;
  height: number;
}
export interface ChooseVideoOptions extends Callbacks<ChooseVideoSuccessCallbackArgs, CommonErrorArgs> {
  sourceType?: ('album' | 'camera')[];
  compressed?: boolean;
  camera?: 'back' | 'front';
  maxDuration?: number;
}

export interface SaveVideoOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  filePath: string;
}

export interface VideoContext {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  requestFullScreen: () => void;
  exitFullScreen: () => void;
}

export interface LivePlayerContext {
  play: () => void;
  stop: () => void;
  mute: () => void;
  unmute: () => void;
  requestFullScreen: (options: { direction: 0 | 90 | -90; }) => void;
  exitFullScreen: () => void;
}

export interface PreloadVideoOptions {
  src: string;
  size?: number;
}

export interface PreloadVideoTask {
  abort: () => void;
}

export interface CameraFrameListener {
  start: (options: Callbacks) => void;
  stop: (options: Callbacks) => void;
}

export interface CameraContextOnCameraFrameCallbackArgs {
  width: number;
  height: number;
  data: ArrayBuffer;
  timestamp: number;
}

export interface CameraContextSetZoomSuccessCallbackArgs {
  width: number;
  errMsg: string;
  height: number;
  data: ArrayBuffer;
}

export interface CameraContextSetZoomFailCallbackArgs extends CommonErrorArgs {
  errCode: number;
}
export interface CameraContextSetZoomOptions extends Callbacks<CameraContextSetZoomSuccessCallbackArgs, CameraContextSetZoomFailCallbackArgs> {
  zoom: number;
}
export interface CameraContext {
  onCameraFrame: (callback: (args: CameraContextOnCameraFrameCallbackArgs) => void) => CameraFrameListener;
  setZoom: (options: CameraContextSetZoomOptions) => void;
}

export interface EffectCameraPaintToFailCallbackArgs extends CommonErrorArgs {
  errNo: number;
}
export interface EffectCameraPaintToOptions extends Callbacks<CommonErrorArgs, EffectCameraPaintToFailCallbackArgs> {
  canvas: any;
  dx?: number;
  dy?: number;
  sx?: number;
  sy?: number;
}

export interface EffectCameraVideo {
  width: number;
  height: number;
}

export interface EffectCameraStream {
  request: (options: { orientation: 'back' | 'front'; }) => void;
  play: () => void;
  stop: () => void;
  paintTo: (options: EffectCameraPaintToOptions) => void;
  onRequest: (callback: (data: any) => void) => void;
  offRequest: (callback: (data: any) => void) => void;
  onPlay: (callback: (data: any) => void) => EffectCameraVideo;
  offPlay: (callback: (data: any) => void) => void;
  onStop: (callback: (data: any) => void) => void;
  offStop: (callback: (data: any) => void) => void;
  onError: (callback: (data: { type: string; errMsg: string; }) => void) => void;
  offError: (callback: (data: any) => void) => void;
  dispose: () => void;
}

export interface Coordinates {
  longtitude: number;
  latitude: number;
}


export interface MapContextGetCenterLocationOptions extends Callbacks<Coordinates, CommonErrorArgs> { }

export interface MapContextGetRegionSuccessCallbackArgs {
  southwest: Coordinates;
  northeast: Coordinates;
}

export interface MapContextGetRegionOptions extends Callbacks<MapContextGetRegionSuccessCallbackArgs, CommonErrorArgs> { }

export interface MapContextGetScaleSuccessCallbackArgs {
  scale: number;
}
export interface MapContextGetScaleOptions extends Callbacks<MapContextGetScaleSuccessCallbackArgs, CommonErrorArgs> { }

export interface MapContextMoveToLocationOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs>, Coordinates { }

export interface MapContextGetRotateSuccessCallbackArgs {
  errMsg: string;
  rotate: number;
}
export interface MapContextGetRotateOptions extends Callbacks<MapContextGetRotateSuccessCallbackArgs, CommonErrorArgs> { }
export interface MapContextIncludePointsOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  points: Coordinates[];
  padding?: [number, number, number, number];
}

export interface MapContextGetSkewSuccessCallbackArgs {
  errMsg: string;
  skew: number;
}
export interface MapContextGetSkewOptions extends Callbacks<MapContextGetSkewSuccessCallbackArgs, CommonErrorArgs> { }

export interface MapContextTranslateMarkerOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  markerId: number;
  destination: Coordinates;
  autoRotate?: boolean;
  rotate?: number;
  moveWithRotate?: boolean;
  duration?: number;
  animationEnd?: () => void;
}

export interface MapContextMoveAlongOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  markerId: number;
  path: Coordinates[];
  autoRotate?: boolean;
  duration?: number;
  animationEnd?: () => void;
}

export interface MapContextMapToScreenSuccessCallbackArgs {
  errMsg: string;
  x: number;
  y: number;
}

export interface MapContextMapToScreenOptions extends Callbacks<MapContextMapToScreenSuccessCallbackArgs, CommonErrorArgs>, Coordinates { }

export interface MapContextScreenToMapSuccessCallbackArgs {
  errMsg: string;
  longtitude: number;
  latitude: number;
}
export interface MapContextScreenToMapOptions extends Callbacks<MapContextScreenToMapSuccessCallbackArgs, CommonErrorArgs> {
  x: number;
  y: number;
}

export interface MapContext {
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

export interface SaveFileSuccessCallbackArgs {
  errMsg: string;
  savedFilePath: string;
}

export interface SaveFileFailCallbackArgs extends CommonErrorArgs {
  errNo: number;
}

export interface SaveFileOptions extends Callbacks<SaveFileSuccessCallbackArgs, SaveFileFailCallbackArgs> {
  tempFilePath: string;
  filePath?: string;
}

export interface GetFileInfoSuccessCallbackArgs {
  size: number;
}

type GetFileInfoFailCallbackArgs = SaveFileFailCallbackArgs;
export interface GetFileInfoOptions extends Callbacks<GetFileInfoSuccessCallbackArgs, GetFileInfoFailCallbackArgs> {
  filePath: string;
}

export interface FileItem {
  filePath: string;
  size: number;
  createTime: number;
}

export interface GetSavedFileListSuccessCallbackArgs {
  fileList: FileItem[];
}
export interface GetSavedFileListOptions extends Callbacks<GetSavedFileListSuccessCallbackArgs, CommonErrorArgs> { }

export interface OpenDocumentOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  filePath: string;
  fileType?: string;
  fileName?: string;
}

type RemoveSavedFileFailCallbackArgs = SaveFileFailCallbackArgs;

export interface RemoveSavedFileOptions extends Callbacks<CommonErrorArgs, RemoveSavedFileFailCallbackArgs> {
  filePath: string;
}

type FileSystemManagerAccessFailCallbackArgs = SaveFileFailCallbackArgs;

export interface FileSystemManagerSaveFileSuccessCallbackArgs {
  errMsg: string;
  savedFilePath: string;
}

type FileSystemManagerSaveFileFailCallbackArgs = SaveFileFailCallbackArgs;

export interface FileSystemManagerSaveFileOptions extends Callbacks<FileSystemManagerSaveFileSuccessCallbackArgs, FileSystemManagerSaveFileFailCallbackArgs> {
  tempFilePath: string;
  filePath?: string;
}

type FileSystemManagerCopyFileFailCallbackArgs = SaveFileFailCallbackArgs;

type CommonExtendsErrorArgs = SaveFileFailCallbackArgs;

export interface FileSystemManagerCopyFileOptions extends Callbacks<CommonErrorArgs, FileSystemManagerCopyFileFailCallbackArgs> {
  srcPath: string;
  destPath: string;
}

export interface FileSystemManagerMakedirOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  dirPath: string;
}

export interface FileSystemManagerSuccessCallbackArgs {
  errMsg: string;
  files: string[];
}
export interface FileSystemManagerReaddirOptions extends Callbacks<FileSystemManagerSuccessCallbackArgs, CommonExtendsErrorArgs> {
  dirPath: string;
}

type Encoding = 'ascii' | 'base64' | 'binary' | 'hex' | 'ucs2' | 'ucs-2' | 'utf16le' | 'utf-16le' | 'utf-8' | 'utf8' | 'latin1';

export interface FileSystemManagerReadFileSuccessCallbackArgs {
  data: string | ArrayBuffer;
}

export interface FileSystemManagerReadFileOptions extends Callbacks<FileSystemManagerReadFileSuccessCallbackArgs, CommonExtendsErrorArgs> {
  filePath: string;
  encoding?: Encoding;
}

export interface FileSystemManagerRenameOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  oldPath: string;
  newPath: string;
}

export interface FileSystemManagerRmdirOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  dirPath: string;
}

export interface Stats {
  mode: string;
  size: number;
  lastAccessedTime: number;
  lastModifiedTime: number;
  isDirectory: () => boolean;
  isFile: () => boolean;
}

export interface FileSystemManagerStatSuccessCallbackArgs {
  errMsg: string;
  stat: Stats;
}
export interface FileSystemManagerStatOptions extends Callbacks<FileSystemManagerStatSuccessCallbackArgs, CommonExtendsErrorArgs> {
  path: string;
}

export interface FileSystemManagerUnlinkOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  filePath: string;
}

export interface FileSystemManagerUnzipOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  zipFilePath: string;
  targetPath: string;
}

export interface FileSystemManagerWriteFileOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  filePath: string;
  data: string | ArrayBuffer;
  encoding?: Encoding;
}
export interface FileSystemManager {
  accessSync: (path: string) => void;
  access: (options: Callbacks<CommonErrorArgs, FileSystemManagerAccessFailCallbackArgs>) => void;
  saveFileSync: (tempFilePath: string, filePath?: string) => string;
  saveFile: (options: FileSystemManagerSaveFileOptions) => void;
  getSavedFileList: (options?: GetSavedFileListOptions) => void;
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

export interface EnvInfo {
  microapp: {
    mpVersion: string;
    envType: 'production' | 'development' | 'preview';
    appId: string;
  },
  common: {
    USER_DATA_PATH: string;
  };
}

export interface LoginSuccessCallbackArgs {
  errMsg: string;
  code: string;
  anonymousCode: string;
  isLogin: boolean;
}
export interface LoginOptions extends Callbacks<LoginSuccessCallbackArgs, CommonErrorArgs> {
  force?: boolean;
}

export interface CheckSessionOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> { }

export interface UserInfo {
  avatarUrl: string;
  nickName: string;
  gender: 0 | 1 | 2;
  city: string;
  provider: string;
  country: string;
  language: string;
}

export interface GetUserInfoSuccessCallbackArgs {
  errMsg: string;
  rawData: string;
  userInfo: UserInfo;
  signature?: string;
  encryptedData: string;
  iv: string;
}

export interface GetUserInfoOptions extends Callbacks<GetUserInfoSuccessCallbackArgs, CommonErrorArgs> {
  withCredentials?: boolean;
}

export interface GetUserInfoProfileOptions extends Callbacks<GetUserInfoSuccessCallbackArgs, CommonExtendsErrorArgs> {

}

export interface CreateRewardedVideoAdOptions {
  adUnitId: string;
}

export interface RewardedVideoAd {
  show: () => void;
  onLoad: (callback: (data: any) => void) => void;
  offLoad: (callback: (data: any) => void) => void;
  load: () => Promise<any>;
  onError: (callback: (data: any) => void) => void;
  offError: (callback: (data: any) => void) => void;
  onClose: (callback: (data: any) => void) => void;
  offClose: (callback: (data: any) => void) => void;
}

export interface InterstitialAd extends RewardedVideoAd {
  ddestroy: () => void;
}

export interface PayOptions {
  orderInfo: {
    order_id: string;
    order_token: string;
  },
  service: number;
  _debug?: number;
  success?: (args: { code: number; }) => void;
  fail?: (args: { errMsg: string; }) => void;
}

export interface NavigateToMiniProgramOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  appId: string;
  path?: string;
  extraData?: object;
  envVersion?: string;
}
export interface NavigateBackMiniProgramOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  envVersion?: string;
}

export interface ChooseAddressesSuccessCallbackArgs {
  errMsg: string;
  userName: string;
  provinceName: string;
  cityName: string;
  countryName: string;
  detailInfo: string;
  telNumber: string;
}

export interface ChooseAddressesOptions extends Callbacks<ChooseAddressesSuccessCallbackArgs, CommonErrorArgs> { }

export interface GetSettingSuccessCallbackArgs {
  errMsg: string;
  authSetting: {
    'scope.userInfo'?: boolean;
    'scope.userLocation'?: boolean;
    'scope.address'?: boolean;
    'scope.record'?: boolean;
    'scope.album'?: boolean;
    'scope.camera'?: boolean;
  };
}
export interface GetSettingOptions extends Callbacks<GetSettingSuccessCallbackArgs, CommonErrorArgs> { }
type OpenSettingsOptions = GetSettingOptions;

type Scope = 'scope.userInfo' | 'scope.userLocation' | 'scope.address' | 'scope.record' | 'scope.album' | 'scope.camera';

export interface AuthorizeOptions extends Callbacks {
  scope: Scope;
}

export interface ShowDouyinOpenAuthSuccessCallbackArgs {
  errMsg: string;
  ticket: string;
  grantPermissions: string[];
}

export interface ShowDouyinOpenAuthOptions extends Callbacks<ShowDouyinOpenAuthSuccessCallbackArgs, CommonExtendsErrorArgs> {
  scopes: object;
}


export interface CanRateAwemeOrdersOptions extends Callbacks<{ result: string[]; errMsg: string; }, CommonExtendsErrorArgs> {
  orderIds: string[];
}

export interface RateAwemeOrderOptions extends Callbacks<{ result: boolean; errMsg: string; }> {
  orderId: string;
}

export interface RequestSubscribeMessageSuccessCallbackArgs {
  errMsg: string;
  TEMPLATE_ID: 'accept' | 'reject' | 'ban' | 'fail';
}
export interface RequestSubscribeMessageOptions extends Callbacks<RequestSubscribeMessageSuccessCallbackArgs, CommonExtendsErrorArgs> {
  tmplIds: string[];
}

export interface OpenEcGoodOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  promotionId: string;
}

export interface OpenEcOrderDetailOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  orderId: string;
  shopId: string;
}

export interface OpenEcImOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  shopId: string;
  orderId?: string;
  promotionId?: string;
}

export interface OpenEcChatOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  shopId: string;
}
export interface OpenWebcastRoomOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  streamerId?: string;
}
export interface OpenDouyinProfileOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  userId: string;
  shopId: string;
}
export interface OpenEcCouponOptions extends Callbacks<CommonErrorArgs, CommonExtendsErrorArgs> {
  couponId: string;
  shopId: string;
}

export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

export interface GetStorageOptions extends Callbacks<{ data: any; }, any> {
  key: string;
}
export interface SetStorageOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  key: string;
  data: any;
}
export interface RemoveStorageOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  key: string;
}

export interface StorageInfo {
  keys: string[];
  currentSize: number;
  limitSize: number;
}
export interface GetStorageInfoOptions extends Callbacks<StorageInfo & CommonErrorArgs, CommonErrorArgs> {

}

export interface GetLocationSuccessCallbackArgs {
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
export interface GetLocationOptions extends Callbacks<GetLocationSuccessCallbackArgs, CommonErrorArgs> {
  type?: 'wgs84' | 'gcj02';
}

export interface ChooseLocationSuccessCallbackArgs {
  errMsg: string;
  name: string;
  address: string;
  latitude: number;
  longtitude: number;
}

export interface ChooseLocationOptions extends Callbacks<ChooseLocationSuccessCallbackArgs, CommonErrorArgs> {
  latitude: number;
  longtitude: number;
}

export interface OpenLocationOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  latitude: number;
  longtitude: number;
  scale: number;
  name: string;
  address: string;
}

export type NetworkType = 'wifi' | '2g' | '3g' | '4g' | 'unknown' | 'none';
type WifiInfo = {
  SSID: string;
  BSSID: string;
  secure: boolean;
  signalStrength: number;
};

export interface SafeArea {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}
export interface SystemInfo {
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

export interface GetSystemInfoOptions extends Callbacks<SystemInfo, CommonErrorArgs> {

}
export interface MakePhoneCallOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  phoneNumber: string;
}
export interface SetClipboardDataOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  data: string;
}

export interface CanvasContext {
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
  measureText(text: string): { width: number; };
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
  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, anticlockwise: boolean): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  closePath(): void;
}

export interface OffscreenCanvas {
  getContext(type: '2d' | 'webgl'): CanvasRenderingContext2D | WebGLRenderingContext;
}

export interface ShowToastOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  title: string;
  icon?: 'success' | 'loading' | 'none' | 'fail';
  duration?: number;
}

export interface ShowModalOptions extends Callbacks<{ confirm: boolean; cancel: boolean; } & CommonErrorArgs, CommonErrorArgs> {
  title?: string;
  content?: string;
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
}

export interface ShowFavoriteGuideOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> { type?: string; content?: string; position?: string; }

export interface Animation {
  opacity: number;
  backgroundColor: string;
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface CreateAnimationOptions {
  duration?: number;
  timingFunction?: string;
  delay?: number;
  transformOrigin?: string;
}

export interface SetTabBarStyleOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  color?: string;
  selectedColor?: string;
  backgroundColor?: string;
  borderStyle?: 'black' | 'white';
}

export interface SetTabBarItemOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  index: number;
  text?: string;
  iconPath?: string;
  selectedIconPath?: string;
}

export interface AlgorithmManager {
  doExecute(options: {
    input: ArrayBuffer;
    width: number;
    height: number;
    timeStamp: number;
    success?: (data: any) => void;
    fail?: (args: { errMsg: string; }) => void;
  }): void;
}
export interface GetAlgorithmManagerOptions extends Callbacks<{ algorithmManager: AlgorithmManager; } & CommonErrorArgs, CommonErrorArgs> {
  width: number;
  height: number;
  useSyncMode: boolean;
  requirements: ['skeleton'] | ['face106'] | ['nail'] | ['foot'] | ['trackingAr'];
}

export interface StickerProcessor {
  paintToTexture(inputTexture: any, outputTexture: any): void;
}
export interface StickerManager {
  onLoad: (callback: (processor: StickerProcessor) => void) => void;
  onError: (callback: (res: { errMsg: string; }) => void) => void;
  load(): void;
}

export interface DataConfig {
  data: ArrayBuffer;
  width: number;
  height: number;
  channel: number;
  batch: number;
  dataType: 'U8' | 'I8' | 'U16' | 'I16' | 'F16' | 'F32' | 'F64';
  dataFormat: 'NCHW' | 'NHWC';
}

export interface InputConfig {
  inputChannel: number;
  weight: number;
}
export interface SingleChannelConvertConfig {
  outputChannel: number;
  normalizeFactor: number;
  offset: number;
  inputConfig: InputConfig[];
}
export interface BytennEngineInferSyncOptions extends Callbacks {
  dataConfig: DataConfig;
  converConfig: SingleChannelConvertConfig[];
}

export interface BytennEngine {
  inferSync(options: BytennEngineInferSyncOptions): any;
}

export interface BytennEngineContext {
  load(): void;
  onError(callback: () => void): void;
  onLoad(callback: (engine: BytennEngine) => void): void;
}

export interface EngineConfig {
  numThread: number;
  backend: 'auto' | 'cup' | 'gpu';
}

export interface NodesRefBoundingClientRectCallbackArgs {
  id: string;
  dataset: object;
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export interface NodesRefScrollOffsetCallbackArgs {
  id: string;
  dataset: object;
  scrollLeft: number;
  scrollTop: number;
}
export interface NodesRefFieldsCallbackArgs extends NodesRefBoundingClientRectCallbackArgs {
  scrollLeft: number;
  scrollTop: number;
}

export interface NodesRefFields {
  id?: boolean;
  dataset?: boolean;
  rect?: boolean;
  size?: boolean;
  scrollOffset?: boolean;
  node?: boolean;
}

export interface NodesRef {
  boundingClientRect(callback: (res: NodesRefBoundingClientRectCallbackArgs) => void): SelectorQuery;
  scrollOffset(callback: (res: NodesRefScrollOffsetCallbackArgs) => void): SelectorQuery;
  fields(fields: NodesRefFields, callback?: (res: NodesRefFieldsCallbackArgs) => void): SelectorQuery;
  node(callback: (res: { node: object; }) => void): SelectorQuery;
}

export interface SelectorQuery {
  in(component: any): SelectorQuery;
  select(selector: string): NodesRef;
  selectAll(selector: string): NodesRef;
  selectViewport(): NodesRef;
  exec(callback: (arr: any[]) => void): NodesRef;
}

export interface CreateIntersectionObserverOptions {
  thresholds?: number[];
  initialRatio?: number;
  observeAll?: boolean;
}

export interface IntersectionObserverMargins {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface IntersectionObserverCallbackArgs {
  id: string;
  dataset: object;
  intersectionRatio: number;
  intersectionRect: IntersectionRect;
  boundingClientRect: IntersectionRect;
  relativeRect: RelativeRect;
  time: number;
}

export interface IntersectionRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export interface RelativeRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
export interface IntersectionObserver {
  relativeTo(selector: string, margins?: IntersectionObserverMargins): IntersectionObserver;
  relativeToViewport(margins?: IntersectionObserverMargins): IntersectionObserver;
  observer(targetSelector: string, callback: (res: IntersectionObserverCallbackArgs) => void): void;
  disconnect(): void;
}

export interface LiveReportContextOrderConfirmPageShowOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
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

export interface LiveReportContextProductDetailsShowOptions extends Callbacks<CommonErrorArgs, CommonErrorArgs> {
  productId: string;
  productName: string;
  shopId: string;
  shopName: string;
}

export interface LiveUserInfo {
  openUID: string;
  secNickname: string;
  secAvatarURL: string;
  role: string;
}

export interface GetLiveUserInfoOptions extends Callbacks<{ userInfo: LiveUserInfo; } & CommonErrorArgs, CommonExtendsErrorArgs> { }
export interface LiveReportContext {
  orderConfirmPageShow(options: LiveReportContextOrderConfirmPageShowOptions): void;
  orderSubmit(options: LiveReportContextOrderConfirmPageShowOptions): void;
  productDetailsShow(options: LiveReportContextProductDetailsShowOptions): void;
  productSelect(options: LiveReportContextProductDetailsShowOptions): void;
  productShareClick(options: LiveReportContextProductDetailsShowOptions): void;
  shelfShow(options: { showFrom: number; } & LiveReportContextProductDetailsShowOptions): void;
}

export interface FollowInfo {
  openUID: string;
  secNickname: string;
  secAvatarURL: string;
  action: number;
  timestamp: number;
}
export interface onReceiveAudiencesFollowActionCallbackArgs {
  followInfoList: FollowInfo[];
}

export interface Comment {
  openUID: string;
  secNickname: string;
  secAvatarURL: string;
  content: string;
  timestamp: number;
}

export interface OnReceiveSpecifiedCommentOptions {
  commnetList: Comment[];
}

export type ActionSheetProps = { itemList: string[]; } & Callbacks<CommonErrorArgs & { tapIndex: number; }, CommonErrorArgs>;

export interface CanvasToTempFilePathOptions extends Callbacks<CommonErrorArgs & { tempFilePath: string }, CommonErrorArgs> {
  canvasId: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  destWidth?: number;
  destHeight?: number;
}

abstract class Api {
  // 基础
  abstract canIUse(schema: string): boolean;
  abstract base64ToArrayBuffer(str: string): string;
  abstract arrayBufferToBase64(obj: string): string;
  // 生命周期
  abstract getEnterOptionsSync(): EnterOrLaunchOptions;
  abstract getLaunchOptionsSync(): EnterOrLaunchOptions;
  abstract exitMiniProgram(callbacks?: Callbacks): void;
  abstract canIPutStuffOverComponent(componentName: string): boolean;
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
    USER_DATA_PATH: string;
  };
  // 网络
  abstract downloadFile(options: DownloadFileOptions): DownloadTask;
  abstract request(options: RequestOptions): RequestTask;
  abstract uploadFile(options: UploadFileOptions): UploadTask;
  abstract connectSocket(options: ConnectSocketOptions): SocketTask;
  // 媒体
  // 图片
  abstract chooseImage(options?: ChooseImageOptions): void;
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
  abstract chooseVideo(options?: ChooseVideoOptions): void;
  abstract saveVideoToPhotoAlbum(options: SaveVideoOptions): void;
  abstract createVideoContext(id: string, component?: any): VideoContext;
  abstract createLivePlayerContext(id: string, component?: any): LivePlayerContext;
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
  abstract login(options?: LoginOptions): void;
  abstract checkSession(options?: CheckSessionOptions): void;
  // 用户信息
  abstract getUserInfo(options?: GetUserInfoOptions): void;
  abstract getUserInfoProfile(options?: GetUserInfoProfileOptions): void;
  // 广告
  abstract createRewardedVideoAd(options: CreateRewardedVideoAdOptions): RewardedVideoAd;
  abstract createInterstitialAd(options: CreateRewardedVideoAdOptions): InterstitialAd;
  // 支付
  abstract pay(options: PayOptions): void;
  // 小程序跳转
  abstract navigateToMiniProgram(options: NavigateToMiniProgramOptions): void;
  abstract navigateBackMiniProgram(options?: NavigateBackMiniProgramOptions): void;
  // 收获地址
  abstract chooseAddresses(options?: ChooseAddressesOptions): void;
  // 设置
  abstract getSetting(options?: GetSettingOptions): void;
  abstract openSettings(options?: OpenSettingsOptions): void;
  // 授权
  abstract authorize(options: AuthorizeOptions): void;
  abstract showDouyinOpenAuth(options: ShowDouyinOpenAuthOptions): void;
  // 数据分析
  abstract reportAnalytics(eventName: string, data: { key: string; value: string | number | boolean; }): void;
  // 评价能力
  abstract canRateAwemeOrders(options: CanRateAwemeOrdersOptions): void;
  abstract rateAwemeOrder(options: RateAwemeOrderOptions): void;
  // 引导关注             
  abstract followOfficialAccount(options?: Callbacks<CommonExtendsErrorArgs, CommonErrorArgs>): void;
  abstract checkFollowState(options?: Callbacks<{ errMsg: string; result: boolean; }, CommonErrorArgs>): void;
  abstract openAwemeUserProfile(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract followAwemeUser(options?: Callbacks<{ errMsg: string; followed: boolean; }, CommonErrorArgs>): void;
  // 订阅消息
  abstract requestSubscribeMessage(options: RequestSubscribeMessageOptions): void;
  // 电商融合方案
  abstract openDouyinOrderList(options?: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract openEcGood(options: OpenEcGoodOptions): void;
  abstract openEcOrderDetail(options: OpenEcOrderDetailOptions): void;
  abstract openEcIm(options: OpenEcImOptions): void;
  abstract openEcChat(options: OpenEcChatOptions): void;
  abstract openWebcastRoom(options: OpenWebcastRoomOptions): void;
  abstract openDouyinProfile(options: OpenDouyinProfileOptions): void;
  abstract openEcCoupon(options: OpenEcCouponOptions): void;
  // 性能
  abstract performance: {
    getEntries(): PerformanceEntry[];
    getEntriesByName(name: string, entryType?: string): PerformanceEntry[];
    getEntriesByType(entryType: string): PerformanceEntry[];
    getCurrentPageEntries(): PerformanceEntry[];
    getEntriesByPage(pagePath: string): PerformanceEntry[];
    mark(name: string): PerformanceEntry | undefined;
    clearMarks(name: string): void;
  };
  // 数据缓存
  abstract getStorage(options: GetStorageOptions): void;
  abstract getStorageSync(key: string): any;
  abstract setStorage(options: SetStorageOptions): void;
  abstract setStorageSync(key: string, data: any): void;
  abstract removeStorage(options: RemoveStorageOptions): void;
  abstract removeStorageSync(key: string): void;
  abstract clearStorage(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract clearStorageSync(): void;
  abstract getStorageInfo(options: GetStorageInfoOptions): void;
  abstract getStorageInfoSync(): StorageInfo;
  // 地理位置
  abstract getLocation(options: GetLocationOptions): void;
  abstract chooseLocation(options: ChooseLocationOptions): void;
  abstract openLocation(options: OpenLocationOptions): void;
  // 设备
  // 网络状态
  abstract getNetworkType(options?: Callbacks<{ networkType: NetworkType; }, CommonErrorArgs>): void;
  abstract onNetworkStatusChange(callback: (args: { networkType: NetworkType, isConnected: boolean; }) => void): void;
  abstract getWifiList(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract onGetWifiList(callback: (args: { wifiList: WifiInfo[]; }) => void): void;
  abstract offGetWifiList(callback: () => void): void;
  // 系统信息
  abstract getSystemInfo(options: GetSystemInfoOptions): void;
  abstract getSystemInfoSync(): SystemInfo;
  // WIFI
  abstract getConnectedWifi(options?: Callbacks<WifiInfo, CommonErrorArgs>): void;
  // 加速度计
  abstract startAccelerometer(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract stopAccelerometer(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract onAccelerometerChange(callback: (args: { x: number; y: number; z: number; }) => void): void;
  // 罗盘
  abstract startCompass(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract stopCompass(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract onCompassChange(options?: Callbacks<{ duration: number; }, CommonErrorArgs>): void;
  // 拨打电话
  abstract makePhoneCall(options: MakePhoneCallOptions): void;
  // 扫码
  abstract scanCode(options?: Callbacks<{ result: string; }, CommonErrorArgs>): void;
  // 剪切板
  abstract getClipboardData(options?: Callbacks<{ data: string; } & CommonErrorArgs, CommonErrorArgs>): void;
  abstract setClipboardData(options: SetClipboardDataOptions): void;
  // 屏幕
  abstract setKeepScreenOn(options: { keepScreenOn: boolean; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract onUserCaptureScreen(callback: () => void): void;
  abstract offUserCaptureScreen(callback: () => void): void;
  abstract getScreenBrightness(options: Callbacks<{ value: string; } & CommonErrorArgs, CommonErrorArgs>): void;
  abstract setScreenBrightness(options: { value: number; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract disableUserScreenRecord(options?: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract enableUserScreenRecord(options?: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract onUserScreenRecord(callback: (args: { state: 'start' | 'end'; }) => void): void;
  abstract offUserScreenRecord(callback?: () => void): void;
  // 震动
  abstract vibrateShort(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract vibrateLong(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 性能
  abstract onMemoryWarning(callback: (args: { level: 5 | 10 | 15; }) => void): void;
  // 画布
  abstract createCanvasContext(canvasId: string): CanvasContext;
  abstract canvasToTempFilePath(options: CanvasToTempFilePathOptions): void;
  abstract createOffscreenCanvas(): OffscreenCanvas;
  // 界面
  // 交互反馈
  abstract showToast(options: ShowToastOptions): void;
  abstract hideToast(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract showLoading(options: { title: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideLoading(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract showModal(options?: ShowModalOptions): void;
  abstract showActionSheet(options: ActionSheetProps): void;
  abstract showFavoriteGuide(options?: ShowFavoriteGuideOptions): void;
  abstract showInteractionBar(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideInteractionBar(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 导航栏
  abstract showNavigationBarLoading(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideNavigationBarLoading(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideHomeButton(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract setNavigationBarTitle(options: { title: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract setNavigationBarColor(options: { frontColor: string; backgroundColor: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 菜单
  abstract getMenuButtonBoundingClientRect(): { errMsg: string; width: number; height: number; top: number; right: number; bottom: number; left: number; };
  // 动画
  abstract createAnimation(options?: CreateAnimationOptions): Animation;
  // 页面位置
  abstract pageScrollTo(options: { scrollTop: number; duration?: number; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 滑动返回
  abstract setSwipeBackMode(mode: 0 | 1 | 2): void;
  // 下拉刷新
  abstract startPullDownRefresh(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // TabBar
  abstract showTabBarRedDot(options: { index: number; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract showTabBar(options?: { animation?: boolean; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract setTabBarStyle(options?: SetTabBarStyleOptions): void;
  abstract setTabBarItem(options: SetTabBarItemOptions): void;
  abstract setTabBarBadge(options: { index: number; text: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract removeTabBarBadge(options: { index: number; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideTabBarRedDot(options: { index: number; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideTabBar(options?: { animation?: boolean; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // AI/AR
  // TODO
  abstract getAlgorithmManager(options: GetAlgorithmManagerOptions): void;
  // 特效贴纸方案
  abstract createStickerManager(stickerId: string): StickerManager;
  // 原生神经网络
  abstract createBytennEngineContext(modelName: string, engineConfig?: EngineConfig): BytennEngineContext;
  // 导航
  abstract navigateTo(options: { url: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract redirectTo(options: { url: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract switchTab(options: { url: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract navigateBack(options?: { delta?: number; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract reLaunch(options: { url: string; } & Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  // 转发
  abstract showShareMenu(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract hideShareMenu(options?: Callbacks<CommonErrorArgs, CommonErrorArgs>): void;
  abstract navigateToVideoView(options?: { videoId?: string; encryptedId?: string; } & Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  // 第三方平台
  abstract getExtConfig(options?: Callbacks<{ extConfig: object; }>): void;
  abstract getExtConfigSync(): object;
  // TTML
  abstract createSelectorQuery(): SelectorQuery;
  abstract createIntersectionObserver(instance: any, options?: CreateIntersectionObserverOptions): IntersectionObserver;
  // 直播能力
  abstract createLiveReportContext(): LiveReportContext;
  abstract getRoomInfo(options?: Callbacks<{ roomInfo: { roomId: string; liveDuraction: number; }; } & CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract getLiveUserInfo(options?: GetLiveUserInfoOptions): void;
  abstract getSelfCommentCountDuringPluginRunning(options?: Callbacks<{ commentCount: number; } & CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract isFollowingAnchor(options?: Callbacks<{ isFollowing: boolean; } & CommonErrorArgs, CommonExtendsErrorArgs>): void;
  // 直播间关注互动数据
  abstract onReceiveAudiencesFollowAction(callback: (res: onReceiveAudiencesFollowActionCallbackArgs) => void): void;
  abstract subscribeAudiencesFollowAction(options?: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract unsubscribeAudiencesFollowAction(options?: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  // 直播间评论互动数据
  abstract subscribeSpecifiedContentComment(options: { keyWordList: string[]; } & Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract subscribeSpecifiedUserComment(options: { openUIDList: string[]; } & Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract unsubscribeAllSpecifiedContentComment(options?: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract unsubscribeAllSpecifiedUserComment(options?: Callbacks<CommonErrorArgs, CommonExtendsErrorArgs>): void;
  abstract onReceiveSpecifiedComment(callback: (res: OnReceiveSpecifiedCommentOptions) => void): void;
  // 自定义
  abstract open(url: string): void;
}

export default Api;