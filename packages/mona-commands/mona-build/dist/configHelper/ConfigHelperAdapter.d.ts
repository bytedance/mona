import { Options } from "../index";
import BaseConfigHelper from "./BaseConfigHelper";
import { AppConfig, ProjectConfig } from "@bytedance/mona";
declare class ConfigHelperAdapter implements BaseConfigHelper {
    cwd: string;
    projectConfig: ProjectConfig;
    appConfig: AppConfig;
    entryPath: string;
    options: Required<Options>;
    configHelper: BaseConfigHelper;
    constructor(options: Required<Options>);
    generate(): import("webpack").Configuration;
    readAllConfig(): void;
    private _readConfig;
}
export default ConfigHelperAdapter;
