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
import { OPEN_DOMAIN } from '@bytedance/mona-shared';

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
  (request: Request<CreateTestAppVersionResp>, args: Record<string, any>) =>
  async (params: Record<string, string | FileType>) => {
    const argsHeaders = args.header ? JSON.parse(args.header) : {};
    const { form, requestOptions } = await createUploadForm(params, argsHeaders);
    const res = await request('/captain/app/version/test/create', {
      method: 'POST',
      data: form,
      ...requestOptions,
    });

    return { appId: params.appId, version: res.version, small: args.small };
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
  (request: Request<GetDynamicTestUrlResp>) => async (params: { appId: string; version: string, small?: boolean }) => {
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
      QRCode.toString(preViewCodeUrl, { type: 'terminal', small: params.small || !isWin }, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });

    return { qrcode, expireTime: res.expireTime };
  };

export function askMixedFactory(request: Request<any>) {
  return async function(ctx: PluginContext) {
    const appid = ctx.configHelper.projectConfig.appId;
    
    console.log(chalk.green(`拉取当前组件信息：${appid}`));
    // version detail
    const appDetail: any = await request('/captain/appManage/getAppDetail', {
      method: 'GET',
      params: { appId: appid },
    });
    const isOldApp = appDetail?.appExtend?.frameworkType !== 1;
    // judge whether is mixed
    const entry = ctx.configHelper.entryPath;
    const ext = path.extname(entry);
    const targetTTMLFile = entry.replace(ext, '') + '.ttml';
    const isMixed = fs.existsSync(targetTTMLFile);
    console.log(chalk.green(isMixed ? '当前为混排组件版本' : '当前为非混排组件版本'));
    const frameworkType = isOldApp ? (isMixed ? 1 : 0) : 1;
    return { frameworkType, ctx }
  }
}

export function buildMaxComponent(params: { ctx: PluginContext, frameworkType?: number }) {
  const cmd = `mona-service build -t max${params.frameworkType === 0 ? ' --old' : ''}`;
  console.log(chalk.green(`开始构建 ${cmd}`))
  execSync(cmd, {});
  return params;
}

// process max component data
export async function processMaxComponentData({ ctx, frameworkType }: { ctx: PluginContext, frameworkType?: number }) {
  const helper = ctx.configHelper || ctx.builder?.configHelper;
  const { appId = '', output } = helper.projectConfig;

  // compress
  const filePath = await compressDistDir(output);

  // read value from preview.json
  const componentValuePath = path.join(helper.cwd, 'src/preview.json');
  if (!fs.existsSync(componentValuePath)) {
   throw new Error('请先保存preview.json')
  }
  const componentAppDefaultValue = fs.readFileSync(componentValuePath).toString();

  return {
    appId,
    frameworkType,
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

export const generateH5Qrcode = (args: any) => {
  return async (params: { appId: string; version: string }) => {
    const domain = args.domain || OPEN_DOMAIN;

    const preViewCodeUrl = `https://${domain}/ecom-app/h5?appId=${params?.appId}&version=${params?.version}&isPreview=true&hide_nav_bar=1`;
    const qrcode = await new Promise((resolve, reject) => {
      console.log(preViewCodeUrl);
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
