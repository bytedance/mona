import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { generateRequestFromOpen, requestBeforeCheck } from '@/common';
import { PluginContext } from '@bytedance/mona-manager';
// import url from 'url';

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

function wrapData(data: any) {
  return JSON.stringify({
    "BaseResp": {
        "StatusCode": 0,
        "StatusMessage": ""
    },
    "BizError": {
        "code": 10000,
        "message": ""
    },
    "data": JSON.stringify(data)
  })
}

const possibleDomain = [
  'https://compass.jinritemai.com',
  'https://fxg.jinritemai.com',
  'https://fuwu.jinritemai.com'
]
export function startMockServer(filePath: string, port: number) {
  const server = http.createServer((req, res) => {
    const headers = req.headers;

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    })
    req.on('end', () => {
      console.log('body', body);
      let resData = {};
      if (req.method === 'POST') {
        const reqData = JSON.parse(body || '{"method":"test"}');
        const { method } = reqData;
        const rawData = fs.readFileSync(filePath).toString();
        const data = JSON.parse(rawData);
        resData = data[method]?.data || {};
      }
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      if (headers.origin && possibleDomain.includes(headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'x-open-token, x-open-compass, x-use-test, content-type')
      }
      
      res.end(wrapData(resData));
    })
  })

  server.listen(port, () => {
    console.log(`Mock server is running at http://localhost:${port}`);
  });
}

const URL = '/captain/light/isv/interface/list';
const DEFAULT_MOCK_CONFIG = { enabled: false, port: 9990, path: '/_light_api' }
export async function mock(ctx: PluginContext, args: Record<string, any>) {
  const { user, appId } = await requestBeforeCheck(ctx, args);
  const request = generateRequestFromOpen(args, user.cookie);

  // generate config
  const dev = ctx.configHelper.projectConfig.dev;
  const rawMock = ctx.configHelper.projectConfig.mock;
  const devPort = dev?.port === 'auto' ? DEFAULT_MOCK_CONFIG.port : dev?.port;
  const port = Number((args.port || devPort || DEFAULT_MOCK_CONFIG.port)) - 1;

  const config = typeof rawMock === 'boolean' ? Object.assign({}, DEFAULT_MOCK_CONFIG, { enabled: rawMock, port }) : Object.assign({}, DEFAULT_MOCK_CONFIG, { port }, rawMock);

  const abilities = ctx.configHelper.projectConfig.abilities;
  ctx.configHelper.projectConfig.abilities = { ...abilities, define: { ...abilities?.define }}

  if (!config.enabled) {
    return;
  }

  // 1. 获取IDL
  const res = await request(URL, { data: { appId } });
  // 2. 生成本地测试数据
  const data = await generateMockData(res);

  process.env.MOCK_URL = JSON.stringify(`http://localhost:${config.port}`);
  
  const dataPath = path.join(ctx.configHelper.cwd, 'mock', 'index.json');
  await writeDataFile(data, dataPath);
  // 3. 启动服务器
  await startMockServer(dataPath, config.port);
}