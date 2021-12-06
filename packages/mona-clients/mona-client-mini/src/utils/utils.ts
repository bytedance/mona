export function isEventName(s: string = '') {
  return s[0] === 'o' && s[1] === 'n';
}

export function warn(msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`mona warn: ${msg}`);
  }
}

export function isObject(o: any) {
  return o !== null && typeof o === 'object';
}
