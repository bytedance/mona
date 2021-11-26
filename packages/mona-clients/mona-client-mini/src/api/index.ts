import { promisify } from '../utils/promisify';
import BaseApi from '@bytedance/mona-apis/dist/Api'

type PropType<B, K extends keyof B> = B[K];

class Api extends BaseApi {
  showToast(...params: Parameters<PropType<BaseApi, 'showToast'>>) {
    return promisify(tt.showToast)(params);
  }
}

export default Api