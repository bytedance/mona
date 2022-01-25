// import { getPkgName, getPkgVersion } from './utils/package';
// import chalk from 'chalk';
import path from 'path';
// import cmds from './cmds';
// import { commandUsage, dispatchCommand, joinCmdPath } from './utils/command';
// import PackageUpdater from './PackageUpdater';
import { Service } from '@bytedance/mona-service'

const pathToPlugin = (pathname: string) => require(pathname);

const buildInPlugins = [
  './commands/init',
  './commands/publish',
  './commands/update'
].map(name => pathToPlugin(path.join('@bytedance/mona-cli/dist', name)))

function mona() {
  const service = new Service(buildInPlugins);

  service.install();

  service.run();
}

export default mona;
