import { MaxEvent } from "@/types";
import { EventOptionsType, Listener } from "@/types/type";
import { jsApiStorage } from "./localStorage";
import { ErrorCode, genErrorResponse, getJsApiPermission, removeEventPrefix } from "./util";

const genMaxEventSdk = async (appid: string, global: any) => {
  const MAX_COMPONENT_PLUGINID = '__MAX_COMPONENT_PLUGINID__';

  const maxEvent = global ? global.__maxEvent : undefined;
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

  if (jsApiStorage.get(appid)) {
    //如果localstorage里缓存过，则读到内存中，并且setTimeout取获取接口，更新内存和localStorage
    maxEvent.setAppidJsApiPermisson(appid, jsApiStorage.get(appid));
    setTimeout(async () => {
      try {
        let {
          raw: {
            data: { js_name_list: jsNameList },
          },
        } = await getJsApiPermission(appid);
        // jsNameList.push(...['getCalendarV2', 'transformImgToWebp2']);
        maxEvent.setAppidJsApiPermisson(appid, jsNameList);
        jsApiStorage.set(appid, jsNameList);
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
      } = await getJsApiPermission(appid);
      // jsNameList.push(...['getCalendarV2', 'transformImgToWebp2']);

      maxEvent.setAppidJsApiPermisson(appid, jsNameList);
      jsApiStorage.set(appid, jsNameList);
      //获得权限了，延迟调用有权限的并且已经注册的api
      for (let jsApi of jsNameList) {
        maxEvent.delayQueue.run(`${jsApi}_${appid}_Permission_Register`, item => {
          const { data, options, resolve, reject } = item;
          const listenerInfo = maxEvent.getAppListenerInfo(jsApi);
          if (listenerInfo) {
            maxEvent.runListener(listenerInfo, jsApi, resolve, reject, data, options);
          }
        });
      }
      //获得权限了，延迟调用有权限的并且还没注册的api
      for (let jsApi of jsNameList) {
        maxEvent.delayQueue.run(`${jsApi}_${appid}_Permission_Not_Register`, item => {
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

// @ts-ignore
const max = genMaxEventSdk(APPID, lynx);