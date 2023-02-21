import buildInPlugins from './buildInPlugins';
import Service from '@bytedance/mona-manager';

function main() {
  const service = new Service(buildInPlugins);
  service.install();
  service.run();
}

export default main;
