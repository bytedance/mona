import { Pigeon } from './pigeon.type';
export interface PluginSdkBaseType {
  [keyName: string]: (params: InputCallbackParams | inputFunc) => void | ((params: inputFunc) => void);
}

export interface MonaPluginEvents {
  pigeon: Pigeon;
  removePluginListener: (eventName: string) => void;
  globalStore: {
    getData: <T = any>(name?: string) => T;
  };
}

export const enum ErrorCode {
  Unknown = -100,
  TypeError = -101,
  NoPermission = -102,
  AppNoRegister = -103,
}

export type ErrorResponse = { code: ErrorCode; message: string };

export interface InputCallbackParams<T = any, R = any> {
  data?: T;
  success?: (data: R) => void;
  failed?: (error: ErrorResponse) => void;
}

type inputFunc = (...args: any[]) => void;

export type Listener = (data: any) => any;

export interface EventOptionsType {
  //是否是深克隆
  isDeepClone?: boolean;
  //是否一次性调用
  once?: boolean;
  //子应用id
  pluginId?: string;
  // 子应用appid，用于获取权限包。
  appid?: string;
}
export interface RequestArg {
  fieldName: string;
  fieldType: number;
  children?: RequestArg[];
  fieldDesc: string;
  fieldExample: string;
  fieldRequired: boolean;
  subFieldType: number;
  mapKeyType: number;
  mapValueType: number;
}
export interface ResponseArg {
  fieldName: string;
  fieldType: number;
  children?: ResponseArg[];
  fieldDesc: string;
  fieldExample: string;
}
export interface JsApi {
  jsApiName: string;
  hasRelateOpenApi: boolean;
  jsApiDesc: string;
  jsApiDetail: string;
  relateOpenApiPath: string;
  isRequestRequired: boolean;
  requestArgJson: RequestArg[];
  responseArgJson: ResponseArg[];
  isAsync: boolean;
}
export interface JsApiListResponse {
  code: number;
  msg: string;
  sub_code: number;
  sub_msg: string;
  data: {
    count: number;
    jsApiList: JsApi[];
  };
}

export interface JsApiPermissionListResponse {
  code: number;
  msg: string;
  sub_code: number;
  sub_msg: string;
  data: {
    jsNameList: string[];
  };
}

export interface NativeFetchRes<T> {
  code: number;
  raw?: T;
}
