const pkg = require('../package.json');
const update = require('@bytedance/mona-cli-commands/dist/update/index.js');
const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: (string | Function | Function[])[]) =>
  flatten(
    plugins.map(item => {
      if (typeof item === 'string') {
        return pathToPlugin(item);
      } else {
        return item;
      }
    }),
  );
const buildInPlugins = convertPlugins([
  '@bytedance/mona-cli-commands/dist/init/index.js',
  '@bytedance/mona-cli-commands/dist/login/index.js',
  '@bytedance/mona-cli-commands/dist/logout/index.js',
  update(pkg),
  '@bytedance/mona-cli-commands/dist/auto-test/index.js',
  '@bytedance/mona-cli-commands/dist/server-client/index.js',
]);

export default buildInPlugins;
