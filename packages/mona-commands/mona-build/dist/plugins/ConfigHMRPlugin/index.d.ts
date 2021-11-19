import { ConfigHelper } from "../../configHelper";
import { Compiler } from 'webpack';
import PluginEntryModule from "./PluginEntryModule";
declare class ConfigHMRPlugin {
    configHelper: ConfigHelper;
    entryModule: PluginEntryModule;
    pluginName: string;
    constructor(configHelper: ConfigHelper);
    apply(compiler: Compiler): void;
}
export default ConfigHMRPlugin;
