import path from 'path';
import WebpackChain from 'webpack-chain';

import getEnv from '@/utils/getEnv';
import createPxtransformConfig from '@/utils/createPxtransformConfig';

import { ConfigHelper } from '.';
import { Options } from '..';
import BaseConfigHelper from './BaseConfigHelper';
import { MonaPlugins } from '../plugins';

const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];

class MiniConfigHelper extends BaseConfigHelper {
  webpackConfig: WebpackChain = new WebpackChain();
  constructor(options: Required<Options>) {
    super(options);
    this.init();
  }

  init() {
    const miniEntryPlugin = new MonaPlugins.MiniEntryPlugin(this as unknown as ConfigHelper);
    this.webpackConfig
      .target('web')
      .devtool(false)
      .merge({ entry: miniEntryPlugin.entryModule.entries })
      .mode(this.options.dev ? 'development' : 'production');

    this.createResolve();
    this.createPlugins(miniEntryPlugin);
    this.createOptimization();
    this.createModuleRules();
    this.createOutput();
  }

  generate() {
    const finalConfig = this.webpackConfig.toConfig();
    const { raw } = this.projectConfig;
    return typeof raw === 'function' ? raw(finalConfig) : finalConfig;
  }

  private createOptimization(optimization = this.webpackConfig.optimization) {
    optimization
      .usedExports(true)
      .runtimeChunk('single')
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

    optimization.when(!this.options.dev, op => {
      op.minimizer('TerserWebpackPlugin')
        .use(new MonaPlugins.TerserWebpackPlugin({ parallel: true, extractComments: false }))
        .end()
        .minimizer('CssMinimizerPlugin')
        .use(new MonaPlugins.CssMinimizerPlugin({ test: /\.ttss(\?.*)?$/i }));
    });
  }
  private genAlias() {
    return {
      '@': path.resolve(this.cwd, './src'),
      '@bytedance/mona-runtime': path.resolve(this.cwd, 'node_modules/@bytedance/mona-runtime/dist/index.mini.js'),
    };
  }
  private createResolve() {
    const resolve = this.webpackConfig.resolve;
    resolve.extensions.merge(extensions);
    resolve.alias.merge(this.genAlias());
  }

  private createOutput() {
    this.webpackConfig.output.path(path.join(this.cwd, this.projectConfig.output)).publicPath('/').globalObject('tt');
  }

  private createModuleRules() {
    const { TransformJsxNamePlugin, collectNativeComponent } = MonaPlugins.babel;
    const jsRule = this.webpackConfig.module.rule('js').test(/\.((j|t)sx?)$/i);

    jsRule
      .use('transformJsxName')
      .loader(require.resolve('babel-loader'))
      .options({
        babelrc: false,
        plugins: [
          TransformJsxNamePlugin,
          this.projectConfig.compilerOptimization && MonaPlugins.babel.perfTemplateRender,
        ].filter(Boolean),
      });

    jsRule
      .use('babel')
      .loader(require.resolve('babel-loader'))
      .options({
        babelrc: false,
        plugins: [
          collectNativeComponent.bind(null, this as unknown as ConfigHelper),
          this.projectConfig.enableMultiBuild && [
            path.join(__dirname, '../plugins/babel/BabelPluginMultiTarget.js'),
            { target: 'mini', context: this.cwd, alias: this.genAlias() },
          ],
        ].filter(Boolean),
        presets: [['@babel/preset-env'], ['@babel/preset-typescript'], ['@babel/preset-react']],
      });

    jsRule
      .use('ttComponentLoader')
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
        importLoaders: 2,
        modules: {
          auto: (filename: string) => /\.module\.\w+$/i.test(filename),
          localIdentName: '[local]___[hash:base64:5]',
        },
      });

    styleRule
      .use('postcss-loader')
      .loader(require.resolve('postcss-loader'))
      .options({
        postcssOptions: {
          plugins: [
            require.resolve('postcss-import'),
            pxtOptions.enabled
              ? [path.join(__dirname, '../plugins/postcss/PostcssPxtransformer/index.js'), pxtOptions]
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

  private createPlugins(miniEntryPlugin: any) {
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
