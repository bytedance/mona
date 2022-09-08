import path from 'path';
import Config from 'webpack-chain';

import { chainModuleRule } from './chainModuleRule';
import { Platform, WEB_HTML } from '../constants';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '../../Service';

const { WEB } = Platform;

const web: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(WEB, tctx => {
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
        .add(path.join(configHelper.entryPath, '../app.entry.js'));
      webpackConfig.output
        .pathinfo(false)
        .path(path.join(cwd, projectConfig.output))
        .filename(isDev ? '[name].js' : '[name].[contenthash:7].js')
        .publicPath('/');
      chainResolve(webpackConfig, configHelper, WEB);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, WEB, WEB_HTML);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = web;
