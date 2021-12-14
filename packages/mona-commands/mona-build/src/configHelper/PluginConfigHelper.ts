import BaseConfigHelper from "./BaseConfigHelper";

import webpack, { RuleSetRule, Configuration, DefinePlugin } from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CssMiniminzerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import loaderUtils from 'loader-utils';
import { hexMD5 } from '../utils/md5';
import getEnv from '@/utils/getEnv';

import ConfigHMRPlugin from '../plugins/ConfigHMRPlugin';
import { Options } from "..";
import { HTML_HANDLE_TAG } from "@/constants";
import { ConfigHelper } from ".";

function createUniqueId() {
  const random = () => Number(Math.random().toString().substr(2)).toString(36)
  const arr = [String(Date.now())];
  function createId() {
      var num = random();
      arr.push(num)
  }
  var i = 0;
  while(i < 4) {
      createId();
      i++;
  }
  return hexMD5(arr.join(','));
}

class PluginConfigHelper extends BaseConfigHelper {
  buildId: string

  constructor(options: Required<Options>) {
    super(options);
    this.buildId = `_${createUniqueId()}`;
  }


  generate() {
    const config: Configuration = {
      mode: this._createMode(),
      devtool: this.options.dev ? 'cheap-source-map' : undefined,
      entry: this._createEntry(),
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
      splitChunks: {
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
            reuseExistingChunk: true
          }
        }
      }
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

  private _createEntry() {
     return path.join(this.entryPath, '..', 'app.entry.js')
  }

  private _createMode() {
    return this.options.dev ? 'development' : 'production';
  }

  private _createOutput() {
    return {
      path: path.join(this.cwd, this.projectConfig.output),
      filename: '[name].[contenthash:7].js',
      publicPath: '/',
      libraryTarget: 'umd',
      globalObject: 'window',
      chunkLoadingGlobal: `webpackJsonp_${this.projectConfig.projectName}_${Date.now()}`,
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
            plugins: [
              this.options.dev && require.resolve('react-refresh/babel')
            ].filter(Boolean)
          },
        },
      ],
    });

    const styleLoader = [
      {
        loader: require.resolve('css-loader'),
        options: {
          modules: {
            auto: (filename: string) => /\.module\.\w+$/i.test(filename),
            localIdentName: '[local]___[hash:base64:5]',
            getLocalIdent: (loaderContext: any, localIdentName: string, localName: string, options: any) => {
              // 配合PostcssPreSelector插件
              if (localName === this.buildId) {
                return localName;
              }

              if (!options.context) {
                options.context = loaderContext.rootContext;
              }

              const request = path
                .relative(options.context, loaderContext.resourcePath)
                .replace(/\\/g, '/');

              options.content = `${options.hashPrefix + request}+${localName}`;

              localIdentName = localIdentName.replace(/\[local\]/gi, localName);

              const hash = loaderUtils.interpolateName(
                loaderContext,
                localIdentName,
                options
              );

              return hash
            }
          },
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              require.resolve('postcss-import'),
              [path.join(__dirname, '..', './plugins/PostcssPreSelector.js'), { selector: `#${this.buildId}` }]
            ]
          }
        }
      },
      require.resolve('less-loader'),
    ]
    if (!this.options.dev) {
      styleLoader.unshift(MiniCssExtractPlugin.loader)
    } else {
      styleLoader.unshift(require.resolve('style-loader'))
    }

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
      use: [
        { loader: require.resolve('@svgr/webpack') },
      ]
    });
    rules.push({
      test: /\.(ttf|eot|woff|woff2)$/i,
      type: 'asset/resource',
    });

    return rules;
  }

  private _createPlugins() {
    let plugins: any[] = [
      new ConfigHMRPlugin(this as unknown as ConfigHelper),
      new HtmlWebpackPlugin({
        templateContent: `
          <!-- ${HTML_HANDLE_TAG} -->
          <!DOCTYPE html>
          <html id="${this.buildId}">
            <head>
              <meta charset="utf-8">
              <title>Mona Plugin</title>
              <meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `,
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: false,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new DefinePlugin(getEnv(this.options, this.cwd)),
    ]

    if (this.options.dev) {
      plugins = [
        new ReactRefreshWebpackPlugin(),
        ...plugins
      ]
    } else {
      plugins = [
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:7].css'
        }),
        ...plugins
      ]
    }
    return plugins;
  }
}

export default PluginConfigHelper;
