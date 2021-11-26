import BaseApi from '@bytedance/mona-apis/dist/Api'

type PropType<B, K extends keyof B> = B[K];
class Api extends BaseApi {
  showToast(...params: Parameters<PropType<BaseApi, 'showToast'>>) {
    console.log('show toast in web', params)
    return Promise.resolve('showToast')
  }
}

export default Api