import { AppConfig, ProjectConfig } from '@bytedance/mona';
import { Configuration } from 'webpack';
import { Options } from "..";
declare abstract class BaseConfigHelper {
    cwd: string;
    projectConfig: ProjectConfig;
    appConfig: AppConfig;
    entryPath: string;
    options: Required<Options>;
    abstract generate(): Configuration;
    constructor(options: Required<Options>);
    readAllConfig(): void;
    private _readConfig;
}
export default BaseConfigHelper;
