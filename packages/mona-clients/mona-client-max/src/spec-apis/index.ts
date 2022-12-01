import { MaxEvent } from "@/types";
import { EventOptionsType, Listener } from "@/types/type";
import { JSAPI_PERMISSION_CACHE } from "./constants";
import { ErrorCode, genErrorResponse, JsApiPermissionListResponse, NativeFetchRes, removeEventPrefix } from "./util";

const genMaxEventSdk = async (appid: string, global: any) => {
  const MAX_COMPONENT_PLUGINID = '__MAX_COMPONENT_PLUGINID__';

  const maxEvent = global ? global.__maxEvent : undefined;

  if (maxEvent) {
    maxEvent.genWithOpenApiJsApi(global.metaInfo.sec_shop_id)
  }

  const maxEventSDK = new Proxy(maxEvent || {}, {
    get: (obj: MaxEvent, prop: string) => {
      //如果是once或on注册事件监听
      if (prop.startsWith('once') && prop.length > 4) {
        const eventName = removeEventPrefix(prop, 'once');
        return (listener: Listener, options?: EventOptionsType) => {
          options = options || {};
          options.pluginId = options.pluginId || MAX_COMPONENT_PLUGINID;
          return obj?.onceByPlugin(eventName, listener, options);
        };
      } else if (prop.startsWith('on') && prop.length > 2) {
        const eventName = removeEventPrefix(prop, 'on');
        return (listener: Listener, options?: EventOptionsType) => {
          options = options || {};
          options.pluginId = options.pluginId || MAX_COMPONENT_PLUGINID;
          return obj?.onByPlugin(eventName, listener, options);
        };
      } else if (prop?.startsWith('off') && prop.length > 3) {
        //如果是off卸载事件监听
        const eventName = removeEventPrefix(prop, 'off');
        return (listener: Listener) => {
          return obj?.offByPlugin(eventName, listener);
        };
      } else {
        //正常emit
        const eventName = prop;
        return (data?: any, options?: EventOptionsType) => {
          data = data || {};
          if (!(data instanceof Object)) {
            return () => {
              console.log(genErrorResponse(ErrorCode.TypeError));
            };
          }
          data.appid = appid;
          return obj?.emitByPlugin(eventName, data, options);
        };
      }
    },
    set: () => false,
  });

  // 如果没有则不执行之后的逻辑
  if (!maxEvent) {
    return maxEventSDK;
  }


  // internal apis
  const _request = lynx.request;
  const _getStorage = lynx.getStorage;
  const _setStroage = lynx.setStorage;

  function hasPermissionCache() {
    try {
      const data = _getStorage({ key: JSAPI_PERMISSION_CACHE, unique: appid });
      if (data) {
        return JSON.parse(data)?.[appid];
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  function setPermissionCache(value: string[]) {
    try {
      let data = _getStorage.get({ key: JSAPI_PERMISSION_CACHE, unique: appid });
      let dataObj: { [key: string]: string[] };
      if (data) {
        // 有缓存
        dataObj = JSON.parse(data);
        dataObj[appid] = value;
      } else {
        //没有缓存
        dataObj = {};
        dataObj[appid] = value;
      }
      _setStroage({ key: JSAPI_PERMISSION_CACHE, unique: appid, value: JSON.stringify(dataObj) });
    } catch (err) {
      console.log(err);
    }
  }
  function requestPermission(): Promise<NativeFetchRes<JsApiPermissionListResponse>> {
    const getJsApiPermissionUrl = 'https://ecom-openapi.ecombdapi.com/open/appauth';

    return _request({
      url: getJsApiPermissionUrl,
      method: 'post',
      data: {
        app_key: appid,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }


  let permission;
  if (permission = hasPermissionCache()) {
    //如果localstorage里缓存过，则读到内存中，并且setTimeout取获取接口，更新内存和localStorage
    maxEvent.setAppidJsApiPermisson(appid, permission);
    setTimeout(async () => {
      try {
        let {
          raw: {
            data: { js_name_list: jsNameList },
          },
        } = await requestPermission();
        // jsNameList.push(...['getCalendarV2', 'transformImgToWebp2']);
        maxEvent.setAppidJsApiPermisson(appid, jsNameList);
        setPermissionCache(jsNameList);
      } catch (err) {
        console.log(err);
      }
    }, 200);
  } else {
    try {
      let {
        raw: {
          data: { js_name_list: jsNameList },
        },
      } = await requestPermission();
      // jsNameList.push(...['getCalendarV2', 'transformImgToWebp2']);

      maxEvent.setAppidJsApiPermisson(appid, jsNameList);
      setPermissionCache(jsNameList);
      //获得权限了，延迟调用有权限的并且已经注册的api
      for (let jsApi of jsNameList) {
        maxEvent.delayQueue.run(`${jsApi}_${appid}_Permission_Register`, (item: any) => {
          const { data, options, resolve, reject } = item;
          const listenerInfo = maxEvent.getAppListenerInfo(jsApi);
          if (listenerInfo) {
            maxEvent.runListener(listenerInfo, jsApi, resolve, reject, data, options);
          }
        });
      }
      //获得权限了，延迟调用有权限的并且还没注册的api
      for (let jsApi of jsNameList) {
        maxEvent.delayQueue.run(`${jsApi}_${appid}_Permission_Not_Register`, (item: any) => {
          const { data, options, resolve, reject } = item;
          options.resolve = resolve;
          options.reject = reject;
          maxEvent.emitByPlugin(jsApi, data, options);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return maxEventSDK;
};
const __MONA_APPID = 'testAppId'
export const max = genMaxEventSdk(__MONA_APPID, lynx);