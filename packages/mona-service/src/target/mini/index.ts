import path from 'path';
import { IPlugin } from '../../Service';
import { MonaPlugins } from '../plugins';
import { chainModuleRule } from './chainModuleRule';
import { chainOptimization } from './chainOptimization';
import { chainPlugins } from './chainPlugins';
import { chainResolve } from './chainResolve';

const mini: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget('mini', tctx => {
    const { cwd, projectConfig, isDev } = configHelper;
    tctx.chainWebpack(webpackConfig => {
      const miniEntryPlugin = new MonaPlugins.MiniEntryPlugin(configHelper);
      webpackConfig
        .target('web')
        .devtool(false)
        .merge({ entry: miniEntryPlugin.entryModule.entries })
        .mode(isDev ? 'development' : 'production')
        .output.path(path.join(cwd, projectConfig.output))
        .publicPath('/')
        .globalObject('tt');

      chainResolve(webpackConfig, configHelper);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, miniEntryPlugin);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = mini;
