import path from 'path';
import Config from 'webpack-chain';

import { chainModuleRule } from './chainModuleRule';
import { Platform, genPluginHtml } from '../constants';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '../../Service';

const { PLUGIN } = Platform;

const plugin: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(PLUGIN, tctx => {
    tctx.chainWebpack(webpackConfig => {
      const { isDev } = configHelper;
      const { cwd, projectConfig } = configHelper;

      let devtool: Config.DevTool = false;
      if (isDev) {
        devtool =
          projectConfig.abilities?.sourceMap === false
            ? false
            : projectConfig.abilities?.sourceMap || ('eval-cheap-module-source-map' as Config.DevTool);
      }

      webpackConfig
        .target('web')
        .devtool(devtool)
        .optimization.runtimeChunk(Boolean(isDev))
        .end()
        .mode(isDev ? 'development' : 'production')
        .entry('app.entry')
        .add(path.join(configHelper.entryPath, '..', 'app.entry.js'));
      webpackConfig.output
        .pathinfo(false)
        .path(path.join(cwd, projectConfig.output))
        .filename(isDev ? '[name].js' : '[name].[contenthash:7].js')
        .publicPath('/')
        .libraryTarget('umd')
        .globalObject('window');
      webpackConfig.output.set('chunkLoadingGlobal', `webpackJsonp_${projectConfig.projectName}_${Date.now()}`);
      chainResolve(webpackConfig, configHelper, PLUGIN);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, PLUGIN, genPluginHtml);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = plugin;
