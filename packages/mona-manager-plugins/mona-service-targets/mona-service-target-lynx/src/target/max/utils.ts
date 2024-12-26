import axios, { AxiosRequestConfig } from 'axios';
import { OPEN_DOMAIN, OPEN_DEV_HEADERS, readUser, deleteUser } from '@bytedance/mona-shared';
import chalk from 'chalk';
import assert from 'assert';

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

export async function requestBeforeCheck(ctx: any, args: Record<string, string>) {
  const appId = ctx.configHelper?.projectConfig.appId;

  console.log(chalk.yellow(`请确保在项目根目录使用该命令`));
  assert(appId, `未在mona.config中指定appId，请在抖店开放平台应用详情页查看应用APP_Key`);
  assert(typeof appId === 'string', 'appId应该为字符串');
  assert(/^\d{19}$/.test(appId), 'appId应该为字符串');


  // ensure login
  const user = readUser();
  assert(user, `未登录，请使用 mona login 进行登录`);

  const request = generateRequestFromOpen(args, user.cookie);
  // ensure user status is not expired
  try {
    console.log(chalk.cyan(`检查当前登录态...`));
    await request('/captain/user/login/info');
    console.log(chalk.cyan(`当前用户：${user.nickName}`));
  } catch (err) {
    deleteUser();
    throw new Error('登录态已过期，请使用mona login重新登录');
  }

  return { user, appId };
}