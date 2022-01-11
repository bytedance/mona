function lowerCasePathName(name: string) {
  const [p, n] = name.split('?');
  return `${p.toLowerCase()}${n ? `?${n}` : ''}`
}

export function formatPath(url: string): string {
  return lowerCasePathName(/^\//.test(url) ? url : `/${url}`);
}
