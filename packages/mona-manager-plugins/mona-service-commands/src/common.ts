import assert from 'assert';
import { AxiosRequestConfig } from 'axios';
import chalk from 'chalk';
import fs from 'fs';
import FormData from 'form-data';

import { getConfigPath } from './util';
import { PluginContext } from '@bytedance/mona-manager';
import { genRequest } from '@bytedance/mona-shared';
import { readUser } from '@bytedance/mona-shared';
import { deleteUser } from '@bytedance/mona-shared';

export enum AppSceneTypeEnum {
  DESIGN_CENTER_TEMPLATE = 1,
  DESIGN_CENTER_COMPONENT = 2,
  LIGHT_APP = 3,
  H5 = 4,
  PIGEON_PLUGIN = 5,
}

export interface FileType {
  mime?: string;
  fileName?: string;
  filePath: string;
}

export async function createUploadForm(
  params: Record<string, string | number | FileType>,
  argsHeaders: Record<string, any>,
) {
  const form = new FormData();
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (typeof value !== 'object') {
      form.append(key, value);
    } else {
      form.append(key, fs.createReadStream(value.filePath), {
        contentType: value.mime || 'application/zip',
        filename: value.fileName || 'tempFileName',
      });
    }
  });

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
      ...argsHeaders,
      'Content-Type': headers['content-type'],
      'Content-Length': length,
    },
  };

  return { form, requestOptions };
}

export async function requestBeforeCheck(ctx: PluginContext, args: Record<string, string>) {
  const appId = ctx.configHelper?.projectConfig.appId;

  console.log(chalk.yellow(`请确保在项目根目录使用该命令`));
  assert(appId, `未在${getConfigPath()}中指定appId，请在抖店开放平台应用详情页查看应用APP_Key`);
  assert(typeof appId === 'string', 'appId应该为字符串');

  // ensure login
  const user = readUser();
  assert(user, `未登录，请使用 mona login 进行登录`);

  const request = genRequest(args);
  // ensure user status is not expired
  try {
    console.log(chalk.cyan(`检查当前登录态...`));
    await request('/captain/user/login/info');
    console.log(chalk.cyan(`当前用户：${user.nickName}`));
  } catch (err) {
    deleteUser();
    throw new Error('登录态已过期，请使用mona login重新登录');
  }

  return { user, appId, request };
}
