import path from 'path';
import webpack, { Configuration, DefinePlugin, RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMiniminzerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import BaseConfigHelper from './BaseConfigHelper';
import MiniEntryPlugin from '@/plugins/webpack/MiniEntryPlugin';
import { ConfigHelper } from '.';
import MiniAssetsPlugin from '@/plugins/webpack/MiniAssetsPlugin';
import OptimizeEntriesPlugin from '@/plugins/webpack/ChunksEntriesPlugin';

import getEnv from '@/utils/getEnv';
import createPxtransformConfig from '@/utils/createPxtransformConfig';
import collectNativeComponent from '@/plugins/babel/CollectImportComponent';
import TransformJsxNamePlugin from '@/plugins/babel/TransformJsxName';
import CopyPublicPlugin from '@/plugins/webpack/CopyPublicPlugin';
import perfTemplateRender from '@/plugins/babel/PerfTemplateRender';
const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];
const moduleMatcher = new RegExp(`(${extensions.filter(e => e !== '.json').join('|')})$`);

class MiniConfigHelper extends BaseConfigHelper {
  generate() {
    const miniEntryPlugin = new MiniEntryPlugin(this as unknown as ConfigHelper);

    const config: Configuration = {
      mode: this._createMode(),
      target: 'web',
      devtool: false,
      output: this._createOutput(),
      entry: miniEntryPlugin.entryModule.entries,
      resolve: this._createResolve(),
      module: this._createModule(),
      plugins: this._createPlugins(miniEntryPlugin),
      optimization: this._createOptimization() as any,
    };

    const raw = this.projectConfig.raw;
    return raw ? raw(config) : config;
  }

  private _createOptimization() {
    const isDev = this.options.dev;
    const devOptimization = isDev
      ? {}
      : {
          minimize: true,
          minimizer: [
            new TerserWebpackPlugin({ parallel: true, extractComments: false }),
            new CssMiniminzerPlugin({ test: /\.ttss(\?.*)?$/i }),
          ],
        };
    return {
      usedExports: true,
      ...devOptimization,
      // 所有page共享运行时文件，用于每个page初始化, 每个page入口引入runtimeChunk。初始化一次
      // 不设置，每个入口 chunk 中直接嵌入 runtime。不会共享运行时，导致多react实例。初始化多次
      // 理解为初始化一次与初始化多次的区别
      runtimeChunk: {
        name: 'runtimeChunk',
      },

      splitChunks: {
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
      },
    };
  }

  private _createResolve() {
    return {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(this.cwd, './src'),
        '@bytedance/mona-runtime': path.resolve(this.cwd, 'node_modules/@bytedance/mona-runtime/dist/index.mini.js'),
      },
    };
  }

  private _createMode() {
    return this.options.dev ? 'development' : 'production';
  }

  private _createOutput() {
    return {
      path: path.join(this.cwd, this.projectConfig.output),
      publicPath: '/',
      globalObject: 'tt',
    };
  }

  private _createModule() {
    const module: webpack.ModuleOptions = {
      rules: this._createModuleRules(),
    };

    return module;
  }

  private _createModuleRules() {
    const rules: RuleSetRule[] = [];

    // handle script
    rules.push({
      test: /\.((j|t)sx?)$/i,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            plugins: [TransformJsxNamePlugin, this.projectConfig.compilerOptimization && perfTemplateRender].filter(
              Boolean,
            ),
            presets: [],
          },
        },
        {
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            plugins: [
              collectNativeComponent.bind(null, this as unknown as ConfigHelper),
              this.projectConfig.enableMultiBuild && [
                path.join(__dirname, '../plugins/babel/BabelPluginMultiTarget.js'),
                { target: 'mini', context: this.cwd, alias: this._createResolve().alias },
              ],
            ].filter(Boolean),
            presets: [
              [require.resolve('@babel/preset-env')],
              [require.resolve('@babel/preset-typescript')],
              [require.resolve('@babel/preset-react')],
            ],
          },
        },
        {
          loader: path.resolve(__dirname, '../loaders/ImportCustomComponentLoader'),
          options: {
            configHelper: this,
          },
        },
      ],
    });

    const pxtOptions = createPxtransformConfig('mini', this.projectConfig);

    const styleLoader: any[] = [
      MiniCssExtractPlugin.loader,
      {
        loader: require.resolve('css-loader'),
        options: {
          modules: {
            auto: (filename: string) => /\.module\.\w+$/i.test(filename),
            localIdentName: '[local]___[hash:base64:5]',
          },
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              require.resolve('postcss-import'),
              pxtOptions.enabled
                ? [path.join(__dirname, '..', './plugins/postcss/PostcssPxtransformer/index.js'), pxtOptions]
                : null,
            ].filter(p => !!p),
          },
        },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            javascriptEnabled: true
          }
        }
      }
    ];

    // handle style
    rules.push({
      test: /\.(c|le)ss$/i,
      use: styleLoader,
    });

    // handle assets
    rules.push({
      test: /\.(png|jpe?g|gif|webp)$/i,
      type: 'asset/resource',
    });
    rules.push({
      test: /\.svg$/i,
      type: 'asset/inline',
    });
    rules.push({
      test: /\.(ttf|eot|woff|woff2)$/i,
      type: 'asset/resource',
    });

    return rules;
  }

  private _createPlugins(...extraPlugin: any[]) {
    return [
      ...extraPlugin,

      new CopyPublicPlugin(this as unknown as ConfigHelper),
      new MiniAssetsPlugin(this as unknown as ConfigHelper),
      new MiniCssExtractPlugin({
        filename: '[name].ttss',
      }),
      new DefinePlugin(getEnv(this.options, this.cwd)),
      new OptimizeEntriesPlugin(),
      // new TransformJsxNamePlugin(),
    ].filter(Boolean);
  }
}

export default MiniConfigHelper;
