import Api from './Api';
declare type Env = 'mini' | 'web' | 'plugin';
export default function adapter(env: Env): Api;
export {};
