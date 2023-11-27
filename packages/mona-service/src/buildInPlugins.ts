import minimist from "minimist";

const flatten = (params: any[]) => [].concat(...params);
export const pathToPlugin = (pathname: string) => require(pathname);
export const convertPlugins = (plugins: string[]) => flatten(plugins.filter(r => r).map(pathToPlugin));

const validCmdNames = ['build', 'start'];
const targetMap: { [key: string]: string } = {
  max: '@bytedance/mona-service-target-lynx',
  mini: '@bytedance/mona-service-target-mini',
};

function morePlugin() {
  const cmdArgv = minimist(process.argv.slice(2), { alias: { t: 'target' } });
  const cmdName = cmdArgv._[0];
  const target = cmdArgv.target;
  let pkgName = '';

  if (validCmdNames.includes(cmdName)) {
    pkgName = targetMap[target];
  }

  return pkgName;
}

const buildInPlugins = convertPlugins([
  process.env.AUTOMATED_TEST === '1' ? '@ecom/mona-dynamic-detection' : '',
  './utils/checkVersion',
  './utils/updateOldVersion',
  '@bytedance/mona-service-commands',
  '@bytedance/mona-service-target-web',
  morePlugin()
]);

export default buildInPlugins;
