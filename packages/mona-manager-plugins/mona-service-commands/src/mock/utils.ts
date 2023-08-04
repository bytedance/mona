import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import http from 'http';

export const enum TypeCode {
  Int64Number = 1,
  String = 2,
  Array = 3,
  Boolean = 4,
  Object = 5,
  Int16Number = 6,
  Int32Number = 7,
  Map = 8,
  DoubleNumber = 9,
}
export interface InterfaceMetaReqInfo {
  requestName: string;
  mustNeed: boolean;
  type: TypeCode;
  subType: TypeCode;
  children: InterfaceMetaReqInfo[];
  mapKeyType: TypeCode;
  mapValueType: TypeCode;
  mapValueSubType: TypeCode;
}
export interface InterfaceMetaResInfo {
  responseName: string;
  type: TypeCode;
  subType: TypeCode;
  children: InterfaceMetaResInfo[];
  mapKeyType: TypeCode;
  mapValueType: TypeCode;
  mapValueSubType: TypeCode;
}
export interface InterfaceDetailForLight {
  interfaceId: number;
  interfaceName: string;
  desc: string;
  show: boolean;
  status: number;
  requestInfo: InterfaceMetaReqInfo[];
  responseInfo: InterfaceMetaResInfo[];
  psm: string;
  methodName: string;
}
export interface InterfaceListForLight {
  code: number;
  data: {
    testEnvInterfaceList: InterfaceDetailForLight[];
  };
}


const typeToData = (params: (InterfaceMetaReqInfo | InterfaceMetaResInfo)[]) => {
  let res: Record<string, any> = {};
  params = params || [];
  for (let param of params) {
    const { type, subType, children, mapValueType, mapValueSubType } = param;
    let paramName = '';
    console.log(param);
    if ('requestName' in param) {
      paramName = param.requestName;
    } else {
      paramName = param.responseName;
    }

    const isBaseType = (type: TypeCode) => [
      TypeCode.Int64Number,
      TypeCode.Int16Number,
      TypeCode.Int32Number,
      TypeCode.DoubleNumber,
      TypeCode.String,
      TypeCode.Boolean,
    ].includes(type);

    const randomLength = () => Math.random() * 10 + 1;;

    const genBaseType = (currentType: TypeCode) => {
      switch(currentType) {
        case TypeCode.Int64Number:
        case TypeCode.Int16Number:
        case TypeCode.Int32Number:
          return faker.number.int();
        case TypeCode.DoubleNumber:
          return faker.number.float();
        case TypeCode.String:
          return faker.string.alpha(10);
        case TypeCode.Boolean:
          return faker.datatype.boolean();
        default:
          return null;
      }
    }


    if (isBaseType(type)) {
      res[paramName] = genBaseType(type);
    } else if (type === TypeCode.Object) {
      res[paramName] = typeToData(children);
    } else if (type === TypeCode.Array) {
      if (isBaseType(subType)) {
        res[paramName] = Array.from({ length: randomLength() }, () => genBaseType(subType));
      } else if (subType === TypeCode.Object) {
        res[paramName] = Array.from({ length: randomLength() }, () => typeToData(children));
      } else {
        res[paramName] = [];
      }
    } else if (type === TypeCode.Map) {
      if (isBaseType(mapValueType)) {
        const count = randomLength();
        const tempRes: Record<string, any> = {};
        for (let i = 0; i < count; i++) {
          tempRes[faker.string.alpha(10)] = genBaseType(mapValueType);
        }
        res[paramName] = tempRes;
      } else if (mapValueType === TypeCode.Object) {
        const count = randomLength();
        const tempRes: Record<string, any> = {};
        for (let i = 0; i < count; i++) {
          tempRes[faker.string.alpha(10)] = typeToData(children);
        }
        res[paramName] = tempRes;
      } else if (mapValueType === TypeCode.Array) {
        const count = randomLength();
        const tempRes: Record<string, any> = {};
        for (let i = 0; i < count; i++) {
          if (isBaseType(mapValueSubType)) {
            tempRes[faker.string.alpha(10)] = Array.from({ length: randomLength() }, () => genBaseType(subType));
          } else if (mapValueSubType === TypeCode.Object) {
            tempRes[faker.string.alpha(10)] = Array.from({ length: randomLength() }, () => typeToData(children));
          } else {
            tempRes[faker.string.alpha(10)] = [];
          }
        }
        res[paramName] = tempRes;
      }
    } else {
      res[paramName] = null;
    }
  }
  return res;
};

// 生成mock json数据，格式为:
// { "name": "xxxx", "desc": "xxxx", "data": "xxxx" }
export function generateMockData(res: InterfaceListForLight['data']) {
  const { testEnvInterfaceList: interfaceList } = res;
  let result: Record<string, any> = {};
  interfaceList.forEach(api => {
    const { interfaceName, desc, responseInfo } = api;
    const processedReqParams = typeToData(responseInfo);
    result[interfaceName] = {
      name: interfaceName,
      desc: desc,
      data: processedReqParams
    }
  });
  return result;
}

export function writeDataFile(data: Record<string, any>, dataPath: string) {
  // 创建目录
  const dirPath = path.join(dataPath, '..');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

}

export function startMockServer(filePath: any) {

  console.log(filePath);
  const server = http.createServer((req, res) => {
    console.log('req', req);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, this is the home page!');
  })

    // 监听端口号
    const port = 9000;
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
}