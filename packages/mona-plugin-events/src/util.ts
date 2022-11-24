export const removeEventPrefix = (prop: string, prefix: string) => {
  if (!prop.startsWith(prefix) || prop.length === prefix.length) {
    return;
  }
  const alphaList = Array.from(prop?.slice(prefix.length));
  alphaList[0] = alphaList[0].toLowerCase();
  return alphaList.join('');
};
