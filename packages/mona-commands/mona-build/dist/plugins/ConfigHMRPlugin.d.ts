import ConfigHelper from "../configHelper";
import { Compiler } from 'webpack';
import EntryModule from "../EntryModule";
declare class ConfigHMRPlugin {
    configHelper: ConfigHelper;
    entryModule: EntryModule;
    pluginName: string;
    constructor(configHelper: ConfigHelper);
    apply(compiler: Compiler): void;
}
export default ConfigHMRPlugin;
