import { LifecycleContext, Callback } from './context';
export declare const appLifecycleContext: LifecycleContext;
export declare function useAppEvent(eventName: string, callback: Callback): void;
export declare function usePageEvent(eventName: string, callback: Callback): void;
