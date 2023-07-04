import buildInPlugins from './buildInPlugins';
import Service from '@bytedance/mona-manager';

async function main() {
  // const buildInPlugins = await getBuildInPlugins();
  const service = new Service(buildInPlugins);
  service.install();
  service.run();
}

export default main;
