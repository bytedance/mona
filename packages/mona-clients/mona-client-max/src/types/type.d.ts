export declare type Listener = (data: any) => any;
export declare type EventName = string;
export declare type Scope = string;
export interface EventOptionsType {
    isDeepClone?: boolean;
    once?: boolean;
    pluginId?: string;
    isSync?: boolean;
    resolve?: any;
    reject?: any;
}
export interface ListenerInfo {
    listener: Listener;
    once?: boolean;
    pluginId?: string;
}
export interface AppEventInfo {
    isSync: boolean;
    listenerInfo: ListenerInfo;
}
export interface PluginEventInfo {
    isSync: boolean;
    listenerInfos: ListenerInfo[];
}
export declare const enum ErrorCode {
    Unknown = -100,
    TypeError = -101,
    NoPermission = -102,
    AppNoRegister = -103,
    PluginNoRegister = -104
}
export declare type ErrorResponse = {
    code: ErrorCode | number;
    message: string;
};
export interface CustomEvent {
    type: 'on' | 'emit' | 'once' | 'off';
    eventName: string;
    data?: any;
    listener?: (...args: any[]) => any;
}
export interface JsApiPermission {
    jsApi: string[];
    expiration: number;
}
export interface QueueInput {
    data: any;
    options: EventOptionsType;
    resolve: any;
    reject: any;
}
export interface QueueValue {
    input: QueueInput;
    time: number;
}
export interface EmitByPluginData {
    appid: string;
    [key: string]: any;
}
