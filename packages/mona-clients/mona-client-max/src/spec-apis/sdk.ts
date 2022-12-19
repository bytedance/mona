import { BaseApis } from '@bytedance/mona';
import { MaxEvent } from "@/types";
import { EventOptionsType, Listener } from "@/types/type";
import { JSAPI_PERMISSION_CACHE } from "./constants";
import { ErrorCode, genErrorResponse, JsApiPermissionListResponse, removeEventPrefix } from "./util";

// lock
let sdkCache: any;
export const genMaxEventSdk = ({ appid, request: _request, setStorage: _setStorage, getStorage: _getStorage, maxEvent }:{ appid: string; request: BaseApis['request']; setStorage: BaseApis['setStorage']; getStorage: BaseApis['getStorage']; maxEvent?: MaxEvent }) => {
  const MAX_COMPONENT_PLUGINID = '__MAX_COMPONENT_PLUGINID__';

  if (sdkCache) {
    return sdkCache;
  }
  if (!maxEvent) {
    console.log('[MonaLog]此环境未实现max.xxx相关api')
  }
  const maxEventSDK = new Proxy(maxEvent || {}, {
    get: (obj: MaxEvent, prop: string) => {
      //如果是once或on注册事件监听
      if (prop.startsWith('once') && prop.length > 4) {
        const eventName = removeEventPrefix(prop, 'once');
        return (listener: Listener, options?: EventOptionsType) => {
          options = options || {};
          options.pluginId = options.pluginId || MAX_COMPONENT_PLUGINID;
          return obj?.onceByPlugin?.(eventName, listener, options);
        };
      } else if (prop.startsWith('on') && prop.length > 2) {
        const eventName = removeEventPrefix(prop, 'on');
        return (listener: Listener, options?: EventOptionsType) => {
          options = options || {};
          options.pluginId = options.pluginId || MAX_COMPONENT_PLUGINID;
          return obj?.onByPlugin?.(eventName, listener, options);
        };
      } else if (prop?.startsWith('off') && prop.length > 3) {
        //如果是off卸载事件监听
        const eventName = removeEventPrefix(prop, 'off');
        return (listener: Listener) => {
          return obj?.offByPlugin?.(eventName, listener);
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
          return obj?.emitByPlugin?.(eventName, data, options);
        };
      }
    },
    set: () => false,
  });
  sdkCache = maxEventSDK;

  // 如果没有则不执行之后的逻辑
  if (!maxEvent) {
    return maxEventSDK;
  }

  async function hasPermissionCache() {
    try {
      const data = await _getStorage({ key: JSAPI_PERMISSION_CACHE }).then(res => res.data);
      if (data) {
        return JSON.parse(data)?.[appid];
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  async function setPermissionCache(value: string[]) {
    try {
      let data = await _getStorage({ key: JSAPI_PERMISSION_CACHE }).then(res => res.data);
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
      await _setStorage({ key: JSAPI_PERMISSION_CACHE, data: JSON.stringify(dataObj) });
    } catch (err) {
      console.log(err);
    }
  }
  async function requestPermission(): Promise<JsApiPermissionListResponse> {
    const getJsApiPermissionUrl = 'https://ecom-openapi.ecombdapi.com/open/appauth';

    const res = await _request({
      url: getJsApiPermissionUrl,
      method: 'POST',
      data: {
        app_key: appid,
      },
      header: {
        'Content-Type': 'application/json',
      },
    })
    return res.data as any;
  }

  async function run() {
    if (maxEvent) {
      let permission;
      try {
        permission = await hasPermissionCache();
        if (!permission) {
          const res = await requestPermission();
          const {
            data: { js_name_list: jsNameList },
          } = res;
          maxEvent.setAppidJsApiPermisson(appid, jsNameList);
          setPermissionCache(jsNameList);
          permission = jsNameList;
        } else {
          maxEvent.setAppidJsApiPermisson(appid, permission);
          setTimeout(async () => {
            try {
              let {
                data: { js_name_list: jsNameList },
              } = await requestPermission();
              maxEvent.setAppidJsApiPermisson(appid, jsNameList);
              setPermissionCache(jsNameList);
            } catch (err) {
              console.log(err);
            }
          }, 200);
        }
        
        //获得权限了，延迟调用有权限的并且已经注册的api
        for (let jsApi of permission) {
          maxEvent.delayQueue.run(`${jsApi}_${appid}_Permission_Register`, (item: any) => {
            const { data, options, resolve, reject } = item;
            const listenerInfo = maxEvent.getAppListenerInfo(jsApi);
            if (listenerInfo) {
              maxEvent.runListener(listenerInfo, jsApi, resolve, reject, data, options);
            }
          });
        }
        //获得权限了，延迟调用有权限的并且还没注册的api
        for (let jsApi of permission) {
          maxEvent.delayQueue.run(`${jsApi}_${appid}_Permission_Not_Register`, (item: any) => {
            const { data, options, resolve, reject } = item;
            options.resolve = resolve;
            options.reject = reject;
            maxEvent.emitByPlugin(jsApi, data, options);
          });
        }
      } catch(err) {
        console.log(err);
      }
    }
  }
  
  run();
  return maxEventSDK;
};