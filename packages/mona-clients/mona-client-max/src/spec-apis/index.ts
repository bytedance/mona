import { genMaxEventSdk } from './sdk';
import { request, setStorage, getStorage } from '../apis/api';

export const enum ErrorCode {
  Unknown = -100,
  TypeError = -101,
  NoPermission = -102,
  AppNoRegister = -103,
}

export type ErrorResponse = { code: ErrorCode | number; message: string };

export interface EventOptionsType {
  isDeepClone?: boolean;
  once?: boolean;
  pluginId?: string;
  isSync?: boolean;
  resolve?: any;
  reject?: any;
}

export const max = genMaxEventSdk({ appid: __MONA_APPID, request, setStorage, getStorage, maxEvent: lynx.__maxEvent });
