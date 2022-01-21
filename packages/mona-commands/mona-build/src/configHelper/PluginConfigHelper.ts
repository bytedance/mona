import path from 'path';
import loaderUtils from 'loader-utils';
import WebpackChain from 'webpack-chain';

import { hexMD5 } from '@/utils/md5';
import getEnv from '@/utils/getEnv';
import { HTML_HANDLE_TAG } from '@/constants';

import { ConfigHelper } from '.';
import { Options } from '..';
import BaseConfigHelper from './BaseConfigHelper';

import { MonaPlugins } from '../plugins';

export function createUniqueId() {
  const random = () => Number(Math.random().toString().substr(2)).toString(36);
  const arr = [String(Date.now())];
  function createId() {
    var num = random();
    arr.push(num);
  }
  var i = 0;
  while (i < 4) {
    createId();
    i++;
  }
  return hexMD5(arr.join(','));
}

class PluginConfigHelper extends BaseConfigHelper {
  buildId: string;
  webpackConfig: WebpackChain = new WebpackChain();

  constructor(options: Required<Options>) {
    super(options);
    this.buildId = `_${createUniqueId()}`;
    this.init();
  }
  init() {
    this.webpackConfig
      .target('web')
      .devtool(this.options.dev ? 'cheap-source-map' : false)
      .mode(this.options.dev ? 'development' : 'production')
      .entry('app.entry')
      .add(path.join(this.entryPath, '..', 'app.entry.js'));

    this._createResolve();
    this._createOutput();
    this._createModuleRules();
    this._createPlugins();
    this._createOptimization();
  }

  generate() {
    const finalConfig = this.webpackConfig.toConfig();
    const { raw } = this.projectConfig;
    return typeof raw === 'function' ? raw(finalConfig) : finalConfig;
  }

