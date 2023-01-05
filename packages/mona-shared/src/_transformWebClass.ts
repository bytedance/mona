export const _transformWebClass = (classes: string, uniqueHash: string) => {
  return classes
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(item => item + '--' + uniqueHash)
    .join(' ');
};
