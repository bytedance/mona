import axios from 'axios';

export const nativeFetch: (params: any) => Promise<{ code: number; raw?: any }> = params => {
  // TODO
  const isInApp = false;
  // 如果是h5环境那么使用axios来请求数据
  if (!isInApp) {
    return new Promise(resolve =>
      axios({
        url: resultUrl,
        data: params.data,
        method,
        params: { ...params.params, aid: 1128 }, // aid代表的是抖音appId，在b端预览的时候必传
        headers: {
          ...headers,
          'x-preview': 1, // 非app环境带上这个头是为了提供没有用户信息情况下的数据
        },
      }).then(res => {
        resolve({
          code: 1,
          raw: { data: res?.data?.data },
        });
      }),
    );
  }

  let resultUrl = params.url;
  const method = params.method || 'GET';
  const headers = params.headers || {};

  // TODO
  return fetch({
    url: resultUrl,
    data: params.data,
    method,
    params: params.params,
    headers,
    version: 'v1',
  });
};
