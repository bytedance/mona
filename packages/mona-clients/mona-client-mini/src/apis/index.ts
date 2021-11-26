import { promisify } from '../utils/promisify';
import { BaseApis } from '@bytedance/mona'

type PropType<B, K extends keyof B> = B[K];

class Apis extends BaseApis {
  showToast(...params: Parameters<PropType<BaseApis, 'showToast'>>) {
    return promisify(tt.showToast)(params);
  }
}

export default Apis