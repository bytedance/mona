import Config from 'webpack-chain';
import ConfigHelper from '@/ConfigHelper';
import { MonaPlugins } from '@/plugins';

import getEnv from '../utils/getEnv';
import { WEB_HTML, TARGET } from './constants';

export function chainPlugins(webpackConfig: Config, configHelper: ConfigHelper) {
  const { cwd, isDev, projectConfig } = configHelper;
  const {
    CopyPublicPlugin,
    ConfigHMRPlugin,
    HtmlWebpackPlugin,
    DefinePlugin,
    ReactRefreshWebpackPlugin,
    MiniCssExtractPlugin,
  } = MonaPlugins;

  webpackConfig.when(
    isDev,
    w => w.plugin('ReactRefreshWebpackPlugin').use(ReactRefreshWebpackPlugin),
    w => w.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [{ filename: '[name].[contenthash:7].css' }]),
  );
  webpackConfig.plugin('ConfigHMRPlugin').use(ConfigHMRPlugin, [configHelper]);
  webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [configHelper]);
  webpackConfig.plugin('HtmlWebpackPlugin').use(
    new HtmlWebpackPlugin({
      templateContent: WEB_HTML,
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
