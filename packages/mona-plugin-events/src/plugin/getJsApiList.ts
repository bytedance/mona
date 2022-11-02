import { JsApiListResponse } from '../type';
import axios from 'axios';

//获取jsapi列表
export const getJsApiList = (env: 'prod' | 'boe' | 'ppe' = 'prod', url?: string) => {
  const getJsApiListUrl = 'https://ecom-openapi.ecombdapi.com/open/jsapi';
  if (env === 'boe' && url) {
    return axios({
      url: url,
      data: {
        biz_domain: '测试',
      },
      method: 'post',
      headers: {
        'x-use-boe': '1',
        'x-tt-env': 'boe_6657203',
        'Content-Type': 'application/json',
      },
    }).then(res => res?.data);
  } else if (env === 'ppe') {
    return axios({
      url: getJsApiListUrl,
      data: {
        biz_domain: '测试',
      },
      method: 'post',
      headers: {
        'x-use-ppe': '1',
        'x-tt-env': 'ppe_6657203',
        'Content-Type': 'application/json',
      },
    }).then(res => res?.data);
  } else {
    return axios({
      url: getJsApiListUrl,
      data: {
        biz_domain: 'shop_decorate',
      },
      method: 'post',
    }).then(res => res?.data);
  }
};
