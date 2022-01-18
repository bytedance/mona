function lowerCasePathName(name: string) {
  const [p, n] = name.split('?');
  return `${p.toLowerCase()}${n ? `?${n}` : ''}`;
}

export default function formatPath(url: string, from?: string): string {
  let result = lowerCasePathName(url);
  if (/^\./.test(result)) {
    result = resolveLocation(result, from);
  } else if (/^[a-zA-Z]/.test(url)) {
    result = `/${result}`;
  }

  // fix url without pages
  if (!/^\/pages/.test(result)) {
    result = `/pages${result}`;
  }
  return result;
}

// MIT License

// Copyright (c) React Training 2015-2019 Copyright (c) Remix Software 2020-2021

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 参考react-routerV6
// 以下函数参考 https://github.com/remix-run/react-router
function resolveLocation(to: string, fromPathname = '/') {
  const [toPathname, search] = to.split('?');
  const from = fromPathname.startsWith('/') ? fromPathname.split('/').slice(0, -1).join('/') : fromPathname;

  let pathname = toPathname ? resolvePathname(toPathname, toPathname.startsWith('/') ? '/' : from) : from;
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
      if (segments.length > 1) segments.pop();
    } else if (segment !== '.') {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? joinPaths(segments) : '/';
}
