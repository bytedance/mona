import { ConfigHelper } from '@bytedance/mona-manager';
import Config from 'webpack-chain';
import path from 'path';
import { chainResolve } from './chainResolve';
import { chainModuleRule } from './chainModuleRule';
import { chainPlugins } from './chainPlugins';
import { chainOptimization } from './chainOptimization';
import { Platform } from '@bytedance/mona-manager-plugins-shared';


function chain(webpackConfig: Config, configHelper: ConfigHelper, TARGET: Platform) {
  const { cwd, projectConfig } = configHelper;
  webpackConfig
    .devtool(configHelper.isDev ? projectConfig.abilities?.sourceMap! : false)
    .mode(configHelper.isDev ? 'development' : 'production')
    .entry('app.entry')
    .add(path.join(configHelper.entryPath, '../..', 'node_modules/.mona/app.entry'));
  webpackConfig.output
    .path(path.join(cwd, projectConfig.output))
    .filename(configHelper.isDev ? '[name].js' : '[name].[contenthash:7].js')
    .publicPath('/')

  chainResolve(webpackConfig, configHelper, TARGET);
  chainModuleRule(webpackConfig, configHelper, TARGET);
  chainPlugins(webpackConfig, configHelper, TARGET);
  chainOptimization(webpackConfig);
}

export default chain;