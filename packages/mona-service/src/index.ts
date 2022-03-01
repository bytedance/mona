import Service from './Service';

export * from './Service';
export * from './GlobalService';
export { default as Service } from './Service';
export { default as GlobalService } from './GlobalService';
export { default as PluginContext } from './PluginContext';
export { default as GlobalPluginContext } from './GlobalPluginContext';
export { default as ICommand } from './ICommand';

import config from './config';

function main() {
  const service = new Service(config.buildInPlugins);
  service.install();
  service.run()
}

export default main;
