export default function formatPath(url: string): string {
  return /^\//.test(url) ? url.toLowerCase() : `/${url.toLowerCase()}`;
}
