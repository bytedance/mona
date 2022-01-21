// import { getPkgName, getPkgVersion } from './utils/package';
// import chalk from 'chalk';
import path from 'path';
// import cmds from './cmds';
// import { commandUsage, dispatchCommand, joinCmdPath } from './utils/command';
// import PackageUpdater from './PackageUpdater';
import { Service } from '@bytedance/mona-service'

const defaultPlugins = [
  './commands/init',
  './commands/publish',
  './commands/update'
].map(p => path.join('@bytedance/mona-cli/dist', p))

function mona() {
  const service = new Service(defaultPlugins);

  service.install();

  service.run();
}

export default mona;
