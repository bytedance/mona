import { ProjectConfig, AppConfig } from '@bytedance/mona';
export declare const DEFAULT_PORT = "9999";
export declare const DEAULT_HOST = "localhost";
interface ConfigHelperOptions {
    dev: boolean;
    port: string;
}
export declare function createUniqueId(): string;
declare class ConfigHelper {
    cwd: string;
    projectConfig: ProjectConfig;
    appConfig: AppConfig;
    entryPath: string;
    options: ConfigHelperOptions;
    buildId: string;
    constructor(options: ConfigHelperOptions);
    readAllConfig(): void;
    generate(): any;
    private _createOptimization;
    private _createResolve;
    private _readConfig;
    private _createEntry;
    private _createMode;
    private _createOutput;
    private _createModule;
    private _createModuleRules;
    private _createPlugins;
}
export default ConfigHelper;
