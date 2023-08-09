import { genRequest } from '@bytedance/mona-shared';
import fs from 'fs';
import path from 'path';

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
  const request = genRequest({});
  const getlightApiListUrl = '/captain/light/isv/interface/list';
  const res = await request(getlightApiListUrl, { data: { appId } });
  return res;
};
