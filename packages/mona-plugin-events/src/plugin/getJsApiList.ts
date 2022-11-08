import { JsApiListResponse } from '../type';
import axios from 'axios';

//获取jsapi列表
export const getJsApiList = () => {
  const getJsApiListUrl = 'https://ecom-openapi.ecombdapi.com/open/jsapi';
  return axios({
    url: getJsApiListUrl,
    data: {
      biz_domain: '店铺装修',
    },
    method: 'post',
  }).then(res => res?.data);
};
