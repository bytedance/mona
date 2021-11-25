import { BaseApi } from '@bytedance/mona-apis'

class Api extends BaseApi {
  constructor() {
    super();
    this.showToast = () => Promise.resolve()
  }
}

export default Api