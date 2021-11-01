import { InputCallbackParams, PluginSdkBaseType } from './type';
export declare type TextMessageContent = string;
export interface ImageInfo {
    uri: string;
    width: number;
    height: number;
}
export interface CustomerInfo {
    conversationId: string;
    customerId: string;
    shopId: string;
    userId: string;
    goodsId?: string;
    orderId?: string;
}
export interface FocusGoods {
    orderId?: string;
    goodsId?: string;
    conversationId: string;
    userId: string;
    customerId: string;
    shopId: string;
}
interface PigeonOn {
    onFocusGoods: (callback: (message: FocusGoods) => void) => void;
    onCurrentCustomerInfoChanged: (callback: (customerInfo: CustomerInfo) => void) => void;
}
interface PigeonEmit {
    sendTextMessage: (params: InputCallbackParams<TextMessageContent, undefined>) => void;
    sendImgMessage: (params: InputCallbackParams<ImageInfo, undefined>) => void;
    addToInputBox: (params: InputCallbackParams<TextMessageContent, undefined>) => void;
    openImgPreview: (params: InputCallbackParams<{
        urls: string | string[];
        defaultIndex: number;
    }, undefined>) => void;
    getCurrentCustomerInfo: (params: InputCallbackParams<undefined, CustomerInfo>) => void;
    openGoodsDetailPage: (params: InputCallbackParams<string, undefined>) => void;
}
export declare type Pigeon = PigeonEmit & PigeonOn & PluginSdkBaseType;
export {};
