import { writeFile, readFile } from 'fs';
import path from 'path';
import { getLightApiList, InterfaceDetailForLight, InterfaceMetaReqInfo, InterfaceMetaResInfo, TypeCode } from './util';

class LightApiPlugin {
  appid: string;
  constructor(appid: string) {
    this.appid = appid;
  }
  apply(compiler: any) {
    compiler.hooks.compile.tap('LightApiPlugin', async () => {
      try {
        const res = await getLightApiList(this.appid);
        let { testEnvInterfaceList } = res;
        if (testEnvInterfaceList.length > 0) {
          const code = generateTsCode(testEnvInterfaceList);
          // 需要生成的lightApi声明文件
          const lightApiTsFilePath = path.join(require.resolve('@bytedance/mona-client-web'), '../apis/lightApi.d.ts');
          const apiTsFilePath = path.join(require.resolve('@bytedance/mona-client-web'), '../apis/api.d.ts');
          // 将生成的声明code，写入到lightApiTsFilePath声明文件中,
          writeLightApiTsFile(lightApiTsFilePath, code);
          // 更改api.d.ts ，添加import { LightRequest } from './lightApi';
          //export declare const request: BaseApis['request'];===>export declare const request: LightRequest;
          writeApiTsFile(apiTsFilePath);
          console.log('api has been pulled');
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}
export const generateTsCode = (interfaceList: InterfaceDetailForLight[]) => {
  let code = 'export interface RequestArgs {';
  interfaceList.forEach(api => {
    const { interfaceName, requestInfo } = api;
    const processedReqParams = paramToTs(requestInfo);
    code += `\n${interfaceName}:${processedReqParams};`;
  });
  code += '\n}\nexport interface ResponseArgs{';
  interfaceList.forEach(api => {
    const { interfaceName, responseInfo } = api;
    const processedResParams = paramToTs(responseInfo);
    code += `\n${interfaceName}:${processedResParams};`;
  });
  code += `}\nexport declare type LightRequest = <T extends keyof RequestsArgs>(input: {\nfn: T;\ndata?: RequestsArgs[T];\n}) => Promise<ResPonsesArgs[T]>;`;
  return code;
};

const typeMap: { [key: number]: string } = {
  [TypeCode.Int64Number]: 'number',
  [TypeCode.Int16Number]: 'number',
  [TypeCode.Int32Number]: 'number',
  [TypeCode.DoubleNumber]: 'number',
  [TypeCode.String]: 'string',
  [TypeCode.Boolean]: 'boolean',
};

const paramToTs = (params: (InterfaceMetaReqInfo | InterfaceMetaResInfo)[], isFirstLevel: boolean = true) => {
  let res = '';
  for (let param of params) {
    const { type, subType, children, mapKeyType, mapValueType, mapValueSubType } = param;
    let paramName = '';
    let mustNeed = true;
    if ('requestName' in param) {
      paramName = param.requestName;
      mustNeed = param.mustNeed;
    } else {
      paramName = param.responseName;
    }
    if (
      type === TypeCode.Int64Number ||
      type === TypeCode.Int16Number ||
      type === TypeCode.Int32Number ||
      type === TypeCode.DoubleNumber ||
      type === TypeCode.String ||
      type === TypeCode.Boolean
    ) {
      // 如果类型是number/string/boolean类型，直接返回相应类型
      if (isFirstLevel) {
        res += typeMap[type];
      } else {
        res += `${paramName}${mustNeed ? '' : '?'}:${typeMap[type]};\n`;
      }
    } else if (type === TypeCode.Map) {
      //如果类型是映射Map,key只能是number或string。value可以是除了map的所有类型
      let mapValueRes = '';
      if (
        mapValueType === TypeCode.Int64Number ||
        mapValueType === TypeCode.Int16Number ||
        mapValueType === TypeCode.Int32Number ||
        mapValueType === TypeCode.DoubleNumber ||
        mapValueType === TypeCode.String ||
        mapValueType === TypeCode.Boolean
      ) {
        //mapvalue是number/string/boolean
        mapValueRes = typeMap[mapValueType];
      } else if (mapValueType === TypeCode.Array) {
        // mapvalue是array
        if (
          mapValueSubType === TypeCode.Int64Number ||
          mapValueSubType === TypeCode.Int16Number ||
          mapValueSubType === TypeCode.Int32Number ||
          mapValueSubType === TypeCode.DoubleNumber ||
          mapValueSubType === TypeCode.String ||
          mapValueSubType === TypeCode.Boolean
        ) {
          // mapvalue数组值类型为number string boolean
          mapValueRes = `${typeMap[mapValueSubType]}[]`;
        } else if (mapValueSubType === TypeCode.Object) {
          // mapvalue数组值类型为对象
          mapValueRes = `{${paramToTs(children, false)}}[]`;
        }
      } else if (mapValueType === TypeCode.Object) {
        //mapvalue是object
        mapValueRes = `{${paramToTs(children, false)}}`;
      }
      if (isFirstLevel) {
        res += `Map<${typeMap[mapKeyType]},${mapValueRes}>`;
      } else {
        res += `${paramName}${mustNeed ? '' : '?'}:Map<${typeMap[mapKeyType]},${mapValueRes}>;\n`;
      }
    } else if (type === TypeCode.Object) {
      //如果类型是对象
      if (isFirstLevel) {
        res += `{
          ${paramToTs(children, false)}
        }`;
      } else {
        res += `${paramName}${mustNeed ? '' : '?'}:${paramToTs(children, false)};`;
      }
    } else {
      //如果类型是数组
      let arrTypeRes = '';
      if (
        subType === TypeCode.Int64Number ||
        subType === TypeCode.Int16Number ||
        subType === TypeCode.Int32Number ||
        subType === TypeCode.DoubleNumber ||
        subType === TypeCode.String ||
        subType === TypeCode.Boolean
      ) {
        // 数组值类型为number string boolean
        arrTypeRes = `${typeMap[subType]}[]`;
      } else if (subType === TypeCode.Object) {
        // 数组值类型为对象
        arrTypeRes = `{${paramToTs(children, false)}}[]`;
      }
      if (isFirstLevel) {
        res += arrTypeRes;
      } else {
        res += `${paramName}${mustNeed ? '' : '?'}:${arrTypeRes};`;
      }
    }
  }
  return res;
};

const writeLightApiTsFile = (lightApiTsFilePath: string, code: string) => {
  writeFile(lightApiTsFilePath, code, 'utf8', err => {
    if (err) {
      throw err;
    }
  });
};
const writeApiTsFile = (lightApiTsFilePath: string) => {
  readFile(lightApiTsFilePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    //看是否有export declare const request: BaseApis['request'];如果有替换成export declare const request: LightRequest
    data = data.replace("BaseApis['request']", 'LightRequest');

    data = `import { LightRequest } from './lightApi';\n${data}`;
    //最后将data写入到events.d.ts中
    writeFile(lightApiTsFilePath, data, 'utf8', err => {
      if (err) {
        throw err;
      }
    });
  });
};

export default LightApiPlugin;
