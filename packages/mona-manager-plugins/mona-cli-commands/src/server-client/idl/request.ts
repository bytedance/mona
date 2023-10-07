import fetch from 'node-fetch';
import https from 'https';
import http from 'http';

type SpiResponse<T = Record<string, any>> = {
  BizError: {
    code: number;
    message: string;
  };
  data?: T;
  code?: number;
  message?: string;
};
const emptyList = [undefined, null, ''];
export const dropObjEmptyValue = (headers: any) => {
  const reqHeaders: Record<string, string> = {};
  if (!headers) {
    return reqHeaders;
  }
  for (const i in headers) {
    if (!emptyList.includes(headers[i])) {
      reqHeaders[i] = headers[i];
    }
  }

  return reqHeaders;
};
class RespError extends Error {
  code: number;
  constructor({ BizError }: SpiResponse) {
    super(BizError?.message);
    this.code = BizError?.code;
    // this.data = data;
  }
}

const parseResponse = async (response: Response) => {
  let respData;
  if (!response.ok) {
    return Promise.reject(new Error(`${response.status} ${response.statusText}  \n  ${response.url ?? ''} `));
  }
  respData = await response.json();
  const { BizError } = respData;

  const { code } = BizError || {};

  if (!code) {
    return respData;
  } else if (`${code}` === '1000132') {
    return { ...respData, app: {} };
  } else if (`${code}` === '1000101') {
    const error = new RespError({ BizError });
    console.log('登录已过期，请重新登录');
    return Promise.reject(error);
  } else {
    const error = new RespError({ BizError });
    return Promise.reject(error);
  }
};

const parseError = async (error: any) => {
  // const { response } = error;
  return Promise.reject(error);
};

export async function opFetch(input: RequestInfo, init: RequestInit = {}, opts: any = {}) {
  if (init.method === 'POST' && !opts.formData && typeof init.body !== 'string') {
    init.body = JSON.stringify(init.body);
  }

  if (init.method === 'GET') delete init.body;

  if (opts.formData) {
    init.headers = {};
  }

  try {
    // console.log(input, {
    //   ...(init || {}),
    //   headers: { ...dropObjEmptyValue(init?.headers), 'x-tt-env': 'ppe_14493651', 'x-use-ppe': '1' },
    // });
    // @ts-ignore
    const resp = await fetch(input, {
      ...(init || {}),
      headers: { ...dropObjEmptyValue(init?.headers), 'x-tt-env': 'ppe_14493651', 'x-use-ppe': '1' },
      //@ts-ignore
      agent: input.startsWith('https://')
        ? new https.Agent({
            rejectUnauthorized: false,
          })
        : new http.Agent({}),
    });
    // console.log('resp', input, resp?.headers);
    // console.log(`${resp.status} ${resp.statusText}  \n  ${resp.url ?? ''} `);
    if (opts?.onlyResp && resp.ok) {
      return await resp.json();
    }
    // @ts-ignore
    return parseResponse(resp);
  } catch (error) {
    return parseError(error);
  }
}

export default opFetch;
