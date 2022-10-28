import { JsApiListResponse } from '../type';
import axios from 'axios';

//获取jsapi列表
export const getJsApiList = (boeUrl?: string) => {
  const getJsApiListUrl = 'https://ecom-openapi.ecombdapi.com/open/jsapi';
  if (boeUrl) {
    return axios({
      url: boeUrl,
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
  } else {
    return axios({
      url: boeUrl,
      data: {
        biz_domain: 'shop_decorate',
      },
      method: 'post',
    }).then(res => res?.data);
  }
};
