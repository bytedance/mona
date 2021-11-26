import { api as miniApi } from '@bytedance/mona-client-mini'
import { Api as WebApi } from '@bytedance/mona-client-web'
import { Api as PluginApi } from '@bytedance/mona-client-plugin'
import Api from './Api';

type Env = 'mini' | 'web' | 'plugin';

export default function adapter(env: Env) {
  let api: Api;
  switch(env) {
    case 'mini':
      api = miniApi;
      break;
    case 'plugin':
      api = new PluginApi();
      break;
    case 'web':
    default:
      api = new WebApi();
  }

  return api
}