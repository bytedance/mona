import { JsApiListResponse } from '../type';
//获取jsapi列表
export const getJsApiList: (boeUrl?: string) => Promise<JsApiListResponse> = (boeUrl?: string) => {
  const getJsApiListUrl = 'https://ecom-openapi.ecombdapi.com/open/jsapi';
  if (boeUrl) {
    return fetch(boeUrl, {
      method: 'post',
      headers: {
        'x-use-boe': '1',
        'x-tt-env': 'boe_6657203',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        biz_domain: '测试',
      }),
    }).then(res => res.json());
  } else {
    return fetch(getJsApiListUrl, {
      method: 'post',
      body: JSON.stringify({
        biz_domain: 'shop_decorate',
      }),
    }).then(res => res.json());
  }
};
