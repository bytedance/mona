// function queryStringify(params: Record<string, any>, inBody?: boolean) {
//   const items: string[] = [];

//   function itemStringify(obj: Record<string, any>, prefix: string) {
//     const type = Object.prototype.toString.call(obj);
//     if (type === '[object Array]') {
//       obj.forEach((item: Record<string, any>, key: any) => {
//         itemStringify(item, `${prefix}[${key}]`);
//       });
//     } else if (type === '[object Object]') {
//       for (const key in obj) {
//         itemStringify(obj[key], `${prefix}[${key}]`);
//       }
//     } else if (type === '[object Date]') {
//       items.push(`${prefix}=${obj.toISOString()}`);
//     } else if (type === '[object Null]') {
//       items.push(`${prefix}=`);
//     } else if (type !== '[object Undefined]') {
//       items.push(`${prefix}=${encodeURIComponent(obj)}`);
//     }
//   }

//   for (const k in params) {
//     itemStringify(params[k], k);
//   }

//   const str = items.join('&');
//   return str && !inBody ? `?${str}` : str;
// }
function canUseEval() {
  try {
    (() => {}).constructor('return window.fetch')();
  } catch (error) {
    return false;
  }
  return true;
}
const useEval = canUseEval();
export const MyFetch = useEval ? (() => {}).constructor('return window.fetch')() : window.fetch;
function getTokenByCookie(name: string) {
  const reg = new RegExp(`^${name}=`);
  try {
    const myCookie = (() => {}).constructor('return document.cookie')();
    const arr = myCookie.split(';').map((i: string) => i.trim());
    let token = '';
    for (let i = 0; i < arr.length; i++) {
      if (reg.test(arr[i])) {
        token = arr[i].replace(`${name}=`, '');
        break;
      }
    }

    return token || '';
  } catch {}
  return '';
}
// const fromCompass =
//   /compass\.jinritemai\.com/.test(location.href) || /ecom-compass-boe\.bytedance\.net/.test(location.href);

// const fromDmall = /dmall\.jinritemai\.com/.test(location.href) || /dmall-boe\.bytedance\.net/.test(location.href);

// const fromEcom = /\.jinritemai\.com/.test(location.href) || /\.bytedance\.net/.test(location.href);

export function getTokenInfoByDomain() {
  return {
    'x-open-client': 'doudian',
    'x-open-microapp': getTokenByCookie('PHPSESSID') || getTokenByCookie('PHPSESSID_SS') || '',
  };
}

function getLightAppToken(req: Record<string, any>) {
  const headers: Record<string, any> = {
    'Content-Type': 'application/json',
    ...getTokenInfoByDomain(),
  };
  return MyFetch(`https://lgw.jinritemai.com/open/tokenForApp?appId=${req.appId}`, { method: 'GET', headers });
}
function getAppIdByUrl() {
  try {
    // @ts-ignore 兜底
    return (window.__mona_public_path__ || window.__webpack_public_path__)
      ?.split('cmp-ecom-open-pigeon-plugin/')?.[1]
      ?.split('/')?.[0];
  } catch (error) {}
}
export function getAppId() {
  const ee = new Error();
  const pp = new Promise(() => {});
  return (
    window.__MONA_LIGHT_APP_LIFE_CYCLE_LANUCH_QUERY?.appId ||
    getAppIdByUrl() ||
    // @ts-ignore 兜底
    pp?.appId ||
    // @ts-ignore 兜底
    ee?.appId ||
    ''
  );
}
export const APP_ID = getAppId();
export class Token {
  private _tokenMap: Map<string, any>;
  private _appId: string;
  private _lightAppTokenKey: string;
  _pendingFetch: any;
  constructor(appId: string) {
    this._appId = appId || APP_ID || getAppId();
    this._lightAppTokenKey = this._appId;
    this._tokenMap = new Map();
  }

  async getToken(): Promise<string> {
    // if (window.__MONA_LIGHT_APP_GET_TOEKN) {
    //   return window.__MONA_LIGHT_APP_GET_TOEKN(...args);
    // }
    const { _tokenMap, _lightAppTokenKey } = this;

    // 如果token存在，判断是否过期
    if (_tokenMap.has(_lightAppTokenKey)) {
      const val = _tokenMap.get(_lightAppTokenKey);
      const currentTime = Math.ceil(Date.now() / 1000);

      // 如果当前时间大于过期时间 重新获取
      if (currentTime > val.expire) {
        return await this.fetchToken();
      } else {
        return _tokenMap.get(_lightAppTokenKey).token;
      }
    }
    return await this.fetchToken();
  }

  async fetchToken() {
    const { _appId, _tokenMap, _lightAppTokenKey } = this;
    if (this._pendingFetch) {
      const data = await this._pendingFetch;
      if (data?.BizError?.message) {
        return data.BizError;
      }

      return data.token;
    }
    try {
      this._pendingFetch = getLightAppToken({ session: '', appId: _appId });
      const data = (await this._pendingFetch) as Response;
      if (!data.ok) {
        return Promise.reject('token生成异常');
      }
      const respData = await data.json();
      console.log('respData', respData);

      if (respData?.BizError?.message) {
        return respData.BizError;
      }
      _tokenMap.set(_lightAppTokenKey, respData);

      return respData.token;
    } finally {
      this._pendingFetch = undefined;
    }
  }
}

export const tokenIns = new Token('');
export function getLightToken(...args: any[]) {
  if (window.__MONA_LIGHT_APP_GET_TOEKN) {
    // @ts-ignore
    return window.__MONA_LIGHT_APP_GET_TOEKN(...args) as string;
  } else {
    return tokenIns.getToken() as unknown as string;
  }
}
window.__MONA_LIGHT_USE_TEST = window.__MONA_LIGHT_USE_TEST || '0';
export async function getLightHeaders() {
  const token = (await getLightToken()) || '';
  if (typeof window.__LIGHT_APP_GET_TOKENS === 'function') {
    return {
      'x-open-token': token,
      'x-use-test': window.__MONA_LIGHT_USE_TEST,
      ...(window.__LIGHT_APP_GET_TOKENS() || {}),
    };
  } else if (window.__MONA_LIGHT_APP_GET_COMPASS_TOKEN) {
    return {
      'x-open-token': token,
      'x-use-test': window.__MONA_LIGHT_USE_TEST,
      'x-open-compass': window?.__MONA_LIGHT_APP_GET_COMPASS_TOKEN ? window.__MONA_LIGHT_APP_GET_COMPASS_TOKEN() : '',
    };
  } else {
    return {
      'x-open-token': token,
      'x-use-test': window.__MONA_LIGHT_USE_TEST,
      ...getTokenInfoByDomain(),
    };
  }
}
