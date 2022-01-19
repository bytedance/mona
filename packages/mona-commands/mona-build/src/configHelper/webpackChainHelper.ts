import path from 'path';
import WebpackChain from 'webpack-chain';

import getEnv from '@/utils/getEnv';
import createPxtransformConfig from '@/utils/createPxtransformConfig';

import { ConfigHelper } from '.';
import { MonaPlugins } from './plugins';
import BaseConfigHelper from './BaseConfigHelper';

const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];
const moduleMatcher = new RegExp(`(${extensions.filter(e => e !== '.json').join('|')})$`);

const webpackConfig = new WebpackChain();
class MiniConfigHelper extends BaseConfigHelper {
  generate() {
    const miniEntryPlugin = new MonaPlugins.MiniEntryPlugin(this as unknown as ConfigHelper);
    const config = {
      target: 'web',
      devtool: false,
      entry: miniEntryPlugin.entryModule.entries,
    };

    this._createResolve();
    this._createMode();
    this._createPlugins();
    this._createOptimization();
    this._createModuleRules();
    this._createOutput();
    const finalConfig = webpackConfig.merge(config).toConfig();

    const raw = this.projectConfig.raw;
    return raw ? raw(finalConfig) : finalConfig;
  }

  private _createOptimization() {
    webpackConfig.optimization
      .usedExports(true)
      .runtimeChunk({ name: 'runtimeChunk' })
      .splitChunks({
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: moduleMatcher,
            chunks: 'initial',
            minChunks: 2,
            minSize: 0,
            priority: 10,
          },
        },
      });
    webpackConfig.optimization.when(!this.options.dev, c => {
      c.minimizer('terser-plugin')
        .use(MonaPlugins.TerserWebpackPlugin.terserMinify, [{ parallel: true, extractComments: false }])
        .end()
        .minimizer('css')
        .use(MonaPlugins.CssMinimizerPlugin.cssnanoMinify, [{ test: /\.ttss(\?.*)?$/i }]);
    });
  }

  private _createResolve() {
    webpackConfig.resolve.merge({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(this.cwd, './src'),
        '@bytedance/mona-runtime': path.resolve(this.cwd, 'node_modules/@bytedance/mona-runtime/dist/index.mini.js'),
      },
    });
  }

  private _createMode() {
    webpackConfig.mode(this.options.dev ? 'development' : 'production');
  }

  private _createOutput() {
    webpackConfig.output.path(path.join(this.cwd, this.projectConfig.output)).publicPath('/').globalObject('tt');
  }

  private _createModuleRules() {
    const jsRule = webpackConfig.module.rule('js').test(/\.((j|t)sx?)$/i);
    jsRule
      .use('babel')
      .loader('babel-loader')
      .options({
        babelrc: false,
        plugins: [
          MonaPlugins.babel.TransformJsxNamePlugin,
          this.projectConfig.compilerOptimization && MonaPlugins.babel.perfTemplateRender,
        ].filter(Boolean),
        presets: [],
      })
      .end()
      .use('babel2')
      .loader('babel-loader')
      .options({
        babelrc: false,
        plugins: [
          MonaPlugins.babel.collectNativeComponent.bind(null, this as unknown as ConfigHelper),
          this.projectConfig.enableMultiBuild && [
            path.join(__dirname, '../plugins/babel/BabelPluginMultiTarget.js'),
            { target: 'mini', context: this.cwd, alias: webpackConfig.toConfig().resolve?.alias },
          ],
        ].filter(Boolean),
        presets: [['@babel/preset-env'], ['@babel/preset-typescript'], ['@babel/preset-react']],
      })
      .end()
      .use('ImportCustomComponentLoader')
      .loader(path.resolve(__dirname, '../loaders/ImportCustomComponentLoader'))
      .options({ configHelper: this })
      .end();

    const pxtOptions = createPxtransformConfig('mini', this.projectConfig);
    const styleRule = webpackConfig.module.rule('style').test(/\.(c|le)ss$/i);
    styleRule.use('miniCss').loader(MonaPlugins.MiniCssExtractPlugin.loader);
    styleRule
      .use('cssLoader')
      .loader(require.resolve('css-loader'))
      .options({
        modules: {
          auto: (filename: string) => /\.module\.\w+$/i.test(filename),
          localIdentName: '[local]___[hash:base64:5]',
        },
      });

    styleRule
      .use('postcss')
      .loader(require.resolve('postcss-loader'))
      .options({
        postcssOptions: {
          plugins: [
            require.resolve('postcss-import'),
            pxtOptions.enabled
              ? [path.join(__dirname, '..', './plugins/postcss/PostcssPxtransformer/index.js'), pxtOptions]
              : null,
          ].filter(p => p),
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

    createAssetRules(webpackConfig);
  }

  private _createPlugins() {
    const config = this as unknown as ConfigHelper;
    webpackConfig.plugin('miniEntryPlugin').use(MonaPlugins.MiniEntryPlugin, [config]);
    webpackConfig.plugin('CopyPublicPlugin').use(MonaPlugins.CopyPublicPlugin, [config]);
    webpackConfig.plugin('MiniAssetsPlugin').use(MonaPlugins.MiniAssetsPlugin, [config]);
    webpackConfig.plugin('MiniCssExtractPlugin').use(MonaPlugins.MiniCssExtractPlugin, [{ filename: '[name].ttss' }]);
    webpackConfig.plugin('DefinePlugin').use(MonaPlugins.DefinePlugin, [getEnv(this.options, this.cwd)]);
    webpackConfig.plugin('OptimizeEntriesPlugin').use(MonaPlugins.OptimizeEntriesPlugin);
  }
}

export default MiniConfigHelper;

function createAssetRules(webpackChain: WebpackChain) {
  webpackChain.module
    .rule('img')
    .test(/\.(png|jpe?g|gif|webp)$/i)
    .type('asset/resource' as any);
  webpackChain.module
    .rule('svg')
    .test(/\.svg$/i)
    .type('asset/inline' as any);
  webpackChain.module
    .rule('font')
    .test(/\.(ttf|eot|woff|woff2)$/i)
    .type('asset/resource' as any);
}
