
import QRCode from 'qrcode';
import chokidar from 'chokidar';
import PluginContext from '@/PluginContext';
import { execSync } from 'child_process';
import { compressDistDir } from "../compress/utils";

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

export function generateTestVersion(params: { ctx: PluginContext, compressPath: string }) {
  console.log('压缩文件路径', params.compressPath);
  return params.compressPath;
}

export function outputQrcode(url: string) {
    return new Promise((resolve, reject) => {
      QRCode.toString(url, { type: 'terminal' }, (err, url) => {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    })
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