import { InputCallbackParams, PluginSdkBaseType } from './type';

type OfficialParams = 'after_sale_id' | 'order_id' | 'product_id' | 'sku_order_id';

export interface lifeCycleShow {
  /**
   * 0：点击tab进入
   * 1~4 自定义按钮跳转
   * 1：店铺单进入 order_id
   * 2：商品单进入 sku_order_id
   * 3：售后单进入 after_sale_id
   * 4：商品列表进入 product_id
   */
  showFrom: 0 | 1 | 2 | 3 | 4;
  query: Record<OfficialParams, string>;
  extraData: Record<string, string>;
}
export interface UserInfo {
  user_id: string;
}

export interface InitInfo {
  customer_service_id: string;
  user_id: string;
  shop_id: number;
  customer_service_name: string;
}


interface PigeonOn {
  onCurrentCustomerChange: (callback: (userInfo: UserInfo) => void) => void;
  onShow: (callback: (data: lifeCycleShow) => void) => void;
}

interface PigeonEmit {
  getInitInfo: (params?: InputCallbackParams<string, InitInfo>) => void;
  addToInputBoxSafely: (params: InputCallbackParams<string, undefined>) => void;
}

export type Pigeon = PigeonEmit & PigeonOn & PluginSdkBaseType;
