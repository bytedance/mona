import { Service } from '@bytedance/mona-service'
import buildInPlugins from './buildInPlugins';

function mona() {
  const service = new Service(buildInPlugins);

  service.install();

  service.run();
}

export default mona;
