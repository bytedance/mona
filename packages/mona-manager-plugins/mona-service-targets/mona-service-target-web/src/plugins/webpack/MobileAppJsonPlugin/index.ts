import { ConfigHelper } from '@bytedance/mona-manager';
import { Compiler } from 'webpack';
import fs from 'fs';
import path from 'path';
const APP_CONFIG_TS_PATH = 'app.config.ts';
const APP_CONFIG_JS_PATH = 'app.config.js';

class MobileAppJsonPlugin {
  configHelper: ConfigHelper;
  pluginName = 'MobileAppJsonPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap('MobileAppJsonPlugin', () => {
      try {
        const { cwd, projectConfig } = this.configHelper;
        const appConfigPath = fs.existsSync(path.join(cwd, APP_CONFIG_TS_PATH))
          ? path.join(cwd, APP_CONFIG_TS_PATH)
          : path.join(cwd, APP_CONFIG_JS_PATH);
        const outputFilePath = path.join(cwd, projectConfig.output, 'app.json');
        if (fs.existsSync(appConfigPath)) {
          const appConfigObj = require(appConfigPath).default;
          const jsonContent = JSON.stringify(appConfigObj);
          fs.writeFileSync(outputFilePath, jsonContent);
        }
      } catch (err) {
        console.warn(err);
      }
    });
  }
}

export default MobileAppJsonPlugin;
