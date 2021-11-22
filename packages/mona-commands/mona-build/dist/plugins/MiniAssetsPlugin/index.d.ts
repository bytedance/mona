import { ConfigHelper } from "../../configHelper";
import { Compiler } from 'webpack';
declare class MiniAssetsPlugin {
    configHelper: ConfigHelper;
    pluginName: string;
    constructor(configHelper: ConfigHelper);
    apply(compiler: Compiler): void;
}
export default MiniAssetsPlugin;
