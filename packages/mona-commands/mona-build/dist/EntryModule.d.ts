import VirtualModulesPlugin from "./plugins/VirtualModulesPlugin";
import ConfigHelper from "./configHelper";
export declare const MONA_PUBLIC_PATH = "__mona_public_path__";
declare class EntryModule {
    configHelper: ConfigHelper;
    name: string;
    module: VirtualModulesPlugin;
    constructor(configHelper: ConfigHelper);
    static extendEntryName(filename: string): string;
    createModule(): VirtualModulesPlugin;
    updateModule(): void;
    getPageTitle(page: string): string;
    private _generatePluginEntryCode;
}
export default EntryModule;
