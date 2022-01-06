import { ConfigHelper } from '@/configHelper';
import { Compiler, Compilation } from 'webpack';
import { applyCopyWebpackPlugin, formatAppConfig } from './utils';

class TabBarAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'TabBarAssetsPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(this.pluginName, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: this.pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          const { appConfig, cwd } = this.configHelper;
          const formatedAppConfig = formatAppConfig(appConfig, cwd);
          applyCopyWebpackPlugin(compiler, this.configHelper, formatedAppConfig)
        },
      );
    });
  }
}

export default TabBarAssetsPlugin;
