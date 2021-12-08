import { MiniComponents } from '@bytedance/mona-client-mini';
import { WebComponents } from '@bytedance/mona-client-web';
import { PluginComponents } from '@bytedance/mona-client-plugin';
import { BaseComponents } from '@bytedance/mona';

type Env = 'mini' | 'web' | 'plugin';

export default function adapter(env: Env) {
  let components: BaseComponents;
  switch (env) {
    case 'mini':
      components = new MiniComponents() as MiniComponents;
      break;
    case 'plugin':
      components = new PluginComponents() as BaseComponents;
      break;
    case 'web':
    default:
      components = new WebComponents() as BaseComponents;
  }

  return components;
}
