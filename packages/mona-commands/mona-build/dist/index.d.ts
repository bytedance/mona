export declare type Target = 'mini' | 'plugin' | 'web';
export interface Options {
    dev?: boolean;
    port?: string;
    target?: Target;
}
declare function build({ dev }: {
    dev: boolean;
}): void;
export default build;
