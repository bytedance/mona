const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: string[]) => flatten(plugins.map(pathToPlugin));

const buildInPlugins = convertPlugins([
  './commands/init',
  './commands/login',
  './commands/logout',
  './commands/update'
])

export default buildInPlugins;