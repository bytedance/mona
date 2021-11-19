import path from 'path';
import webpack, { Configuration, RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMiniminzerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import BaseConfigHelper from "./BaseConfigHelper";
import MiniEntryPlugin from '@/plugins/MiniEntryPlugin';
import { ConfigHelper } from '.';

class MiniConfigHelper extends BaseConfigHelper {
  generate() {
    const config: Configuration = {
      mode: this._createMode(),
      devtool: this.options.dev ? 'cheap-source-map' : undefined,
      output: this._createOutput(),
      resolve: this._createResolve(),
      module: this._createModule(),
      plugins: this._createPlugins(),
      optimization: this._createOptimization() as any,
    };

    const raw = this.projectConfig.raw;
    return raw ? raw(config) : config;
  }

  private _createOptimization() {
    if (this.options.dev) return {};
    return {
      minimize: true,
      minimizer: [new TerserWebpackPlugin({ parallel: true, extractComments: false }), new CssMiniminzerPlugin()],
    }
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
    ]

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

  private _createPlugins() {
    return [
      new MiniEntryPlugin(this as unknown as ConfigHelper),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:7].css'
      })
    ]
  }
}

export default MiniConfigHelper