import VirtualModulesPlugin from "../VirtualModulesPlugin";
import { ConfigHelper } from "../../configHelper";
export declare const MONA_PUBLIC_PATH = "__mona_public_path__";
declare class PluginEntryModule {
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
export default PluginEntryModule;
