import { writeFile } from 'fs';
import path from 'path';
import { getMiniJsApiList, JsApi, TypeCode, RequestArg } from './util';

class miniJsApiPlugin {
  constructor() {}
  apply(compiler: any) {
    compiler.hooks.compile.tap('miniJsApiPlugin', async () => {
      try {
        const res = await getMiniJsApiList();
        let { jsApiList } = res;
        if (jsApiList.length > 0) {
          const code = generateTsCode(jsApiList);
          // 需要修改的声明文件
          const apiTsFilePath = path.join(require.resolve('@bytedance/mona-client-web'), '../apis/specApi.d.ts');
          // 将生成的声明code，写入到lightApiTsFilePath声明文件中,
          writeMiniJsApiTsFile(apiTsFilePath, code);
          console.log('api has been pulled');
        }
      } catch (err: any) {
        console.warn(err?.message);
      }
    });
  }
}
const typeMap: { [key: string]: string } = {
  [TypeCode.Number]: 'number',
  [TypeCode.String]: 'string',
  [TypeCode.Boolean]: 'boolean',
};
export const generateTsCode = (jsApiList: JsApi[]) => {
  let code = 'export interface Mini {';
  jsApiList.forEach(api => {
    const { jsApiName, requestArgJson, responseArgJson, isRequestRequired, isAsync } = api;
    const inputParamsTs = paramToTs(requestArgJson);
    const outputParamTs = paramToTs(responseArgJson as RequestArg[]);
    if (isAsync) {
      code += `\n${jsApiName}:PromisifyReturn<(options${isRequestRequired ? '' : '?'}:${
        inputParamsTs ? inputParamsTs + ' & ' : ''
      }Callbacks<${outputParamTs ? outputParamTs + ' & ' : ''}CommonErrorArgs,CommonExtendsErrorArgs>)=>void>;`;
    } else {
      code += `\n${jsApiName}:(${inputParamsTs ? `options:${isRequestRequired ? '' : '?'}:${inputParamsTs}` : ''})=>${
        outputParamTs ? outputParamTs : 'void'
      }`;
    }
  });
  code += '\n}';
  return code;
};

//递归根据入参json以及是否必传结构生成ts
const paramToTs = (inputParams: RequestArg[]) => {
  let res = '';
  if (inputParams?.length > 0) {
    res = '{\n';
    for (let inputParam of inputParams) {
      let { fieldName, isRequired, fieldType, children, subFieldType, mapKeyType, mapValueType } = inputParam;
      if (fieldType === TypeCode.Number || fieldType === TypeCode.String || fieldType === TypeCode.Boolean) {
        // 如果类型是number、string或者boolean
        res += `${fieldName}${isRequired ? '' : '?'}:${typeMap[fieldType]};\n`;
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
        res += `${fieldName}${isRequired ? '' : '?'}:Map<${typeMap[mapKeyType]},${mapValueRes}>;\n`;
      } else if (fieldType === TypeCode.Object) {
        //对象
        res += `${fieldName}${isRequired ? '' : '?'}:${paramToTs(children as RequestArg[])};`;
      } else {
        // 数组
        if (subFieldType === TypeCode.Number || subFieldType === TypeCode.String || subFieldType === TypeCode.Boolean) {
          // 数组值类型为number string boolean
          res += `${fieldName}${isRequired ? '' : '?'}:${typeMap[subFieldType]}[];`;
        } else if (subFieldType === TypeCode.Object) {
          // 数组值类型为对象
          res += `${fieldName}${isRequired ? '' : '?'}:${paramToTs(children as RequestArg[])}[];`;
        }
      }
    }
    res += '}';
  }
  return res;
};

const writeMiniJsApiTsFile = (miniJsApiTsFilePath: string, code: string) => {
  const newCode = `import {PromisifyReturn,Callbacks,CommonErrorArgs,CommonExtendsErrorArgs} from '@bytedance/mona'\nexport declare const mini: Mini;\n${code}`;
  writeFile(miniJsApiTsFilePath, newCode, 'utf8', err => {
    if (err) {
      throw err;
    }
  });
};

export default miniJsApiPlugin;
