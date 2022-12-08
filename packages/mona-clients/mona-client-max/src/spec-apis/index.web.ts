import { genMaxEventSdk } from "./sdk";

// Compatible with web
const global = window;
// @ts-ignore
export const max = genMaxEventSdk(__MONA_APPID, global);