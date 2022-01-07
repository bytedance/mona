export default function formatPath(url: string, from?: string): string {
  if (/^\.\./.test(url)) {
    return resolveLocation(url.toLowerCase(), from);
  } else if (/^[a-zA-Z]/.test(url)) {
    return  `/${url.toLowerCase()}`
  }
  return url.toLowerCase();
}

// 参考reactV6
// 以下函数参考 https://github.com/remix-run/react-router
function resolveLocation(to: string, fromPathname = '/') {
  const [toPathname, search] = to.split('?');
  const from = fromPathname.startsWith('/') ? fromPathname.split('/').slice(0, -1).join('/') : fromPathname;

  let pathname = toPathname
    ? resolvePathname(toPathname, toPathname.startsWith('/') ? '/' : from)
    : from;
  return `${pathname}${search ? `?${search}` : ''}`;
}
const trimTrailingSlashes = (path: string) => path.replace(/\/+$/, '');
const normalizeSlashes = (path: string) => path.replace(/\/\/+/g, '/');
const joinPaths = (paths: string[]) => normalizeSlashes(paths.join('/'));
const splitPath = (path: string) => normalizeSlashes(path).split('/');
function resolvePathname(toPathname: string, fromPathname: string): string {
  let segments = splitPath(trimTrailingSlashes(fromPathname));
  let relativeSegments = splitPath(toPathname);
  relativeSegments.forEach(segment => {
    if (segment === '..') {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== '.') {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? joinPaths(segments) : '/';
}
