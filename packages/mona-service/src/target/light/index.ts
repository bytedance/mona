import path from 'path';

import { genPluginHtml, Platform } from '../constants';
import { chainModuleRule } from '../plugin/chainModuleRule';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '../../Service';

const { LIGHT } = Platform;

const light: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(LIGHT, tctx => {
    tctx.chainWebpack(webpackConfig => {
      const { isDev } = configHelper;
      const { cwd, projectConfig } = configHelper;
      webpackConfig
        .target('web')
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
      chainResolve(webpackConfig, configHelper, LIGHT);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, LIGHT, genPluginHtml);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = light;
