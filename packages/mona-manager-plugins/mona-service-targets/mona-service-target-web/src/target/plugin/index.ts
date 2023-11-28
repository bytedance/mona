import path from 'path';
import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { chainModuleRule } from './chainModuleRule';
import { genPluginHtml } from '../utils/genHtml';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '@bytedance/mona-manager';

const { PLUGIN } = Platform;

const plugin: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(PLUGIN, tctx => {
    tctx.chainWebpack(webpackConfig => {
      const { cwd, projectConfig } = configHelper;
      webpackConfig
        .devtool(configHelper.isDev ? projectConfig.abilities?.sourceMap! : false)
        .optimization.runtimeChunk(Boolean(configHelper.isDev))
        .end()
        .mode(configHelper.isDev ? 'development' : 'production')
        .entry('app.entry')
        .add(path.join(configHelper.entryPath, '..', 'app.entry.js'));
      webpackConfig.output
        .pathinfo(false)
        .path(path.join(cwd, projectConfig.output))
        .filename(configHelper.isDev ? '[name].js' : '[name].[contenthash:7].js')
        .publicPath('/')
        .libraryTarget('umd')
        .globalObject('window');
      webpackConfig.output.set('chunkLoadingGlobal', `webpackJsonp_${projectConfig.projectName}_${Date.now()}`);
      chainResolve(webpackConfig, configHelper, PLUGIN);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, PLUGIN, genPluginHtml);
      chainOptimization(webpackConfig);
    });
  });
};

module.exports = plugin;
