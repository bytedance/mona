const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: string[]) => flatten(plugins.map(pathToPlugin));

const buildInPlugins = convertPlugins(
  [
    process.env.AUTOMATED_TEST === '1' ? '@ecom/mona-dynamic-detection' : '',
    './commands/build',
    './commands/start',
    './commands/compress',
    './commands/publish',
    '@bytedance/mona-max',
    './target/web/index',
    './target/mini/index',
    './target/plugin/index',
  ].filter(r => r),
);

export default buildInPlugins;
