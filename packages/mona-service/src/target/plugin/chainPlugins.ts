import Config from 'webpack-chain';
import ConfigHelper from '@/ConfigHelper';
import { MonaPlugins } from '@/plugins';

import getEnv from '../utils/getEnv';
import { TARGET, genPluginHtml } from './constants';
import path from 'path';

export function chainPlugins(webpackConfig: Config, configHelper: ConfigHelper) {
  const { cwd, projectConfig } = configHelper;
  const {
    CopyPublicPlugin,
    ConfigHMRPlugin,
    HtmlWebpackPlugin,
    DefinePlugin,
    ReactRefreshWebpackPlugin,
    MiniCssExtractPlugin,
  } = MonaPlugins;

  webpackConfig.when(
    configHelper.isDev,
    w => w.plugin('ReactRefreshWebpackPlugin').use(ReactRefreshWebpackPlugin),
    w => w.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [{ filename: '[name].[contenthash:7].css' }]),
  );
  webpackConfig.plugin('ConfigHMRPlugin').use(ConfigHMRPlugin, [configHelper, true]);

  // 复制pigeon.json文件
  webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [configHelper, [{
    from: path.join(cwd, 'pigeon.json'),
    noErrorOnMissing: true
  }]]);
  webpackConfig.plugin('HtmlWebpackPlugin').use(
    new HtmlWebpackPlugin({
      templateContent: genPluginHtml(configHelper.buildId),

      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
  );
  webpackConfig.plugin('DefinePlugin').use(DefinePlugin, [
    {
      ...getEnv(TARGET, cwd),
      ...(projectConfig?.abilities?.define || {}),
    },
  ]);
}
