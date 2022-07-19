import chalk from 'chalk';
import path from 'path';
import webpack from 'webpack';

import WebpackDevServer from 'webpack-dev-server';
import { IPlugin } from '../../Service';
import { DEFAULT_HOST, DEFAULT_PORT } from '../constants';
import { chainModuleRule } from './chainModuleRule';
import { chainOptimization } from './chainOptimization';
import { chainPlugins } from './chainPlugins';
import { chainResolve } from './chainResolve';
import { TARGET } from './constants';
const plugin: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(TARGET, tctx => {
    tctx.overrideStartCommand(args => {
      const { builder } = tctx;
      const webpackConfig = builder.resolveWebpackConfig();
      if (!webpackConfig) {
        return;
      }

      if (builder) {
        const compiler = webpack(webpackConfig);
        const { cwd, projectConfig } = builder.configHelper;
        const staticDir = path.join(cwd, projectConfig.output);
        const port = args.port || projectConfig.dev?.port || DEFAULT_PORT;

        const devServer = new WebpackDevServer(
          {
            static: {
              directory: staticDir,
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            hot: true,
            open: true,
            historyApiFallback: true,
            compress: true,
            port,
            allowedHosts: 'all',
            host: DEFAULT_HOST,
            client: {
              overlay: {
                errors: true,
                warnings: false
              }
            }
          },
          compiler,
        );

        devServer.startCallback(() => {
          console.log(chalk.green(`服务启动成功： http://${DEFAULT_HOST}:${port}`));
        });
      }
    });
    tctx.chainWebpack(webpackConfig => {
      const { isDev } = configHelper;
      const { cwd, projectConfig } = configHelper;
      // webpackConfig.devServer.hot(isDev);
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
      chainResolve(webpackConfig, configHelper);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = plugin;
