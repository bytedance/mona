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
interface ResponseProfile {
  domainLookupStart: number
  domainLookupEnd: number
  connectStart:	number
  connectEnd:	number
  SSLconnectionStart:	number
  SSLconnectionEnd:	number
  requestStart:	number
  requestEnd:	number
  responseStart: number
  responseEnd: number
  peerIP:	string
  port:	number
  socketReused:	boolean
}
abstract class Api {
  // 基础
  abstract canIUse(schema: string): boolean
  abstract base64ToArrayBuffer(str: string): ArrayBuffer
  abstract arrayBufferToBase64(obj: ArrayBuffer): string
  // 生命周期
  abstract getEnterOptionsSync(): EnterOrLaunchOptions
  abstract getLaunchOptionsSync(): EnterOrLaunchOptions
  abstract exitMiniProgram(): Promise<any>
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
  abstract downloadFile(options: {
    url: string;
    header?: object;
  }): Promise<{ tempFilePath: string; statusCode: number }>;
  // TODO abort
  abstract request(options: {
    url: string;
    header?: object;
    method?: 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'DELETE' | 'PUT' | 'TRACE'  | 'CONNECT'
    data?: any;
    dataType?: 'json' | 'string';
    timeout?: number;
    enableCache?: boolean;
    responseType?: 'text' | 'arraybuffer';
  }): Promise<{
    statusCode: number;
    header: object;
    data: any;
    profile: ResponseProfile;
  }>;
  abstract showToast(params: {
    title: string;
    icon: 'success' | 'loading' | 'none' | 'fail';
    duration: number;
  }): Promise<any>;
}

export default Api