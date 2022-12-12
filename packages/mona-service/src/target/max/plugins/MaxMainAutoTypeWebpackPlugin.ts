import { writeFile, readFile, existsSync } from 'fs';
import path from 'path';
import axios from 'axios';
import { JsApiListResponse, NativeFetchRes, JsApi, RequestArg, ResponseArg } from './util';

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


export const getJsApiList: () => Promise<NativeFetchRes<JsApiListResponse>> = () => {
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
  })
  return res;
};

class MaxMainAutoTypeWebpackPlugin {
  constructor() {}
  apply(compiler: any) {
    compiler.hooks.compile.tap('MaxMainAutoTypeWebpackPlugin', async () => {
      const eventsTsFilePath = path.join(require.resolve('@bytedance/mona-client-max'), '../spec-apis/index.d.ts')
      console.log(eventsTsFilePath, existsSync(eventsTsFilePath))
      if (existsSync(eventsTsFilePath)) {
        try {
          let {
            raw: {
              // code,
              data: { jsApiList },
            },
          } = await getJsApiList();
          if (jsApiList.length > 0) {
            const tsCode = generateTsCode(jsApiList);
            // 将生成的声明code，写入到events声明文件中
            writeCodeToFile(eventsTsFilePath, tsCode);
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
}

//生成api声明，即maxApis
export const generateTsCode = (jsApiList: JsApi[]) => {
  let code = 'export interface maxApis {';
  jsApiList.forEach(api => {
    const { jsApiName, requestArgJson = [], responseArgJson, isRequestRequired, isAsync } = api;
    const processedInputParams = processInputParams(requestArgJson, isRequestRequired);
    const processedOutputParams = processOutputParams(responseArgJson, isAsync);
    code += `\n${jsApiName}:(${processedInputParams})=>${processedOutputParams};`;
  });
  code += '\n}';
  return code;
};

const enum TypeCode {
  Number = 1,
  String = 2,
  Array = 3,
  Boolean = 4,
  Map = 5,
  Object = 6,
}
const typeMap: { [key: string]: string } = {
  [TypeCode.Number]: 'number',
  [TypeCode.String]: 'string',
  [TypeCode.Boolean]: 'boolean',
};

//递归根据入参json以及是否必传结构生成ts
const paramToTs = (inputParams: RequestArg[]) => {
  let res = '';
  if (inputParams.length > 0) {
    res = '{\n';
    for (let inputParam of inputParams) {
      let { fieldName, fieldRequired, fieldType, children = [], subFieldType, mapKeyType, mapValueType } = inputParam;
      if (fieldType === TypeCode.Number || fieldType === TypeCode.String || fieldType === TypeCode.Boolean) {
        // 如果类型是number、string或者boolean
        res += `${fieldName}${fieldRequired ? '' : '?'}:${typeMap[fieldType]};\n`;
      } else if (fieldType === TypeCode.Map) {
        // 如果是映射Map,key只能是number或string。value可以是除了map的所有类型
        let mapValueRes = '';
        if (mapValueType === TypeCode.Number || mapValueType === TypeCode.String || mapValueType === TypeCode.Boolean) {
          mapValueRes = typeMap[mapValueType];
        } else if (mapValueType === TypeCode.Array) {
          // 数组
          if (
            subFieldType === TypeCode.Number ||
            subFieldType === TypeCode.String ||
            subFieldType === TypeCode.Boolean
          ) {
            // 数组值类型为number string boolean
            mapValueRes = `${typeMap[subFieldType]}[]`;
          } else if (subFieldType === TypeCode.Object) {
            // 数组值类型为对象
            mapValueRes = `${paramToTs(children)}[]`;
          }
        } else if (mapValueType === TypeCode.Object) {
          mapValueRes = paramToTs(children);
        }
        res += `${fieldName}${fieldRequired ? '' : '?'}:Map<${typeMap[mapKeyType]},${mapValueRes}>;\n`;
      } else if (fieldType === TypeCode.Object) {
        //对象
        res += `${fieldName}:${paramToTs(children)};`;
      } else {
        // 数组
        if (subFieldType === TypeCode.Number || subFieldType === TypeCode.String || subFieldType === TypeCode.Boolean) {
          // 数组值类型为number string boolean
          res += `${fieldName}:${typeMap[subFieldType]}[];`;
        } else if (subFieldType === TypeCode.Object) {
          // 数组值类型为对象
          res += `${fieldName}:${paramToTs(children)}[];`;
        }
      }
    }
    res += '}';
  }
  return res;
};
//处理入参，ts前+data?
const processInputParams = (inputParams: RequestArg[], isRequired: boolean) => {
  let tsRes = paramToTs(inputParams);
  let res = '';
  if (tsRes) {
    res = `data${isRequired ? '' : '?'}:${tsRes}`;
  }
  //加上data以及？，data?:{a:string}
  return res;
};
//处理出参，以及ErrorResponse
const processOutputParams = (outputParams: ResponseArg[], isAsync: boolean) => {
  let tsRes = paramToTs(outputParams as RequestArg[]);
  let res = 'void';
  if (tsRes) {
    res = tsRes;
  }
  if (isAsync) {
    res = `${res} | Promise<${res}> | ErrorResponse | Promise<ErrorResponse>`;
  } else {
    res = `${res} | ErrorResponse `;
  }
  return res;
};
// 原始on函数的匹配正则
// export const onFuncTsReg =
  // /on\s*:\s*\(\s*eventName\s*:\s*string\s*,\s*listener\s*:\s*Listener\s*,\s*options\s*\?\s*:\s*EventOptionsType\s*\)\s*=>\s*Listener\s*;/;
// maxApis匹配正则
export const maxApisReg = /export\s+interface\s+maxApis\s*\{[\s\S]*\}/;
// 要替换成的on函数新声明
export const onNewFuncTsStr =
  'on: <T extends keyof maxApis>(eventName: T, listener: maxApis[T], options?: EventOptionsType) => maxApis[T];';

// 将ts代码写到events.d.ts中
const writeCodeToFile = (eventsTsFilePath: string, code: string) => {
  readFile(eventsTsFilePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    //处理on函数的声明
    // const onFuncMatchRes = data.match(onFuncTsReg);
    // //如果之前没有替换过，则将on替换
    // if (onFuncMatchRes) {
    //   data =
    //     data.substring(0, onFuncMatchRes.index) +
    //     onNewFuncTsStr +
    //     data.substring(onFuncMatchRes?.index ?? 0 + onFuncMatchRes[0].length);
    // }

    //然后添加maxApis,添加到最后
    const maxApisMatchRes = data.match(maxApisReg);
    //如果之前添加过，删除再添加最新的api
    if (maxApisMatchRes) {
      data = data.substring(0, maxApisMatchRes.index) + code;
    } else {
      //如果之前没添加过，直接添加
      data = data + code;
    }

    // replace max: any;
    data = data.replace('max: any', 'max: maxApis')
    writeFile(eventsTsFilePath, data, 'utf8', err => {
      if (err) {
        throw err;
      }
      console.log('api ts has been pulled');
    });
  });
};

export default MaxMainAutoTypeWebpackPlugin;