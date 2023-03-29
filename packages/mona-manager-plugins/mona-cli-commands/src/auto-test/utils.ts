import axios from 'axios';

const execute = (code: string) =>
  new Function('module', 'require', 'exports', `${code}\n; \n return module.exports`)(module, require, module.exports);
const req = axios.get;

export async function importRemoteModule<M>(location: string): Promise<M> {
  try {
    const { data } = await req(location);
    const res = execute(data) as M;

    return res;
  } catch (error) {
    return {} as never;
  }
}
