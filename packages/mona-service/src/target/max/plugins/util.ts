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
  fieldRequired: boolean;
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
