import { genMaxEventSdk } from "./sdk";

const __MONA_APPID = 'NO_APPID';
// Compatible with web
const global = lynx;
export const max = genMaxEventSdk(__MONA_APPID, global);