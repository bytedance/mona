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

const pathToPlugin = (pathname: string) => require(pathname);

const buildInPlugins = [
  './commands/build',
  './commands/start',
  './target/web/index',
  './target/mini/index',
  './target/plugin/index',
].map(name => pathToPlugin(name));

const max = require('@bytedance/mona-max');
let pureBuildInPlugins = ['./commands/compress', './commands/publish'].map(name => pathToPlugin(name));
pureBuildInPlugins = [...pureBuildInPlugins, ...max];

function main() {
  const argv = minimist(process.argv.slice(2));
  const cmdName = argv._[0] as string;

  // TODO: unify all target develop standard
  if (['publish', 'compress', 'max-build', 'max-start'].indexOf(cmdName) !== -1) {
    const pureService = new GlobalService(pureBuildInPlugins);
    pureService.install();
    pureService.run();
  } else {
    const service = new Service(buildInPlugins);
    service.install();
    service.run();
  }
}

export default main;
