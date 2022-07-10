import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import FormData from 'form-data';
import { OPEN_DOMAIN, OPEN_DEV_HEADERS } from '@bytedance/mona-shared';
import assert from 'assert';
import { PluginContext } from '..';

const homePath = (process.env.HOME ? process.env.HOME : process.env.USERPROFILE) || __dirname;
const userDataFile = path.join(homePath, '.mona_user');

export function deleteUser() {
  if (fs.existsSync(userDataFile)) {
    fs.unlinkSync(userDataFile);
  }
}

export function readUser(): { cookie: string, nickName: string, userId: string } | null {
  try {
    const str = fs.readFileSync(userDataFile);
    const result = str ? JSON.parse(str.toString()) : null;
    if (result && result.cookie && result.nickName && result.userId) {
      return result;
    }
  } catch(_) {
    // do nothing
  }
  return null;
}

export function saveUser(data: any) {
  fs.writeFileSync(userDataFile, JSON.stringify(data));
}

export function generateRequestFromOpen(args: any, cookie: string) {
  return function<T = any>(path: string, options?: AxiosRequestConfig<any>): Promise<T> {
    const domain = args.domain || OPEN_DOMAIN;
    const header = args.header ? JSON.parse(args.header) : OPEN_DEV_HEADERS;
    const url = `https://${domain}${path}`;

    const config = {
      url,
      ...options,
      headers: {
        cookie,
        'Content-Type': 'application/json',
        ...options?.headers,
        ...header,
      }
    }

    return axios.request(config)
      .then(res => {
        // console.log('res', res);
        const data = res.data as any;
        if (data.code === 0) {
          return data.data;
        } else {
          throw new Error(data.message || '未知错误');
        }
      })
  }
};

export interface FileType {
  mime?: string;
  fileName?: string;
  filePath: string;
}

function isString(value: string | FileType): value is string {
  return typeof value === 'string';
}

export async function createUploadForm(params: Record<string, string | FileType>) {
   const form = new FormData();
   Object.keys(params).forEach(key => {
      const value = params[key];
      if (isString(value)) {
        form.append(key, value);
      } else {
        form.append(key, fs.createReadStream(value.filePath), {
          contentType: value.mime || 'application/zip',
          filename: value.fileName || 'tempFileName'
        })
      }
   })

   // 获取内容length
    const length: number = await new Promise((resolve, reject) => {
      form.getLength((err, length) => {
        if (err) {
          reject(err);
        } else {
          resolve(length);
        }
      });
    });
    const headers = form.getHeaders();

    const requestOptions: AxiosRequestConfig<FormData> = {
      responseType: 'json',
      headers: {
        'Content-Type': headers['content-type'],
        'Content-Length': length,
      },
    }

    return { form, requestOptions }
}

export async function requestBeforeCheck(ctx: PluginContext, args: Record<string, string>) {
  const appId = ctx.configHelper?.projectConfig.appId;

  console.log(chalk.yellow(`请确保在项目根目录使用该命令`));
  assert(appId, '未在mona.config中指定appId，请在抖店开放平台应用详情页查看应用APP_Key');
  assert(typeof appId === 'string', 'appId应该为字符串');

  // ensure login
  const user = readUser();
  assert(user, `未登录，请使用 mona login 进行登录`);

  const request = generateRequestFromOpen(args, user.cookie);
  // ensure user status is not expired
  try {
    console.log(chalk.cyan(`检查当前登录态...`));
    await request('/captain/user/login/info')
    console.log(chalk.cyan(`当前用户：${user.nickName}`));
  } catch(err) {
    deleteUser();
    throw new Error('登录态已过期，请使用mona login重新登录')
  }
  

  return { user, appId }
}