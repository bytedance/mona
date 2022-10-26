// import { useCallback, useEffect, useMemo, useState } from 'react';

// import { RequestOptions } from '@bytedance/mona';

// import { webRequest } from '@/apis/util';

// export type Service = (...args: any[]) => Promise<any>;

// function useRequest<D>(
//   service: Service | RequestOptions,
//   config?: { ready?: any; manual?: any; debounceInterval?: number },
// ) {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<D>();
//   const [error, setError] = useState<any>(null);

//   const controller = new AbortController();

//   const request = useCallback(async (params?: Record<any, any>) => {
//     setLoading(true);
//     try {
//       if (typeof service === 'function') {
//         const ret = await service(params);
//         setData(ret);
//       } else {
//         const requestParams = { ...service, ...(params || {}) };
//         await webRequest({
//           ...requestParams,
//           success: res => {
//             setData(res.data as unknown as D);
//           },
//           fail: err => {
//             setError(err);
//           },
//           complete: () => {},
//         });
//       }
//     } catch (res) {
//       setError(res);
//     }

//     setLoading(false);
//   }, []);

//   const options = useMemo(
//     () => ({
//       manual: config?.manual,
//       ready: config?.ready,
//       debounceInterval: config?.debounceInterval,
//     }),
//     [config?.manual, config?.ready, config?.debounceInterval],
//   );

//   useEffect(() => {
//     if (!options || !options.manual || (options.manual && options.ready)) {
//       request();
//     }

//     return () => {
//       controller.abort();
//     };
//   }, [options]);

//   return {
//     data,
//     loading,
//     error,
//     cancel: controller.abort,
//     run: request,
//   };
// }

// export default useRequest;

import { RequestOptions } from '@bytedance/mona';
import useAhooksRequest from 'ahooks/lib/useRequest/src/useRequest';

import type { Options, Service } from 'ahooks/lib/useRequest/src/types';

import { request } from '..';

export function useRequest<TData, TParams extends any[]>(
  service: { requestFn?: Service<TData, TParams> } & Partial<
    Omit<RequestOptions, 'success' | 'fail' | 'complete' | 'timeout'>
  >,
  options?: Options<TData, TParams>,
): import('ahooks/lib/useRequest/src/types').Result<TData, TParams> {
  return useAhooksRequest(
    // @ts-ignore ignore
    service.requestFn
      ? service.requestFn
      : args => {
          if (args) service.data = args;
          return request(service);
        },
    {
      ...options,
    },
  );
}
