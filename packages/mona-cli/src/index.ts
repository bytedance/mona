import path from 'path';
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
