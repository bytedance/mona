import path from 'path';

import { genPluginHtml, Platform } from '../constants';
import { chainModuleRule } from '../plugin/chainModuleRule';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '../../Service';

const { H5 } = Platform;

const mobile: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(H5, tctx => {
    tctx.chainWebpack(webpackConfig => {
      const { isDev } = configHelper;
      const { cwd, projectConfig } = configHelper;
      webpackConfig
        .devtool(projectConfig.abilities?.sourceMap!)
        .mode(isDev ? 'development' : 'production')
        .entry('app.entry')
        .add(path.join(configHelper.entryPath, '..', 'app.entry.js'));
      webpackConfig.output
        .path(path.join(cwd, projectConfig.output))
        .filename('[name].[contenthash:7].js')
        .publicPath('/')
        .libraryTarget('umd')
        .globalObject('window');

      webpackConfig.output.set('chunkLoadingGlobal', `webpackJsonp_${projectConfig.projectName}_${Date.now()}`);
      chainResolve(webpackConfig, configHelper, H5);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, H5, genPluginHtml);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = mobile;
