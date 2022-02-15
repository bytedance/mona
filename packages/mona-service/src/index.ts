import Service from './Service';

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
  // './config/asset',
  './target/web/index',
  './target/mini/index',
  './target/plugin/index',
].map(name => pathToPlugin(name));

function main() {
  const service = new Service(buildInPlugins);
  service.install();
  service.run();
}

export default main;
