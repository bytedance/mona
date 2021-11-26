import { promisify } from '../utils/promisify';
import { BaseApis } from '@bytedance/mona'
class MiniApis extends BaseApis {
  showToast = promisify(tt.showToast)
  navigateTo(params: any) {
    let opts = params;
    if (typeof params === 'string') {
      opts = { url: params };
    }
    return promisify(tt.navigateTo)(opts)
  }
  redirectTo(params: any) {
    let opts = params;
    if (typeof params === 'string') {
      opts = { url: params };
    }
    return promisify(tt.redirectTo)(opts)
  }
  open() {
    return Promise.reject(new Error('not implemented in miniapp'));
  }
}

export default MiniApis