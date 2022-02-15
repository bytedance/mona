import path from 'path';
import { GlobalService } from '@bytedance/mona-service'

const pathToPlugin = (pathname: string) => require(pathname);

const buildInPlugins = [
  './commands/init',
  './commands/login',
  './commands/logout',
  './commands/update'
].map(name => pathToPlugin(path.join('@bytedance/mona-cli/dist', name)))

function mona() {
  const service = new GlobalService(buildInPlugins);

  service.install();

  service.run();
}

export default mona;
