import { ConfigHelper } from "../../configHelper";
import VirtualModulesPlugin from "../VirtualModulesPlugin";
export default class MiniEntryModule {
    entries: Record<string, {
        filename: string;
    }>;
    module: VirtualModulesPlugin;
    configHelper: ConfigHelper;
    constructor(configHelper: ConfigHelper);
    static extendEntryName(filename: string): string;
    static generateAppEntryCode(filename: string): string;
    static generatePageEntryCode(filename: string, name: string): string;
    createModule(): VirtualModulesPlugin;
}
