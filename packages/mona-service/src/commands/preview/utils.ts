import QRCode from 'qrcode';
import chokidar from 'chokidar';
import open from 'open';
import PluginContext from '@/PluginContext';
import { execSync } from 'child_process';
import { compressDistDir } from '../compress/utils';
import { createUploadForm, FileType } from '../common';
import { AxiosRequestConfig } from 'axios';
import path from 'path';
import fs from 'fs';
import os from 'os';
import chalk from 'chalk';
import { DEFAULT_PORT } from '@/target/constants';

const isWin = os.platform() === 'win32';
type Request<T = any> = (path: string, options?: AxiosRequestConfig<any>) => Promise<T>;

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
export const pipe =
  (...funcs: Function[]) =>
  (input?: any) =>
    funcs.reduce((prev, cur) => (i: any) => {
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
    console.log(`watching ${dir}`);
    let timer: NodeJS.Timeout | null = null;
    chokidar.watch(dir).on('all', () => {
      // debounce
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        console.clear();
        console.log('reprocess');
        callback();
      }, 500);
    });
  } else {
    callback();
  }
}

export const createTestVersionFactory =
  (request: Request<CreateTestAppVersionResp>) => async (params: Record<string, string | FileType>) => {
    const { form, requestOptions } = await createUploadForm(params);
    const res = await request('/captain/app/version/test/create', {
      method: 'POST',
      data: form,
      ...requestOptions,
    });

    return { appId: params.appId, version: res.version };
  };

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

  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

export function printQrcode(appName: string = '抖音') {
  return (params: { qrcode: string; expireTime: number }) => {
    console.log(params.qrcode);
    console.log(
      chalk.yellow(`二维码 ${getFormatedExpireTime(params.expireTime)} 到期，请尽快使用${appName}进行扫码预览！`),
    );
  };
}

export const generateQrcodeFactory =
  (request: Request<GetDynamicTestUrlResp>) => async (params: { appId: string; version: string }) => {
    const res = await request('/captain/app/version/getDynamicTestUrl', {
      method: 'GET',
      params: {
        ...params,
        previewScene: 2,
      },
    });

    const preViewCodeUrl = `aweme://goods/store?sec_shop_id=${res?.secShopId}&token=${res?.token}&tmp_id=${res?.tmpId}&enter_from=scan&entrance_location=scan&pass_through_api=%7B%22isJump%22%3A1%7D`;
    const qrcode = await new Promise((resolve, reject) => {
      // @ts-ignore
      // qrcode render failed in windows terminal when options with small: true
      QRCode.toString(preViewCodeUrl, { type: 'terminal', small: !isWin }, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });

    return { qrcode, expireTime: res.expireTime };
  };

export function buildMaxComponent(ctx: PluginContext) {
  console.log('build');
  execSync(`mona-service build -t max`, {});
  return ctx;
}

// process max component data
export async function processMaxComponentData(ctx: PluginContext) {
  const helper = ctx.configHelper || ctx.builder?.configHelper;
  const { appId = '', output } = helper.projectConfig;

  // compress
  const filePath = await compressDistDir(output);

  // read value from preview.json
  const componentValuePath = path.join(helper.cwd, 'src/preview.json');
  const componentAppDefaultValue = fs.readFileSync(componentValuePath).toString();

  return {
    appId,
    testFile: {
      filePath,
    },
    componentAppDefaultValue,
  };
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
    templateAppDefaultValue,
  };
}

export function getPlatform(params: { ctx: PluginContext; args: Record<string, string> }) {
  const { ctx, args } = params;
  // judge env
  const result = (args.domain || '').match(/^[^\.]+(\.[^\.]+\.[^\.]+)/);
  const isTest = result && result[1] !== '.jinritemai.com';
  const platformUrlMap: Record<string, string> = isTest
    ? {
        compass: `https://ecom-compass-boe${result[1]}/shop/search-analysis`,
      }
    : {
        compass: 'https://compass.jinritemai.com/shop/search-analysis',
      };
  return {
    platform: Object.keys(platformUrlMap).indexOf(args.platform) !== -1 ? args.platform : 'compass',
    ctx,
    platformUrlMap,
  };
}

export function getUrl(params: { ctx: PluginContext; platform: string; platformUrlMap: Record<string, string> }) {
  const { ctx, platform, platformUrlMap } = params;
  const url = platformUrlMap[platform];

  const config = ctx.configHelper.projectConfig;
  const port = config.dev?.port || DEFAULT_PORT;
  const appId = config.appId;
  const query = `?isLightPreview=true&appId=${appId}&port=${port}`;
  return `${url}${query}`;
}

export function buildProject(_target: string) {
  return (ctx: PluginContext) => {
    console.log('build');
    execSync(`yarn build`, {});

    // execSync(`mona-service build -t ${target ?? 'h5'} `, {});
    return ctx;
  };
}
export const generateH5Qrcode = async (params: { appId: string; version: string }) => {
  const preViewCodeUrl = `https://op.jinritemai.com/ecom-app/h5?appId=${params?.appId}&version=${params?.version}&isPreview=true`;
  const qrcode = await new Promise((resolve, reject) => {
    // @ts-ignore
    // qrcode render failed in windows terminal when options with small: true
    QRCode.toString(preViewCodeUrl, { type: 'terminal', small: !isWin }, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });

  return { qrcode, expireTime: Date.now() / 1000 + 8 * 60 * 60 };
};

// process max component data
export async function processProjectData(ctx: PluginContext) {
  const helper = ctx?.configHelper || ctx.builder?.configHelper;

  const { appId = '', output } = helper.projectConfig;

  // compress
  const filePath = await compressDistDir(output);

  return {
    appId,
    testFile: {
      filePath,
    },
  };
}

export function openUrlWithBrowser(url: string) {
  console.log(chalk.cyan(`打开 ${url}`));
  open(url);
}
