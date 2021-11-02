import { InputCallbackParams, PluginSdkBaseType } from './type';

type OfficialParams = 'after_sale_id' | 'order_id' | 'product_id' | 'sku_order_id';

export interface lifeCycleShow {
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
  getInitInfo: (params: InputCallbackParams<string, InitInfo>) => void;
  addToInputBoxSafely: (params: InputCallbackParams<string, undefined>) => void;
}

export type Pigeon = PigeonEmit & PigeonOn & PluginSdkBaseType;
