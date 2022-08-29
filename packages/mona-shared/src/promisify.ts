import { Parameters } from 'enzyme';

type AnyFunc = (options: any) => any;
type Result<T extends AnyFunc> = Parameters<Exclude<Parameters<T>[0], undefined>['success']>[0];
export type PromisifyReturn<T extends AnyFunc> = (...args: Parameters<T>) => Promise<Result<T>> & ReturnType<T>;

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

