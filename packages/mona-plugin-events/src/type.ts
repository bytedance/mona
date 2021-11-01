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
  AppNoRegister = -103
}

export type ErrorResponse = { code: ErrorCode; message: string };

export interface InputCallbackParams<T = any, R = any> {
  data?: T;
  success?: (data: R) => void;
  failed?: (error: ErrorResponse) => void;
}

type inputFunc = (...args: any[]) => void;
