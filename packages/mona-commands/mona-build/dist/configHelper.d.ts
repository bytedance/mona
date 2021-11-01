import webpack from 'webpack';
import { ProjectConfig, AppConfig } from '@ecom/mona';
import EntryModule from "./EntryModule";
interface ConfigHelperOptions {
    dev: boolean;
    port: string;
}
declare class ConfigHelper {
    cwd: string;
    projectConfig: ProjectConfig;
    appConfig: AppConfig;
    entryPath: string;
    entryModule: EntryModule;
    options: ConfigHelperOptions;
    constructor(options: ConfigHelperOptions);
    generate(): webpack.Configuration;
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
