import axios from 'axios';

export interface JsApiPermissionListResponse {
  code: number;
  msg: string;
  sub_code: number;
  sub_msg: string;
  data: {
    js_name_list: string[];
  };
}

export interface RequestArg {
  fieldName: string;
  fieldType: number;
  children?: RequestArg[];
  fieldDesc: string;
  fieldExample: string;
  isRequired: boolean;
  subFieldType: number;
  mapKeyType: number;
  mapValueType: number;
}
export interface ResponseArg {
  fieldName: string;
  fieldType: number;
  children?: ResponseArg[];
  fieldDesc: string;
  fieldExample: string;
}
export interface JsApi {
  jsApiName: string;
  hasRelateOpenApi: boolean;
  jsApiDesc: string;
  jsApiDetail: string;
  relateOpenApiPath: string;
  isRequestRequired: boolean;
  requestArgJson: RequestArg[];
  responseArgJson: ResponseArg[];
  isAsync: boolean;
}

export interface JsApiListResponse {
  code: number;
  msg: string;
  sub_code: number;
  sub_msg: string;
  data: {
    count: number;
    jsApiList: JsApi[];
  };
}

export interface NativeFetchRes<T> {
  code: number;
  raw: T;
}

export const nativeFetch: (params: any) => Promise<{ code: number; raw: any }> = params => {
  let resultUrl = params.url;
  const method = params.method || 'GET';
  const headers = params.headers || {};

  return new Promise(resolve =>
    axios({
      url: resultUrl,
      data: params.data,
      method,
      params: { ...params.params },
      headers: {
        ...headers,
        'x-preview': 1, // 非app环境带上这个头是为了提供没有用户信息情况下的数据
      },
    }).then(res => {
      resolve({
        code: 1,
        raw: { data: res?.data?.data },
      });
    }),
  );
};

export const getJsApiList: () => Promise<JsApiListResponse> = () => {
  const getJsApiListUrl = 'https://ecom-openapi.ecombdapi.com/open/jsapi';
  const res = nativeFetch({
    url: getJsApiListUrl,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      biz_domain: '店铺装修',
    },
  });
  return res.then(result => result.raw);
};
