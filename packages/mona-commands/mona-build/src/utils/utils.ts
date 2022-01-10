import path from 'path';

export function slash(path: string) {
  if (!path) {
    return path;
  }
  return /^\\\\\?\\/.test(path) ? path : path.replace(/\\/g, `/`);
}

export const isReactCreateElement = (name: string) => ['createElement', 'cloneElement'].includes(name);

export const getPageEntryPath = (page: string, cwd: string) => {
  page = page.endsWith('/') ? page.slice(0, -1) : page;
  return path.join(cwd, './src', page);
};

export function getRelativePath(from: string, to: string) {
  const fromDirName = path.extname(from) ? path.dirname(from) : from;
  const toDirName = path.extname(to) ? path.dirname(to) : to;

  return path.relative(fromDirName, toDirName);
}
