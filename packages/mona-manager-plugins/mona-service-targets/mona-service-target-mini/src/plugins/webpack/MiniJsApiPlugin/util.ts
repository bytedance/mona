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
export const enum TypeCode {
  Number = 1,
  String = 2,
  Array = 3,
  Boolean = 4,
  Map = 5,
  Object = 6,
}

export const getMiniJsApiList: () => Promise<JsApiListResponse['data']> = async () => {
  const getJsApiListUrl = 'https://ecom-openapi.ecombdapi.com/open/jsapi';
  let res;
  try {
    res = await axios({
      url: getJsApiListUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        biz_domain: '小程序',
      },
    });
  } catch (err) {
    throw new Error('internal error');
  }
  if (res?.data?.code === 0) {
    return res?.data?.data;
  } else {
    throw new Error(res?.data?.message || '未知错误');
  }
};
