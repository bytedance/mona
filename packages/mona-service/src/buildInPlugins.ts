const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: string[]) => flatten(plugins.map(pathToPlugin));

const buildInPlugins = convertPlugins([
  './commands/build',
  './commands/start',
  './commands/compress',
  './commands/publish',
  '@bytedance/mona-max',
  './target/web/index',
  './target/mini/index',
  './target/plugin/index',
]);

export default buildInPlugins;
