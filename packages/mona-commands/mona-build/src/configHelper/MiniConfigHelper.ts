import path from 'path';
import webpack, { Configuration, DefinePlugin, RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMiniminzerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import BaseConfigHelper from './BaseConfigHelper';
import MiniEntryPlugin from '@/plugins/MiniEntryPlugin';
import { ConfigHelper } from '.';
import MiniAssetsPlugin from '@/plugins/MiniAssetsPlugin';
import OptimizeEntriesPlugin from '@/plugins/ChunksEntriesPlugin';

class MiniConfigHelper extends BaseConfigHelper {
  generate() {
    const miniEntryPlugin = new MiniEntryPlugin(this as unknown as ConfigHelper);

    const config: Configuration = {
      mode: this._createMode(),
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
    const extensions = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'];
    const moduleMatcher = new RegExp(`(${extensions.filter(e => e !== '.json').join('|')})$`);

    if (this.options.dev) {
      return {
        runtimeChunk: {
          name: 'runtime',
        },
        splitChunks: {
          cacheGroups: {
            // 缓存组配置，默认有vendors和default
            vendors: {
              name: 'vendors',
              test: moduleMatcher,
              chunks: 'initial',
              minChunks: 2,
              minSize: 0,
              priority: 2,
            },
          },
        },
      };
    }

    return {
      minimize: true,
      minimizer: [new TerserWebpackPlugin({ parallel: true, extractComments: false }), new CssMiniminzerPlugin()],
      splitChunks: {
        chunks: 'async', // 仅提取按需载入的module
        minSize: 30000, // 提取出的新chunk在两次压缩(打包压缩和服务器压缩)之前要大于30kb
        maxSize: 0, // 提取出的新chunk在两次压缩之前要小于多少kb，默认为0，即不做限制
        minChunks: 1, // 被提取的chunk最少需要被多少chunks共同引入
        maxAsyncRequests: 5, // 最大按需载入chunks提取数
        maxInitialRequests: 3, // 最大初始同步chunks提取数
        automaticNameDelimiter: '~', // 默认的命名规则（使用~进行连接）
        name: true,
        cacheGroups: {
          // 缓存组配置，默认有vendors和default
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
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
            presets: [
              [require.resolve('@babel/preset-env')],
              [require.resolve('@babel/preset-typescript')],
              [require.resolve('@babel/preset-react')],
            ],
          },
        },
      ],
    });

    const styleLoader = [
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
      require.resolve('less-loader'),
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

  // TODO: fix compressing css bug, when the extension is 'ttss'
  private _createPlugins(...extraPlugin: any[]) {
    return [
      ...extraPlugin,
      new MiniAssetsPlugin(this as unknown as ConfigHelper),
      new MiniCssExtractPlugin({
        filename: '[name].ttss',
      }),
      new DefinePlugin({
        BUILD_TARGET: JSON.stringify('mini'),
      }),

      new OptimizeEntriesPlugin(),
    ];
  }
}

export default MiniConfigHelper;
