import path from 'path';
import Config from 'webpack-chain';

import ConfigHelper from '@/ConfigHelper';

import { chainModuleRule } from './chainModuleRule';
import { Platform, genPluginHtml } from '../constants';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '../../Service';

const { PLUGIN } = Platform;

export const chainWebpack = (configHelper: ConfigHelper, webpackConfig: Config, target: Platform) => {
  const { isDev } = configHelper;
  const { cwd, projectConfig } = configHelper;
  webpackConfig
    .target(target)
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
  chainResolve(webpackConfig, configHelper, target);
  chainModuleRule(webpackConfig, configHelper);
  chainPlugins(webpackConfig, configHelper, target, genPluginHtml);
  chainOptimization(webpackConfig, configHelper);
};

const plugin: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(PLUGIN, tctx => {
    tctx.chainWebpack(webpackConfig => {
      chainWebpack(configHelper, webpackConfig, PLUGIN);
    });
  });
};

module.exports = plugin;
