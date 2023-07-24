import axios from 'axios';

const execute = (code: string) =>
  new Function('module', 'require', 'exports', `${code}\n; \n return module.exports`)(module, require, module.exports);
const req = axios.get;

export async function importRemoteModule<M>(location: string): Promise<M> {
  try {
    const ttEnv = process.env.UI_TEST_TT_ENV;
    if (ttEnv) {
      console.log('当前环境:', ttEnv);
    }
    const { data } = await req(location, {
      headers: {
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'x-tt-env': ttEnv
      }
    });
    const res = execute(data) as M;

    return res;
  } catch (error) {
    console.error(error);
    return {} as never;
  }
}
