import assert from 'assert';
import axios, { AxiosRequestConfig } from 'axios';
import { OPEN_DEV_HEADERS, OPEN_DOMAIN } from "./domain";
import { readUser } from './user';


export function genRequest(args: Record<string, any>) {
  const user = readUser();
  assert(user, `未登录，请使用 mona login 进行登录`);

  return function <T = any>(path: string, options?: AxiosRequestConfig<any>): Promise<T> {
    const domain = args.domain || OPEN_DOMAIN;
    const header = args.header ? JSON.parse(args.header) : OPEN_DEV_HEADERS;
    const url = `https://${domain}${path}`;

    const config = {
      url,
      ...options,
      headers: {
        cookie: user.cookie,
        'Content-Type': 'application/json',
        ...options?.headers,
        ...header,
      },
    };
    return axios.request(config).then(res => {
      const data = res.data as any;
      console.log((args.debug ? ` [path: ${path}, logid:${res?.headers?.['x-tt-logid'] || 'unknow'}] ` : ''));
      if (data.code === 0) {
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