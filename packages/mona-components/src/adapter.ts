import { Components as MiniComponents } from '@bytedance/mona-client-mini'
import BaseComponents from './BaseComponents';

type Env = 'mini' | 'web' | 'plugin';

export default function adapter(env: Env) {
  let components: BaseComponents;
  switch(env) {
    case 'mini':
    default:
      components = new MiniComponents() as BaseComponents;
    //   break;
    // case 'plugin':
    //   api = new PluginApi();
    //   break;
    // case 'web':
    // default:
    //   api = new WebApi();
  }

  return components;
}