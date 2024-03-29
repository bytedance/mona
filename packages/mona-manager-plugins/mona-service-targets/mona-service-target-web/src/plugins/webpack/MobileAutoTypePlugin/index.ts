import { writeFile, readFile } from 'fs';
import path from 'path';
import { JsApi, RequestArg, ResponseArg, getJsApiList } from './util';

class MobileAutoTypePlugin {
  constructor() {}
  apply(compiler: any) {
    compiler.hooks.compile.tap('MobileAutoTypePlugin', async () => {
      try {
        const res = await getJsApiList();
        let {
          data: { jsApiList },
        } = res;
        if (jsApiList.length > 0) {
          const code = generateTsCode(jsApiList);
          // events声明文件
          const eventsTsFilePath = path.join(require.resolve('@bytedance/mona-client-web'), '../apis/specApi.d.ts');
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
  let code = 'export interface App {';
  jsApiList.forEach(api => {
    const { jsApiName, requestArgJson, responseArgJson, isRequestRequired = false, isAsync, jsApiDesc } = api;
    const processedInputParams = processInputParams({
      inputParams: requestArgJson,
      isRequired: isRequestRequired,
      isMultiParams: jsApiName.startsWith('on'),
    });
    const processedOutputParams = processOutputParams(responseArgJson, isAsync);
    code += `\n/**\n${jsApiDesc}*/\n${jsApiName}:(${processedInputParams})=>${processedOutputParams};`;
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
  Function = 10,
}
const typeMap: { [key: string]: string } = {
  [TypeCode.Number]: 'number',
  [TypeCode.String]: 'string',
  [TypeCode.Boolean]: 'boolean',
  [TypeCode.Function]: 'Function',
};
//递归根据入参json以及是否必传结构生成ts
const paramToTs = (inputParams: RequestArg[], multi: boolean = false) => {
  let res = '';
  if (inputParams?.length > 0) {
    if (!multi) {
      res = '{\n';
    }
    for (let inputParam of inputParams) {
      let { fieldName, isRequired, fieldType, children, subFieldType, mapKeyType, mapValueType } = inputParam;
      if (typeMap[fieldType]) {
        // 如果类型是number、string、boolean、Function
        res += `${fieldName}${isRequired ? '' : '?'}:${typeMap[fieldType]}${multi ? ',' : ';'}\n`;
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
        res += `${fieldName}${isRequired ? '' : '?'}:Map<${typeMap[mapKeyType]},${mapValueRes}>${multi ? ',' : ''}\n`;
      } else if (fieldType === TypeCode.Object) {
        //对象
        res += `${fieldName}${isRequired ? '' : '?'}:${paramToTs(children as RequestArg[])}${multi ? ',' : ''}`;
      } else {
        // 数组
        if (subFieldType === TypeCode.Number || subFieldType === TypeCode.String || subFieldType === TypeCode.Boolean) {
          // 数组值类型为number string boolean
          res += `${fieldName}${isRequired ? '' : '?'}:${typeMap[subFieldType]}[]${multi ? ',' : ''}`;
        } else if (subFieldType === TypeCode.Object) {
          // 数组值类型为对象
          res += `${fieldName}${isRequired ? '' : '?'}:${paramToTs(children as RequestArg[])}[]${multi ? ',' : ''}`;
        }
      }
    }
    if (!multi) {
      res += '}';
    }
  }
  return res;
};
//处理入参
const processInputParams = ({
  inputParams,
  isRequired,
  isMultiParams = false,
}: {
  inputParams: RequestArg[];
  isRequired: boolean;
  isMultiParams: boolean;
}) => {
  let tsRes = '';

  if (isMultiParams) {
    const res = paramToTs(inputParams, true);
    tsRes += inputParams ? res : '';
  } else {
    const res = paramToTs(inputParams);
    tsRes = inputParams ? `data${isRequired ? '' : '?'}:${res}` : '';
  }
  // let res = '';
  // if (tsRes) {
  //   res = `${tsRes}\noptions?: EventOptionsType`;
  // }
  // if (!res) {
  //   res = 'options?: EventOptionsType';
  // }
  return tsRes;
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
    res = `${res}`;
  }
  return res;
};

// max:any的匹配正则,如果匹配到，any替换成Max。
export const maxAnyTsReg = /app\s*:\s*any;/;
// 要加入的字符串max：Max；
export const maxMaxTsStr = '\napp: App;\n';
// export interface Max匹配正则
export const interfaceMaxReg = /export\s+interface\s+App\s*\{[\s\S]*\}/;

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

export default MobileAutoTypePlugin;
