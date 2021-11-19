import MiniConfigHelper from "./MiniConfigHelper";
import WebConfigHelper from "./WebConfigHelper";
// import { Configuration } from 'webpack';
import PluginConfigHelper from "./PluginConfigHelper";

import { Options } from '../index'
import BaseConfigHelper from "./BaseConfigHelper";
import { AppConfig, ProjectConfig } from "@bytedance/mona";

class ConfigHelperAdapter implements BaseConfigHelper {
  cwd: string;
  projectConfig: ProjectConfig;
  appConfig: AppConfig;
  entryPath: string;
  options: Required<Options>;
  configHelper: BaseConfigHelper;

  constructor(options: Required<Options>) {
    console.log('build for ', options.target);

    let configHelper: BaseConfigHelper;
    switch (options.target) {
      case 'mini':
        configHelper = new MiniConfigHelper(options)
        break;
      case 'plugin':
        configHelper = new PluginConfigHelper(options)
        break;
      case 'web':
      default:
        configHelper = new WebConfigHelper(options)
    }

    this.configHelper = configHelper;
    this.options = options;
    this.cwd = configHelper.cwd;
    this.projectConfig = configHelper.projectConfig;
    this.appConfig = configHelper.appConfig;
    this.entryPath = configHelper.entryPath;
  }

  // generate webpack config
  generate() {
    console.log('generate webpack config');
    return this.configHelper.generate();
  }

  readAllConfig() {
    return this.configHelper.readAllConfig();
  }

  //@ts-ignore
  private _readConfig() {
    // do nothing
    return {}
  }
}

export default ConfigHelperAdapter;