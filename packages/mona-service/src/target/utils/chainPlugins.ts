import path from 'path';
import Config from 'webpack-chain';

import ConfigHelper from '@/ConfigHelper';
import { MonaPlugins } from '@/plugins';

import { Platform } from '../constants';
import getEnv from '../utils/getEnv';

export function chainPlugins(
  webpackConfig: Config,
  configHelper: ConfigHelper,
  TARGET: Platform,
  templateContent: any,
) {
  const { cwd, projectConfig } = configHelper;
  const {
    CopyPublicPlugin,
    ConfigHMRPlugin,
    HtmlWebpackPlugin,
    DefinePlugin,
    ReactRefreshWebpackPlugin,
    MiniCssExtractPlugin,
    ContextReplacementPlugin,
  } = MonaPlugins;

  webpackConfig.when(
    configHelper.isDev,
    w => w.plugin('ReactRefreshWebpackPlugin').use(ReactRefreshWebpackPlugin),
    w => w.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [{ filename: '[name].[contenthash:7].css' }]),
  );
  webpackConfig
    .plugin('ConfigHMRPlugin')
    .use(ConfigHMRPlugin, [configHelper, [Platform.LIGHT, Platform.PLUGIN].includes(TARGET)]);

  // 如果是plugin，需要复制pigeon.json文件
  TARGET !== Platform.PLUGIN
    ? webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [configHelper])
    : webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [
        configHelper,
        [
          {
            from: path.join(cwd, 'pigeon.json'),
            noErrorOnMissing: true,
          },
        ],
      ]);

  webpackConfig.plugin('HtmlWebpackPlugin').use(
    new HtmlWebpackPlugin({
      templateContent: typeof templateContent === 'function' ? templateContent(configHelper.buildId) : templateContent,
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

  webpackConfig.plugin('ContextReplacementPlugin').use(ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-ch/]);
}
