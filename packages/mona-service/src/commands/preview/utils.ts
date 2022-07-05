
import QRCode from 'qrcode';
import chokidar from 'chokidar';
import PluginContext from '@/PluginContext';
import { execSync } from 'child_process';
import { compressDistDir } from "../compress/utils";
import { createUploadForm } from '../common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

type Request<T = any> = (path: string, options?: AxiosRequestConfig<any>) => Promise<AxiosResponse<T, any>>

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

export async function compress(ctx: PluginContext) {
  const compressPath = await compressDistDir(ctx.configHelper.projectConfig.output);
  return { ctx, compressPath };
}

export const createTestVersionFactory = (request: Request<CreateTestAppVersionResp>) => async (params: { ctx: PluginContext, compressPath: string }) => {
  const appId = params.ctx.configHelper.projectConfig.appId || '';
  const { form, requestOptions } = await createUploadForm({
    appId,
    testFile: {
      filePath: params.compressPath,
    }
  })
  const res = await request('/captain/app/version/test/create', {
    method: 'POST',
    data: form,
    ...requestOptions,
  })

  return { appId, version: res.data.version };
}


export const generateQrcodeFactory = (request: Request<GetDynamicTestUrlResp>) => async (params: { appId: string; version: string }) => {
    const { data } = await request('/captain/app/version/getDynamicTestUrl', {
      method: 'GET',
      params
    })

    const preViewCodeUrl = `aweme://goods/store?sec_shop_id=${data?.secShopId}&token=${data?.token}&tmp_id=${data?.tmpId}&enter_from=scan&entrance_location=scan&pass_through_api=%7B%22isJump%22%3A1%7D`;
    const qrcode = await new Promise((resolve, reject) => {
      QRCode.toString(preViewCodeUrl, { type: 'terminal' }, (err, url) => {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    })

    return qrcode;
}

export function buildMaxComponent(ctx: PluginContext) {
  execSync(`mona-service build -t max`, { stdio: 'ignore' });
  return ctx;
}

export function buildMaxTemplate(ctx: PluginContext) {
  // do nothing
  return ctx;
}

// process max component data
export function processMaxComponentData(ctx: PluginContext) {
  // write code here
  return ctx;
}

// process max template data
export function processMaxTemplateData(ctx: PluginContext) {
  // write code here
  return ctx;
}