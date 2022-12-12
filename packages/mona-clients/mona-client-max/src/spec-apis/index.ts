import { genMaxEventSdk } from "./sdk";

const global = lynx;
// @ts-ignore
const enum ErrorCode {
  Unknown = -100,
  TypeError = -101,
  NoPermission = -102,
  AppNoRegister = -103,
  PluginNoRegister = -104,
}

export type ErrorResponse = { code: ErrorCode | number; message: string };

export const max = genMaxEventSdk(__MONA_APPID, global);