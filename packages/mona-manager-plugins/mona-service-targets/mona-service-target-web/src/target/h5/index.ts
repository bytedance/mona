import path from 'path';
import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { genH5Html } from '../utils/genHtml';
import { chainModuleRule } from './chainModuleRule';
import { chainOptimization } from './chainOptimization';
import { chainPlugins } from '../utils/chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { IPlugin } from '@bytedance/mona-manager';

import MaxSubAutoTypeWebpackPlugin from './plugins/MaxMainAutoTypeWebpackPlugin';

const { H5 } = Platform;

const mobile: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(H5, tctx => {
    tctx.chainWebpack(webpackConfig => {
      const { cwd, projectConfig } = configHelper;
      webpackConfig
        .devtool(configHelper.isDev ? projectConfig.abilities?.sourceMap! : false)
        .optimization.runtimeChunk(Boolean(configHelper.isDev))
        .end()
        .mode(configHelper.isDev ? 'development' : 'production')
        .entry('app.entry')
        .add(path.join(configHelper.entryPath, '../app.entry.js'));
      webpackConfig.output
        .pathinfo(false)
        .path(path.join(cwd, projectConfig.output))
        .chunkFilename('[id].bundle.js')
        .publicPath('/');

      // if (process.env.ENTRY_TYPE === 'js' && !configHelper.isDev) {
      //   // webpackConfig.externals({ react: 'react', 'react-dom': 'react-dom', 'react-router-dom': 'react-router-dom' });
      //   // webpackConfig.output.libraryTarget('umd');
      // }
      chainResolve(webpackConfig, configHelper, H5);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, H5, genH5Html);
      chainOptimization(webpackConfig, configHelper);

      const isDev = process.env.NODE_ENV !== 'production';
      isDev && webpackConfig.plugin('MaxSubAutoTypeWebpackPlugin').use(MaxSubAutoTypeWebpackPlugin)
    });
  });
};

module.exports = mobile;
