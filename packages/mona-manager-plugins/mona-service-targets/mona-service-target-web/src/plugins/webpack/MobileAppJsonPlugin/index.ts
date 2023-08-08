import { ConfigHelper } from '@bytedance/mona-manager';
import { Compiler, sources } from 'webpack';
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
    compiler.hooks.emit.tap('MobileAppJsonPlugin', compilation => {
      try {
        const { cwd } = this.configHelper;
        const appConfigPath = fs.existsSync(path.join(cwd, APP_CONFIG_TS_PATH))
          ? path.join(cwd, APP_CONFIG_TS_PATH)
          : path.join(cwd, APP_CONFIG_JS_PATH);
        if (fs.existsSync(appConfigPath)) {
          const appConfigObj = require(appConfigPath).default;
          const jsonContent = JSON.stringify(appConfigObj);
          // 将目标文件的内容写入内存中
          const source = new sources.RawSource(jsonContent);
          compilation.emitAsset('app.json', source);
        }
      } catch (err) {
        console.warn(err);
      }
    });
  }
}

export default MobileAppJsonPlugin;
