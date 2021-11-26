import { BaseApi } from '@bytedance/mona-apis';
declare type PropType<B, K extends keyof B> = B[K];
declare class Api extends BaseApi {
    showToast(...params: Parameters<PropType<BaseApi, 'showToast'>>): Promise<any>;
}
export default Api;
