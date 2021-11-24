export declare function readTypescriptFile(filename: string): Record<string, any>;
export declare function readJavascriptFile(filename: string): any;
declare function readConfig<T = any>(filename: string): T;
export default readConfig;
