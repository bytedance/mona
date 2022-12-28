import { QueueInput } from './type';
export declare class DelayQueue {
    private _delayCallbackQueue;
    private timeout;
    constructor(timeout?: number);
    set: (key: string, input: QueueInput) => void;
    run: (key: string, cb: (input: QueueInput) => any) => void;
    clear: (key: string) => void;
    clearAll: () => void;
}
