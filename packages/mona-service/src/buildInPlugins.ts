const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: string[]) => flatten(plugins.filter(r => r).map(pathToPlugin));

const buildInPlugins = convertPlugins([
  process.env.AUTOMATED_TEST === '1' ? '@ecom/mona-dynamic-detection' : '',
  './utils/checkVersion',
  './commands/build',
  './commands/start',
  './commands/compress',
  './commands/publish',
  './commands/preview',
  './target/web/index',
  './target/mini/index',
  './target/plugin/index',
  './target/light/index',
  './target/h5/index',
  './target/max/index',
]);

export default buildInPlugins;
