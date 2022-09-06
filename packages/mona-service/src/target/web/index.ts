import path from 'path';
import { IPlugin } from '../../Service';
import { chainModuleRule } from './chainModuleRule';
import { chainOptimization } from '../utils/chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { Platform, WEB_HTML } from '../constants';

const { WEB } = Platform;

const web: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(WEB, tctx => {
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
      chainResolve(webpackConfig, configHelper, WEB);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, WEB, WEB_HTML);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = web;
