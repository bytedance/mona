import fetch from 'node-fetch';
import https from 'https';

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
  if (init.method === 'POST' && !opts.formData) {
    init.body = JSON.stringify(init.body);
  }

  if (init.method === 'GET') delete init.body;

  if (opts.formData) {
    init.headers = {};
  }

  try {
    // @ts-ignore
    const resp = await fetch(input, {
      ...(init || {}),
      headers: dropObjEmptyValue(init?.headers),
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    // @ts-ignore
    return parseResponse(resp);
  } catch (error) {
    return parseError(error);
  }
}

export default opFetch;
