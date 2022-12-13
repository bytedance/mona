import { genMaxEventSdk } from "./sdk";
import { request, setStorage, getStorage } from '../apis/api'

export const max = genMaxEventSdk({ appid: __MONA_APPID, request, setStorage, getStorage, maxEvent: lynx.__maxEvent });