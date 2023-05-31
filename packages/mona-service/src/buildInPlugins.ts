import dynamicInstallPlugins from "./dynamicInstallPlugins";

const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: string[]) => flatten(plugins.filter(r => r).map(pathToPlugin));


const getBuildInPlugins = async function() {
  const dynamicPlugins = await dynamicInstallPlugins();

  return convertPlugins([
    process.env.AUTOMATED_TEST === '1' ? '@ecom/mona-dynamic-detection' : '',
    './utils/checkVersion',
    '@bytedance/mona-service-commands',
    '@bytedance/mona-service-target-web',
    dynamicPlugins,
  ]);
}



export default getBuildInPlugins;
