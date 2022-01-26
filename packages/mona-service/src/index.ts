import Service from './Service';

export * from './Service';
export { default as Service } from './Service';
export { default as PluginContext } from './PluginContext';
export { default as ICommand } from './ICommand';

const pathToPlugin = (pathname: string) => require(pathname);

const buildInPlugins = [
  './commands/build',
  './commands/start',
  './config/asset',
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
