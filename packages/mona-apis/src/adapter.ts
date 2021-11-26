import { Apis as MiniApis } from '@bytedance/mona-client-mini'
import { Apis as WebApis } from '@bytedance/mona-client-web'
import { Apis as PluginApis } from '@bytedance/mona-client-plugin'
import { BaseApis } from '@bytedance/mona';

type Env = 'mini' | 'web' | 'plugin';

export default function adapter(env: Env) {
  let apis: BaseApis;
  switch(env) {
    case 'mini':
      apis = new MiniApis();
      break;
    case 'plugin':
      apis = new PluginApis();
      break;
    case 'web':
    default:
      apis = new WebApis();
  }

  return apis
}