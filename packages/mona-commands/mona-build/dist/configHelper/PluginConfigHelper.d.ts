import BaseConfigHelper from "./BaseConfigHelper";
import { Options } from "..";
declare class PluginConfigHelper extends BaseConfigHelper {
    buildId: string;
    constructor(options: Required<Options>);
    generate(): any;
    private _createOptimization;
    private _createResolve;
    private _createEntry;
    private _createMode;
    private _createOutput;
    private _createModule;
    private _createModuleRules;
    private _createPlugins;
}
export default PluginConfigHelper;
