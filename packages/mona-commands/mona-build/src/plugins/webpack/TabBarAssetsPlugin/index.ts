import { ConfigHelper } from '@/configHelper';
import { Compiler } from 'webpack';
import { formatAppConfig } from '@bytedance/mona-shared';
import { applyCopyWebpackPlugin } from './utils';

class TabBarAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'TabBarAssetsPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    const { appConfig, cwd } = this.configHelper;
    const formatedAppConfig = formatAppConfig(appConfig, cwd);
    applyCopyWebpackPlugin(compiler, this.configHelper, formatedAppConfig)
  }
}

export default TabBarAssetsPlugin;
