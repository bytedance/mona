export function parseSearch(search: string): Record<string, string> {
  if (!search || !/^\?/.test(search)) return {};
  const rawSearch = search.replace(/^\?/, '').split('&');
  return rawSearch.reduce((r, s) => {
    const [key, value] = s.split('=');
    r[key] = value;
    return r;
  }, {} as Record<string, string>);
}

export function stringifySearch(searchObj: Record<string, any>) {
  if (typeof searchObj !== 'object') {
    return '';
  }
  const kv: string[] = [];
  Object.keys(searchObj).forEach(key => {
    // TODO url encode ?
    kv.push(`${key}=${searchObj[key]}`);
  });
  return `?${kv.join('&')}`;
}

export const ahaha = 123;