  private _createOptimization(optimization = this.webpackConfig.optimization) {
    const { TerserWebpackPlugin, CssMinimizerPlugin } = MonaPlugins;
    optimization.when(!this.options.dev, op =>
      op
        .minimize(true)
        .minimizer('TerserWebpackPlugin')
        .use(new TerserWebpackPlugin({ parallel: true, extractComments: false }))
        .end()
        .minimizer('CssMinimizerPlugin')
        .use(CssMinimizerPlugin)
        .end()
        .splitChunks({
          chunks: 'async',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            reactBase: {
              name: 'react-chunk',
              test: /react/,
              chunks: 'initial',
              priority: 10,
            },
            common: {
              name: 'common',
              chunks: 'initial',
              priority: 2,
              minChunks: 2,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        }),
    );
  }

  private genAlias() {
    return {
      '@': path.resolve(this.cwd, './src'),
      '@bytedance/mona-runtime': path.resolve(this.cwd, 'node_modules/@bytedance/mona-runtime/dist/index.plugin.js'),
    };
  }
  private _createResolve() {
    const resolve = this.webpackConfig.resolve;
    resolve.extensions.merge(['.js', '.jsx', '.ts', '.tsx', '.json']);
    resolve.alias.merge(this.genAlias());
  }

  private _createOutput() {
    this.webpackConfig.output
      .path(path.join(this.cwd, this.projectConfig.output))
      .filename('[name].[contenthash:7].js')
      .publicPath('/')
      .libraryTarget('umd')
      .globalObject('window');
    this.webpackConfig.output.set('chunkLoadingGlobal', `webpackJsonp_${this.projectConfig.projectName}_${Date.now()}`);
  }

  createJsRule() {
    const jsRule = this.webpackConfig.module.rule('js').test(/\.((j|t)sx?)$/i);

    jsRule
      .use('babel')
      .loader(require.resolve('babel-loader'))
      .options({
        babelrc: false,
        // https://github.com/babel/babel/issues/12731
        sourceType: 'unambiguous',
        presets: [['@babel/preset-env'], ['@babel/preset-typescript'], ['@babel/preset-react']],
        plugins: [
          MonaPlugins.babel.collectNativeComponent.bind(null, this as unknown as ConfigHelper),
          [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
          this.options.dev && require.resolve('react-refresh/babel'),
          this.projectConfig.enableMultiBuild && [
            path.join(__dirname, '../plugins/babel/BabelPluginMultiTarget.js'),
            { target: 'plugin', context: this.cwd, alias: this.genAlias() },
          ],
        ].filter(Boolean),
      });
    jsRule
      .use('ttComponentLoader')
      .loader(path.resolve(__dirname, '../loaders/ImportCustomComponentLoader'))
      .options({ configHelper: this });
  }
  createCssRule() {
    const cssRule = this.webpackConfig.module.rule('css').test(/\.(c|le)ss$/i);
    createRule(this, cssRule);

    function createRule(configHelper: PluginConfigHelper, styleRule: WebpackChain.Rule<WebpackChain.Module>) {
      styleRule.use('style-loader').when(
        configHelper.options.dev,
        r => r.loader(require.resolve('style-loader')),
        r => r.loader(MonaPlugins.MiniCssExtractPlugin.loader),
      );
      styleRule
        .use('cssLoader')
        .loader(require.resolve('css-loader'))
        .options({
          importLoaders: 2,
          modules: {
            auto: true,
            localIdentName: '[local]___[hash:base64:5]',
            getLocalIdent: (loaderContext: any, localIdentName: string, localName: string, options: any) => {
              // 配合PostcssPreSelector插件
              if (localName === configHelper.buildId) {
                return localName;
              }

              if (!options.context) {
                options.context = loaderContext.rootContext;
              }

              const request = path.relative(options.context, loaderContext.resourcePath).replace(/\\/g, '/');

              options.content = `${options.hashPrefix + request}+${localName}`;

              localIdentName = localIdentName.replace(/\[local\]/gi, localName);

              const hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);

              return hash;
            },
          },
        });
      styleRule
        .use('postcss-loader')
        .loader(require.resolve('postcss-loader'))
        .options({
          postcssOptions: {
            plugins: [
              require.resolve('postcss-import'),
              [
                path.join(__dirname, '..', './plugins/postcss/PostcssPreSelector.js'),
                { selector: `#${configHelper.buildId}` },
              ],
            ],
          },
        });
      styleRule
        .use('less')
        .loader(require.resolve('less-loader'))
        .options({
          lessOptions: {
            javascriptEnabled: true,
          },
        });
    }
  }
  createAssetRule() {
    // as any 兼容webpack5
    const resourceType = 'asset/resource';

    this.webpackConfig.module
      .rule('img')
      .test(/\.(png|jpe?g|gif|webp)$/i)
      .set('type', resourceType);

    this.webpackConfig.module
      .rule('svg')
      .test(/\.svg$/i)
      .when(
        !!this.projectConfig.transformSvgToComponentInWeb,
        s => s.use('@svgr/webpack').loader(require.resolve('@svgr/webpack')),
        s => s.set('type', resourceType),
      );

    this.webpackConfig.module
      .rule('font')
      .test(/\.(ttf|eot|woff|woff2)$/i)
      .set('type', resourceType);
  }
  private _createModuleRules() {
    this.createJsRule();
    this.createCssRule();
    this.createAssetRule();
  }
  private _createPlugins() {
    const {
      CopyPublicPlugin,
      ConfigHMRPlugin,
      HtmlWebpackPlugin,
      DefinePlugin,
      ReactRefreshWebpackPlugin,
      MiniCssExtractPlugin,
    } = MonaPlugins;
    const config = this as unknown as ConfigHelper;
    const webpackConfig = this.webpackConfig;
    webpackConfig.when(
      this.options.dev,
      w => w.plugin('ReactRefreshWebpackPlugin').use(ReactRefreshWebpackPlugin),
      w => w.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [{ filename: '[name].[contenthash:7].css' }]),
    );
    webpackConfig.plugin('ConfigHMRPlugin').use(ConfigHMRPlugin, [config, true]);
    webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [config]);
    webpackConfig.plugin('HtmlWebpackPlugin').use(
      new HtmlWebpackPlugin({
        templateContent: genPluginHtml(this),
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
    webpackConfig.plugin('DefinePlugin').use(DefinePlugin, [getEnv(this.options, this.cwd)]);
  }
}

export default PluginConfigHelper;

export const genPluginHtml = (configHelper: PluginConfigHelper) => {
  return `
  <!-- ${HTML_HANDLE_TAG} -->
  <!DOCTYPE html>
  <html id="${configHelper.buildId}">
    <head>
      <meta charset="utf-8">
      <title>Mona Plugin</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"></head>
    <body>
      <div id="root"></div>
    </body>
  </html>
  `;
};
