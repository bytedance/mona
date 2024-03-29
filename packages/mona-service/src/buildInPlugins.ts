// import dynamicInstallPlugins from "./dynamicInstallPlugins";

const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: string[]) => flatten(plugins.filter(r => r).map(pathToPlugin));

const buildInPlugins = convertPlugins([
  process.env.AUTOMATED_TEST === '1' ? '@ecom/mona-dynamic-detection' : '',
  './utils/checkVersion',
  './utils/updateOldVersion',
  '@bytedance/mona-service-commands',
  '@bytedance/mona-service-target-web',
  '@bytedance/mona-service-target-mini',
  '@bytedance/mona-service-target-lynx',
]);

export default buildInPlugins;

// const getBuildInPlugins = async function() {
//   const dynamicPlugins = await dynamicInstallPlugins();

//   return convertPlugins([
//     process.env.AUTOMATED_TEST === '1' ? '@ecom/mona-dynamic-detection' : '',
//     './utils/checkVersion',
//     './utils/updateOldVersion',
//     '@bytedance/mona-service-commands',
//     '@bytedance/mona-service-target-web',
//     dynamicPlugins,
//   ]);
// }

// export default getBuildInPlugins;
