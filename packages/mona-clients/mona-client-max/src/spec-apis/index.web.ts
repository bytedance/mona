import { request, setStorage, getStorage } from '@bytedance/mona-client-web/dist/apis/api';
import { genMaxEventSdk } from "./sdk";

// Compatible with web
export const max = genMaxEventSdk({ appid: __MONA_APPID, request, setStorage, getStorage });