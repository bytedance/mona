import buildInPlugins from './buildInPlugins';
import Service from './Service';

export * from './Service';
export { default as Service } from './Service';
export { default as PluginContext } from './PluginContext';
export { default as ICommand } from './ICommand';

function main() {
  const service = new Service(buildInPlugins);
  service.install();
  service.run()
}

export default main;
