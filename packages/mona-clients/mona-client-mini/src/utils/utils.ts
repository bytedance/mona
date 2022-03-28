export function isEventName(s: string = '') {
  return s[0] === 'o' && s[1] === 'n';
  // return bubbleEventMap[s];
}

export function isFunction(value: any) {
  return typeof value === 'function';
}

export function isObject(o: any) {
  return null !== o && 'object' === typeof o;
}

export const monaPrint = {
  log(...rest: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('%cmona log:', 'color: #01530f; background: #d6ffdf;', ...rest);
    }
  },
  warn(msg: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`mona warn: ${msg}`);
    }
  },
  debug(...rest: any[]) {
    if (process.env.NODE_ENV === 'debug') {
      console.debug('%cmona debug:', 'background: #d8f3fd', ...rest);
    }
  },
};
