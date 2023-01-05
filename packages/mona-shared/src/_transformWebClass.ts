export const _transformWebClass = (classes: string, uniqueHash: string) => {
  return classes
    .split(' ')
    .map(item => item + '--' + uniqueHash)
    .join(' ');
};
