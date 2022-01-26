import Config from 'webpack-chain';
import ConfigHelper from '@/ConfigHelper';
import { MonaPlugins } from '../plugins';
import { HTML_HANDLE_TAG } from '../constants';
import getEnv from '../utils/getEnv';

const WEB_HTML = `
<!-- ${HTML_HANDLE_TAG} -->
<!DOCTYPE html>
<html style="font-size: 10vw">
  <head>
    <meta charset="utf-8">
    <title>Mona Web</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"></head>
  <body style="padding: 0; margin: 0;">
    <div id="root"></div>
  </body>
</html>
`;

export function chainPlugins(webpackConfig: Config, configHelper: ConfigHelper) {
  const { cwd } = configHelper;
  const {
    CopyPublicPlugin,
    ConfigHMRPlugin,
    HtmlWebpackPlugin,
    DefinePlugin,
    ReactRefreshWebpackPlugin,
    MiniCssExtractPlugin,
  } = MonaPlugins;
  const isProd = process.env.NODE_ENV === 'production';

  webpackConfig.when(
    !isProd,
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
  webpackConfig.plugin('DefinePlugin').use(DefinePlugin, [getEnv('web', cwd)]);
}
