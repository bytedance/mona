import { ConfigHelper } from "../../configHelper";
import { Compiler } from 'webpack';
import MiniEntryModule from "./MiniEntryModule";
declare class MiniEntryPlugin {
    configHelper: ConfigHelper;
    entryModule: MiniEntryModule;
    pluginName: string;
    constructor(configHelper: ConfigHelper);
    apply(compiler: Compiler): void;
}
export default MiniEntryPlugin;
