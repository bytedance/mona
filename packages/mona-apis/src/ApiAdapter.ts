// @ts-nocheck
import { api as miniApi } from '@bytedance/mona-client-mini'
// import { api as pluginApi } from '@bytedance/mona-client-plugin'
// import { api as webApi } from '@bytedance/mona-client-web'
import Api from './Api';

type Env = 'mini' | 'web' | 'plugin';

class ApiAdapter {
  env: Env
  apiInstance: Api | undefined

  constructor({ env }: { env: Env }) {
    this.env = env;
    switch(env) {
      case 'mini':
        this.apiInstance = miniApi;
        break;
      // case 'plugin':
      //   this.apiInstance = pluginApi;
      //   break;
      // case 'web':
      default:
        this.apiInstance = miniApi;
    }
  }
}

export default ApiAdapter;