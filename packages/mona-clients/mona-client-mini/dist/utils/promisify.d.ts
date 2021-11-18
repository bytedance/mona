export interface PromisifyArgs<SuccessArg, FailArg> {
    success?: (args: SuccessArg) => void;
    fail?: (args: FailArg) => void;
}
export declare function promisify<Arg = any, SuccessArg = any, FailArg = any>(api: (arg: Arg & PromisifyArgs<SuccessArg, FailArg>) => void): (arg?: Arg & PromisifyArgs<SuccessArg, FailArg>) => Promise<SuccessArg>;
