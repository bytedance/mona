export function slash(path: string) {
  if (!path) {
    return path;
  }
  return /^\\\\\?\\/.test(path) ? path : path.replace(/\\/g, `/`);
}

export const isReactCreateElement = (name: string) => ['createElement', 'cloneElement'].includes(name);
