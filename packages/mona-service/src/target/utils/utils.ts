import path from 'path';
import { hexMD5 } from './md5';

export const getPageEntryPath = (page: string, cwd: string) => {
  page = page?.length > 1 && page.endsWith('/') ? page.slice(0, -1) : page;
  return path.join(cwd, './src', page);
};

export const isReactCreateElement = (name: string) => ['createElement', 'cloneElement'].includes(name);

export function createUniqueId() {
  const random = () => Number(Math.random().toString().substr(2)).toString(36);
  const arr = [String(Date.now())];
  function createId() {
    var num = random();
    arr.push(num);
  }
  var i = 0;
  while (i < 4) {
    createId();
    i++;
  }
  return hexMD5(arr.join(','));
}

export function getRelativePath(from: string, to: string) {
  const fromDirName = path.extname(from) ? path.dirname(from) : from;
  const toDirName = path.extname(to) ? path.dirname(to) : to;

  return path.relative(fromDirName, toDirName);
}

export function slash(path: string) {
  if (!path) {
    return path;
  }
  return /^\\\\\?\\/.test(path) ? path : path.replace(/\\/g, `/`);
}

export function ejsDataProcess(data: any) {
  const propType = typeof data;
  let res = data;
  if (propType === 'string') {
    res = `'${data}'`;
  } else if (propType === 'object') {
    if (data === null) {
      res = 'null';
    } else {
      res = JSON.stringify(data);
    }
  }
  return res;
}
