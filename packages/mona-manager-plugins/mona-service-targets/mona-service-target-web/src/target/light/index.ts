import path from 'path';
import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { genPluginHtml } from '../utils/genHtml';
import { chainModuleRule } from '../plugin/chainModuleRule';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '@bytedance/mona-manager';

const { LIGHT } = Platform;

const light: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(LIGHT, tctx => {
    tctx.chainWebpack(webpackConfig => {
      const { cwd, projectConfig } = configHelper;
      webpackConfig
        .devtool(configHelper.isDev ? projectConfig.abilities?.sourceMap! : false)
        .mode(configHelper.isDev ? 'development' : 'production')
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
