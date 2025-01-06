import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import path from 'path';
import { OPEN_DOMAIN, OPEN_DEV_HEADERS } from '@bytedance/mona-shared';

const homePath = (process.env.HOME ? process.env.HOME : process.env.USERPROFILE) || __dirname;
const userDataFile = path.join(homePath, '.mona_user');

export function deleteUser() {
  if (fs.existsSync(userDataFile)) {
    fs.unlinkSync(userDataFile);
  }
}
export function readUser(): { cookie: string; nickName: string; userId: string } | null {
  try {
    const str = fs.readFileSync(userDataFile);
    const result = str ? JSON.parse(str.toString()) : null;
    if (result && result.cookie && result.nickName && result.userId) {
      return result;
    }
  } catch (_) {
    // do nothing
  }
  return null;
}

function parseHeaders(headers: string) {
  const result: Record<string, string> = {};
  const lines = headers.split(';');
  lines.forEach(line => {
    const [key, value] = line.split('=');
    result[key.trim()] = value.trim();
  });
  return result;
}

export function generateRequestFromOpen(args: any, cookie: string) {
  return function <T = any>(path: string, options?: AxiosRequestConfig<any>): Promise<T> {
    const domain = args.domain || OPEN_DOMAIN;
    const header = args.headers ? parseHeaders(args.headers) : OPEN_DEV_HEADERS;
    const url = `https://${domain}${path}`;

    const config = {
      url,
      ...options,
      headers: {
        cookie,
        'Content-Type': 'application/json',
        ...options?.headers,
        ...header,
      },
    };

    return axios.request(config).then(res => {
      const data = res.data as any;
      if (data.code === 0) {
        if (args.debug) {
          console.log(` [path: ${path}, logid:${res?.headers?.['x-tt-logid'] || 'unknow'}] `)
        }
        return data.data;
      } else {
        throw new Error(
          (data.message || '未知错误') +
            (args.debug ? ` [path: ${path}, logid:${res?.headers?.['x-tt-logid'] || 'unknow'}] ` : ''),
        );
      }
    });
  };
}

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

export const getLightApiList: (appId: string) => Promise<InterfaceListForLight['data']> = async appId => {
  const user = readUser();
  if (!user) {
    throw new Error('请使用mona login登录以获取微应用后端代码提示～');
  }
  const request = generateRequestFromOpen({}, user.cookie);
  const getlightApiListUrl = '/captain/light/isv/interface/list';
  const res = await request(getlightApiListUrl, { data: { appId } });
  return res;
};
