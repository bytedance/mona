type ParamType<T> = T extends (arg: infer P) => any ? P : never;
type AnyFunc = (options: any) => any;
type Result<T extends AnyFunc> = ParamType<ParamType<T>['success']>;
export type PromisifyReturn<T extends AnyFunc> = (options: ParamType<T>) => Promise<Result<T>> & ReturnType<T>;

export function promisify<T extends AnyFunc>(fn: T): PromisifyReturn<T> {
  return function (options) {
    let newOptions = { ...options };
    let res = new Promise((resolve, reject) => {
      newOptions.success = (params: any) => {
        resolve(params);
        options?.success?.(params);
      };
      newOptions.fail = (params: any) => {
        reject(params);
        options?.fail?.(params);
      };
    });
    const newRes = Object.assign(res, fn(newOptions));
    return newRes;
  };
}
