import { formatPath } from '@/utils/formatPath';

export function navigateTo(url: string) {
  history.pushState({}, '', formatPath(url));
}

export function redirectTo(url: string) {
  window.location.href = formatPath(url);
}

export function open(url: string) {
  window.open(formatPath(url));
}
