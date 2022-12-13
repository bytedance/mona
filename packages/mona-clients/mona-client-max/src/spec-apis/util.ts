export const removeEventPrefix = (prop: string, prefix: string) => {
  if (!prop.startsWith(prefix) || prop.length === prefix.length) {
    return prop;
  }
  const alphaList = Array.from(prop?.slice(prefix.length));
  alphaList[0] = alphaList[0].toLowerCase();
  return alphaList.join('');
};

export type ErrorResponse = { code: ErrorCode | number; message: string };

export interface JsApiPermissionListResponse {
  code: number;
  msg: string;
  sub_code: number;
  sub_msg: string;
  data: {
    js_name_list: string[];
  };
}

export const enum ErrorCode {
  Unknown = -100,
  TypeError = -101,
  NoPermission = -102,
  AppNoRegister = -103,
  PluginNoRegister = -104,
}

const ErrorCodeMessageMap: Record<ErrorCode | number, string> = {
  [ErrorCode.Unknown]: '未知错误',
  [ErrorCode.TypeError]: '参数错误',
  [ErrorCode.NoPermission]: '权限缺失',
  [ErrorCode.AppNoRegister]: '应用不提供此能力',
  [ErrorCode.PluginNoRegister]: '插件不提供此能力',
};

export const genErrorResponse = (errorCode: ErrorCode | number, message?: string): ErrorResponse => {
  return {
    code: errorCode,
    message: message ?? ErrorCodeMessageMap[errorCode] ?? '未知错误',
  };
};