import { JsApiListResponse } from '../type';
//获取jsapi列表
export const getJsApiList: (isBoe?: boolean) => Promise<JsApiListResponse> = (isBoe?: boolean) => {
  const getJsApiListUrl = 'https://ecom-openapi.ecombdapi.com/open/jsapi';
  const getJsApiListBoeUrl = window.atob('aHR0cHM6Ly9vcGVuYXBpLWJvZS5ieXRlZC5vcmcvb3Blbi9qc2FwaQ==');
  if (isBoe) {
    return fetch(getJsApiListBoeUrl, {
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
