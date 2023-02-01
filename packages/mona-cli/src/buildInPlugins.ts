const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: string[]) => flatten(plugins.map(pathToPlugin));

const buildInPlugins = convertPlugins(['@bytedance/mona-cli-commands']);

export default buildInPlugins;
