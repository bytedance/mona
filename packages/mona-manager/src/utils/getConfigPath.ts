import path from 'path';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

export const getConfigPath = () => {
  const argFileName: string = argv.c || argv.config;
  const defaultConfigName = 'mona.config';
  if (argFileName) {
    const { ext, name } = path.parse(argFileName);
    const hasMatchExt = ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
    return hasMatchExt ? name : defaultConfigName;
  }
  return defaultConfigName;
};
