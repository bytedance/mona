import path from 'path';
import WebpackChain from 'webpack-chain';

import getEnv from '@/utils/getEnv';
import createPxtransformConfig from '@/utils/createPxtransformConfig';

import { ConfigHelper } from '.';
import { MonaPlugins } from './plugins';
import BaseConfigHelper from './BaseConfigHelper';

const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];

class MiniConfigHelper extends BaseConfigHelper {
  webpackConfig: WebpackChain = new WebpackChain();
  generate() {
    const miniEntryPlugin = new MonaPlugins.MiniEntryPlugin(this as unknown as ConfigHelper);
    this.webpackConfig.target('web').devtool(false).merge({ entry: miniEntryPlugin.entryModule.entries });
    this._createResolve();
    this._createMode();
    this._createPlugins(miniEntryPlugin);
    this._createOptimization();
    this._createModuleRules();
    this._createOutput();

    const finalConfig = this.webpackConfig.toConfig();

    const raw = this.projectConfig.raw;
    return raw ? raw(finalConfig) : finalConfig;
  }

  private _createOptimization(optimization = this.webpackConfig.optimization) {
    optimization
      .usedExports(true)
      .runtimeChunk({ name: 'runtimeChunk' })
      .splitChunks({
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: new RegExp(`(${extensions.filter(e => e !== '.json').join('|')})$`),
            chunks: 'initial',
            minChunks: 2,
            minSize: 0,
            priority: 10,
          },
        },
      });
    optimization.when(!this.options.dev, c => {
      c.minimizer('terser-plugin')
        .use(MonaPlugins.TerserWebpackPlugin.terserMinify, [{ parallel: true, extractComments: false }])
        .end()
        .minimizer('css')
        .use(MonaPlugins.CssMinimizerPlugin.cssnanoMinify, [{ test: /\.ttss(\?.*)?$/i }]);
    });
  }

  private _createResolve() {
    const resolve = this.webpackConfig.resolve;
    resolve.extensions.merge(extensions);
    resolve.alias.merge({
      '@': path.resolve(this.cwd, './src'),
      '@bytedance/mona-runtime': path.resolve(this.cwd, 'node_modules/@bytedance/mona-runtime/dist/index.mini.js'),
    });
  }

  private _createMode() {
    this.webpackConfig.mode(this.options.dev ? 'development' : 'production');
  }

  private _createOutput() {
    this.webpackConfig.output.path(path.join(this.cwd, this.projectConfig.output)).publicPath('/').globalObject('tt');
  }

  private _createModuleRules() {
    const { TransformJsxNamePlugin, collectNativeComponent } = MonaPlugins.babel;
    const jsRule = this.webpackConfig.module.rule('js').test(/\.((j|t)sx?)$/i);
    jsRule
      .use('transformJsxName')
      .loader('babel-loader')
      .options({
        babelrc: false,
        plugins: [
          TransformJsxNamePlugin,
          this.projectConfig.compilerOptimization && MonaPlugins.babel.perfTemplateRender,
        ].filter(Boolean),
        presets: [],
      })
      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        babelrc: false,
        plugins: [
          collectNativeComponent.bind(null, this as unknown as ConfigHelper),
          this.projectConfig.enableMultiBuild && [
            path.join(__dirname, '../plugins/babel/BabelPluginMultiTarget.js'),
            { target: 'mini', context: this.cwd, alias: this.webpackConfig.toConfig().resolve?.alias },
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

    const styleRule = this.webpackConfig.module.rule('style').test(/\.(c|le)ss$/i);
    styleRule.use('MiniCssExtractPlugin.loader').loader(MonaPlugins.MiniCssExtractPlugin.loader);
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

    createAssetRules(this.webpackConfig);
  }

  private _createPlugins(miniEntryPlugin: any) {
    const config = this as unknown as ConfigHelper;
    const webpackConfig = this.webpackConfig;
    webpackConfig.plugin('miniEntryPlugin').use(miniEntryPlugin);
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
