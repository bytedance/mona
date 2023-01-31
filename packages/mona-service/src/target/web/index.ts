import path from 'path';

import { chainModuleRule } from './chainModuleRule';
import { Platform, genWebHtml } from '../constants';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '@bytedance/mona-manager';

const { WEB } = Platform;

const web: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(WEB, tctx => {
    tctx.chainWebpack(webpackConfig => {
      const { isDev } = configHelper;
      const { cwd, projectConfig } = configHelper;

      webpackConfig
        .devtool(isDev ? projectConfig.abilities?.sourceMap! : false)
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
      chainPlugins(webpackConfig, configHelper, WEB, genWebHtml);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = web;
