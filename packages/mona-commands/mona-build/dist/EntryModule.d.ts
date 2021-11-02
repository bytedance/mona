import { WebpackPluginInstance } from 'webpack';
import ConfigHelper from "./configHelper";
export declare const MONA_PUBLIC_PATH = "__mona_public_path__";
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
