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
    const { entryPath, cwd, projectConfig } = configHelper;

    tctx.configureWebpack(() => ({
      target: 'web',
      mode: 'development',
      devtool: 'cheap-source-map',
      entry: path.join(entryPath, '../app.entry.js'),
      output: {
        path: path.join(cwd, projectConfig.output),
        filename: '[name].[contenthash:7].js',
        publicPath: '/',
      },
    }));

    tctx.chainWebpack(webpackConfig => {
      chainResolve(webpackConfig, configHelper);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = web;
