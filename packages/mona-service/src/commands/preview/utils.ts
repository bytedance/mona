
import QRCode from 'qrcode';
import chokidar from 'chokidar';
import PluginContext from '@/PluginContext';
import { execSync } from 'child_process';
import { compressDistDir } from "../compress/utils";
import { createUploadForm, FileType } from '../common';
import { AxiosRequestConfig } from 'axios';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

type Request<T = any> = (path: string, options?: AxiosRequestConfig<any>) => Promise<T>

interface GetDynamicTestUrlResp {
  secShopId: string;
  token: string;
  tmpId: string;
  expireTime: number;
}

interface CreateTestAppVersionResp {
  version: string;
  versionId: string;
}

// pipe func
export const pipe = (...funcs: Function[]) => (input?: any) => funcs.reduce((prev, cur) => (i: any) => {
  const res = prev(i);
  const isPromise = typeof res?.then === 'function';
  if (isPromise) {
    return res.then((r: any) => cur(r));
  } else {
    return cur(res);
  }
})(input);

// watch dir
export function watch(dir: string, options: { open: boolean }, callback: Function) {
  if (options.open) {
    console.log(`watching ${dir}`)
    let timer: NodeJS.Timeout | null = null
    chokidar.watch(dir).on('all', () => {
      // debounce
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        console.clear();
        console.log('reprocess');
        callback();
      }, 500)
    })
  } else {
    callback()
  }
}

export const createTestVersionFactory = (request: Request<CreateTestAppVersionResp>) => async (params: Record<string, string | FileType>) => {
  const { form, requestOptions } = await createUploadForm(params)
  const res = await request('/captain/app/version/test/create', {
    method: 'POST',
    data: form,
    ...requestOptions,
  })

  return { appId: params.appId, version: res.version };
}

function formatNumberToTwoDigit(number: number) {
  return `0${number}`.slice(-2);
}

export function getFormatedExpireTime(seconds: number) {
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const month = formatNumberToTwoDigit(date.getMonth() + 1);
  const day = formatNumberToTwoDigit(date.getDate());
  const hour = formatNumberToTwoDigit(date.getHours());
  const minute = formatNumberToTwoDigit(date.getMinutes());
  const second = formatNumberToTwoDigit(date.getSeconds());

  return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}

export function printQrcode(params: { qrcode: string, expireTime: number }) {
  console.log(params.qrcode);
  console.log(chalk.yellow(`二维码 ${getFormatedExpireTime(params.expireTime)} 到期，请尽快使用抖音进行扫码预览！`))
}


export const generateQrcodeFactory = (request: Request<GetDynamicTestUrlResp>) => async (params: { appId: string; version: string }) => {
    const res = await request('/captain/app/version/getDynamicTestUrl', {
      method: 'GET',
      params: {
        ...params,
        previewScene: 2
      }
    })

    const preViewCodeUrl = `aweme://goods/store?sec_shop_id=${res?.secShopId}&token=${res?.token}&tmp_id=${res?.tmpId}&enter_from=scan&entrance_location=scan&pass_through_api=%7B%22isJump%22%3A1%7D`;
    const qrcode = await new Promise((resolve, reject) => {
      // @ts-ignore
      QRCode.toString(preViewCodeUrl, { type: 'terminal', small: true }, (err, url) => {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    })

    return { qrcode, expireTime: res.expireTime }
}

export function buildMaxComponent(ctx: PluginContext) {
  console.log('build');
  execSync(`mona-service build -t max`, {});
  return ctx;
}

// process max component data
export async function processMaxComponentData(ctx: PluginContext) {
  const helper = ctx.configHelper;
  const { appId = '', output } = helper.projectConfig;

  // compress
  const filePath = await compressDistDir(output)

  // read value from preview.json
  const componentValuePath = path.join(helper.cwd, 'src/preview.json');
  const componentAppDefaultValue = fs.readFileSync(componentValuePath).toString();

  return {
    appId,
    testFile: {
      filePath,
    },
    componentAppDefaultValue,
  }
}

// process max template data
export async function processMaxTemplateData(ctx: PluginContext) {
  const helper = ctx.configHelper;
  const { appId = '' } = helper.projectConfig;

  // read value from preview.json
  const templateValuePath = path.join(helper.cwd, 'preview.json');
  const templateAppDefaultValue = fs.readFileSync(templateValuePath).toString();

  return {
    appId,
    templateAppDefaultValue
  }
}