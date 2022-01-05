export default function formatMiniPath(url: string = '') {
  return url.toLowerCase().replace(/^\//, '');
}
