import { writeFile, readFile } from 'fs';
import path from 'path';
import { JsApiListResponse, JsApi, RequestArg, ResponseArg } from '../type';
import { getJsApiList } from './getJsApiList';

export class MaxSubAutoTypeWebpackPlugin {
  public boeUrl?: string;
  constructor(boeUrl?: string) {
    this.boeUrl = boeUrl;
  }
  apply(compiler) {
    compiler.hooks.compile.tap('MaxSubAutoTypeWebpackPlugin', async () => {
      try {
        let {
          code,
          data: { jsApiList },
        } = await getJsApiList(this.boeUrl);
        if (code === 10000) {
          const code = generateTsCode(jsApiList);
          // events声明文件
          const eventsTsFilePath = path.join(__dirname, 'type.d.ts');
          // 将生成的声明code，写入到type声明文件中
          writeCodeToFile(eventsTsFilePath, code);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}

//生成api声明，即 export interface Max{}
export const generateTsCode = (jsApiList: JsApi[]) => {
  let code = 'export interface Max {';
  jsApiList.forEach(api => {
    const { jsApiName, requestArgJson, responseArgJson, isRequestRequired, isAsync } = api;
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
const typeMap = {
  [TypeCode.Number]: 'number',
  [TypeCode.String]: 'string',
  [TypeCode.Boolean]: 'boolean',
};
//递归根据入参json以及是否必传结构生成ts
const paramToTs = (inputParams: RequestArg[]) => {
  let res = '';
  if (inputParams?.length > 0) {
    res = '{\n';
    for (let inputParam of inputParams) {
      let { fieldName, fieldRequired, fieldType, children, subFieldType, mapKeyType, mapValueType } = inputParam;
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
            mapValueRes = `${paramToTs(children as RequestArg[])}[]`;
          }
        } else if (mapValueType === TypeCode.Object) {
          mapValueRes = paramToTs(children as RequestArg[]);
        }
        res += `${fieldName}${fieldRequired ? '' : '?'}:Map<${typeMap[mapKeyType]},${mapValueRes}>;\n`;
      } else if (fieldType === TypeCode.Object) {
        //对象
        res += `${fieldName}:${paramToTs(children as RequestArg[])};`;
      } else {
        // 数组
        if (subFieldType === TypeCode.Number || subFieldType === TypeCode.String || subFieldType === TypeCode.Boolean) {
          // 数组值类型为number string boolean
          res += `${fieldName}:${typeMap[subFieldType]}[];`;
        } else if (subFieldType === TypeCode.Object) {
          // 数组值类型为对象
          res += `${fieldName}:${paramToTs(children as RequestArg[])}[];`;
        }
      }
    }
    res += '}';
  }
  return res;
};
//处理入参
const processInputParams = (inputParams: RequestArg[], isRequired: boolean) => {
  let tsRes = paramToTs(inputParams);
  let res = '';
  if (tsRes) {
    res = `data${isRequired ? '' : '?'}:${tsRes},\noptions?: EventOptionsType`;
  }
  if (!res) {
    res = 'options?: EventOptionsType';
  }
  return res;
};

//处理出参，若为空，或者不为interface，置为void，否则处理掉interface前缀，输出{x:xxx}
const processOutputParams = (outputParams: ResponseArg[], isAsync: boolean) => {
  let tsRes = paramToTs(outputParams as RequestArg[]);
  let res = 'void';
  if (tsRes) {
    res = tsRes;
  }
  if (isAsync) {
    res = `Promise<${res}>`;
  } else {
    res = `${res} | ErrorResponse`;
  }
  return res;
};

// max:any的匹配正则,如果匹配到，any替换成Max。
export const maxAnyTsReg = /max\s*:\s*any;/;
// 要加入的字符串max：Max；
export const maxMaxTsStr = '\nmax: Max;\n';
export const monaPluginEventsReg = /export\s+interface\s+MonaPluginEvents\s*\{/;
// export interface Max匹配正则
export const interfaceMaxReg = /export\s+interface\s+Max\s*\{[\s\S]*\}/;

// 将ts代码写到type.d.ts中
const writeCodeToFile = (eventsTsFilePath: string, code: string) => {
  readFile(eventsTsFilePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    //看是否有max:any; 如果有替换成max: Max;
    const maxAnyTsMatchRes = data.match(maxAnyTsReg);
    if (maxAnyTsMatchRes?.index) {
      data =
        data.substring(0, maxAnyTsMatchRes.index) +
        maxMaxTsStr +
        data.substring(maxAnyTsMatchRes.index + maxAnyTsMatchRes[0].length);
    }

    //然后添加interface Max,添加到最后
    const interfaceMaxMatchRes = data.match(interfaceMaxReg);
    //如果之前添加过，删除再添加最新的api
    if (interfaceMaxMatchRes) {
      data = data.substring(0, interfaceMaxMatchRes.index) + code;
    } else {
      //如果之前没添加过，直接添加
      data = data + code;
    }
    //最后将data写入到events.d.ts中
    writeFile(eventsTsFilePath, data, 'utf8', err => {
      if (err) {
        throw err;
      }
      console.log('api ts has been pulled');
    });
  });
};
