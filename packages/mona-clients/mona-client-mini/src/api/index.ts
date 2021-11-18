import { promisify } from '@/utils/promisify';
import { Api as BaseApi } from '@bytedance/mona-apis'

class Api extends BaseApi {
  constructor() {
    super();
    this.showToast = promisify(tt.showToast);
  }
}

export default Api