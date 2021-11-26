import { BaseApis } from '@bytedance/mona'

type PropType<B, K extends keyof B> = B[K];
class Apis extends BaseApis {
  showToast(...params: Parameters<PropType<BaseApis, 'showToast'>>) {
    console.log('show toast in web', params)
    return Promise.resolve('showToast')
  }
}

export default Apis