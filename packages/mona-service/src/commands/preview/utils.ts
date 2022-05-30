
import QRCode from 'qrcode';
import chokidar from 'chokidar';

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

// upload resource temporary
export function upload(outputPath: string) {
  // upload to tos
  return outputPath;
}


// generate qrcode
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