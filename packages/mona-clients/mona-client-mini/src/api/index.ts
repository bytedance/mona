import { promisify } from '../utils/promisify';
import { BaseApi } from '@bytedance/mona-apis'
class Api extends BaseApi {
  showToast(params: any) {
    return promisify(tt.showToast)(params);
  }
}

export default Api