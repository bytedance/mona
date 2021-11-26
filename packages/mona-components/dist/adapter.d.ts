import BaseComponents from './Base';
declare type Env = 'mini' | 'web' | 'plugin';
export default function adapter(env: Env): BaseComponents;
export {};
