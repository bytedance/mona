import path from 'path';

import { H5Html, Platform } from '../constants';
import { chainModuleRule } from './chainModuleRule';
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
        .devtool(isDev ? projectConfig.abilities?.sourceMap! : false)
        .optimization.runtimeChunk(Boolean(isDev))
        .end()
        .mode(isDev ? 'development' : 'production')
        .entry('index')
        .add(path.join(configHelper.entryPath, '../app.entry.js'));
      webpackConfig.output
        .pathinfo(false)
        .path(path.join(cwd, projectConfig.output))
        .filename('[name].js')
        .publicPath('/');

      if (process.env.ENTRY_TYPE === 'js' && !configHelper.isDev) {
        // webpackConfig.externals({ react: 'react', 'react-dom': 'react-dom', 'react-router-dom': 'react-router-dom' });
        // webpackConfig.output.libraryTarget('umd');
      }
      chainResolve(webpackConfig, configHelper, H5);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, H5, H5Html);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = mobile;
