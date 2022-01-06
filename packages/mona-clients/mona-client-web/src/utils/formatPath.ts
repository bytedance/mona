import { parsePath } from 'history';

export default function formatPath(url: string): string {
  return /^\//.test(url) ? url.toLowerCase() : `/${url.toLowerCase()}`;
}

// 参考reactV6
// 以下函数参考 https://github.com/remix-run/react-router
export function resolveLocation(to: string, fromPathname = '/') {
  let { pathname: toPathname } = typeof to === 'string' ? parsePath(to) : to;

  let pathname = toPathname
    ? resolvePathname(toPathname, toPathname.startsWith('/') ? '/' : fromPathname)
    : fromPathname;
  return pathname;
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
