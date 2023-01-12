export const _transformWebClass = (classes: string | undefined, uniqueHash: string) => {
  if (!classes) return '';
  return classes
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(item => item + '--' + uniqueHash)
    .join(' ');
};
