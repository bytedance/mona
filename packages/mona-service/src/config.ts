const flatten = (params: any[]) => [].concat(...params);
const pathToPlugin = (pathname: string) => require(pathname);
const convertPlugins = (plugins: string[]) => flatten(plugins.map(pathToPlugin));

const config = {
  buildInPlugins: convertPlugins([
    './commands/build',
    './commands/start',
    './target/web/index',
    './target/mini/index',
    './target/plugin/index',
    './commands/compress',
    './commands/publish',
    '@bytedance/mona-max'
  ]),
}

export default config;