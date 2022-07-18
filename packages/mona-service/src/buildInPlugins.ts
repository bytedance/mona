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
  '@bytedance/mona-max',
  './target/web/index',
  './target/mini/index',
  './target/plugin/index',
]);

export default buildInPlugins;
