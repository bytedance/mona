import path from 'path';
import { IPlugin } from '../../Service';
import { chainModuleRule } from './chainModuleRule';
import { chainOptimization } from './chainOptimization';
import { chainPlugins } from './chainPlugins';
import { chainResolve } from './chainResolve';
import { TARGET } from './constants';

const web: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(TARGET, tctx => {
    tctx.chainWebpack(webpackConfig => {
      const { isDev } = configHelper;
      const { cwd, projectConfig } = configHelper;
      webpackConfig
        .target('web')
        .devtool(projectConfig.abilities?.sourceMap!)
        .mode(isDev ? 'development' : 'production')
        .entry('app.entry')
        .add(path.join(configHelper.entryPath, '../app.entry.js'));
      webpackConfig.output
        .path(path.join(cwd, projectConfig.output))
        .filename('[name].[contenthash:7].js')
        .publicPath('/');
      chainResolve(webpackConfig, configHelper);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = web;
