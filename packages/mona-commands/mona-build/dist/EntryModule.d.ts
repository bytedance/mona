import { WebpackPluginInstance } from 'webpack';
import ConfigHelper from "./configHelper";
declare class EntryModule {
    configHelper: ConfigHelper;
    name: string;
    module: WebpackPluginInstance;
    constructor(configHelper: ConfigHelper);
    static extendEntryName(filename: string): string;
    createModule(): WebpackPluginInstance;
    getPageTitle(page: string): string;
    private _generatePluginEntryCode;
}
export default EntryModule;
