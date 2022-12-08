import { genMaxEventSdk } from "./sdk";

const global = lynx;
// @ts-ignore
export const max = genMaxEventSdk(__MONA_APPID, global);