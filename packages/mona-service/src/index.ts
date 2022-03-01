import Service from './Service';
import GlobalService from './GlobalService';
import minimist from 'minimist';

export * from './Service';
export * from './GlobalService';
export { default as Service } from './Service';
export { default as GlobalService } from './GlobalService';
export { default as PluginContext } from './PluginContext';
export { default as GlobalPluginContext } from './GlobalPluginContext';
export { default as ICommand } from './ICommand';

import config from './config';

function main() {
  const argv = minimist(process.argv.slice(2));
  const cmdName = argv._[0] as string;

  // TODO: unify all target develop standard
  if (config.pureCommands.indexOf(cmdName) !== -1) {
    const pureService = new GlobalService(config.pureBuildInPlugins);
    pureService.install();
    pureService.run();
  } else {
    const service = new Service(config.buildInPlugins);
    service.install();
    service.run();
  }
}

export default main;
