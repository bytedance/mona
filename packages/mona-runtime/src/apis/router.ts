import { formatPath } from '@/utils/formatPath';

export function navigateTo(url: string) {
  // @ts-ignore
  const _history = window.__mona_history;
  if (_history) {
    _history.push(formatPath(url))
  }
}

export function redirectTo(url: string) {
  // @ts-ignore
  const _history = window.__mona_history;
  if (_history) {
    _history.replace(formatPath(url))
  }
}

export function open(url: string) {
  window.open(formatPath(url));
}
