import Api from './Api';
declare type Env = 'mini' | 'web' | 'plugin';
declare class ApiAdapter {
    env: Env;
    apiInstance: Api | undefined;
    constructor({ env }: {
        env: Env;
    });
}
export default ApiAdapter;
