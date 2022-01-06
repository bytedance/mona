import BaseConfigHelper from "./BaseConfigHelper";

import webpack, { RuleSetRule, Configuration, DefinePlugin } from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CssMiniminzerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import ConfigHMRPlugin from '@/plugins/webpack/ConfigHMRPlugin';
import TabBarAssetsPlugin from '@/plugins/webpack/TabBarAssetsPlugin';
import { Options } from "..";
import { HTML_HANDLE_TAG } from "@/constants";
import { ConfigHelper } from ".";
import getEnv from '@/utils/getEnv';
import createPxtransformConfig from "@/utils/createPxtransformConfig";

class WebConfigHelper extends BaseConfigHelper {
  constructor(options: Required<Options>) {
    super(options);
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
        '@bytedance/mona-runtime': path.resolve(this.cwd, 'node_modules/@bytedance/mona-runtime/dist/index-web.js'),
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
            // https://github.com/babel/babel/issues/12731
            sourceType: 'unambiguous',
            presets: [
              [require.resolve('@babel/preset-env')],
              [require.resolve('@babel/preset-typescript')],
              [require.resolve('@babel/preset-react')],
            ],
            plugins: [
              [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
              this.options.dev && require.resolve('react-refresh/babel'),
              this.projectConfig.enableMultiBuild && [path.join(__dirname, '../plugins/babel/BabelPluginMultiTarget.js'), { target: 'web', context: this.cwd, alias: this._createResolve().alias }]
            ].filter(Boolean)
          },
        },
      ],
    });

    const pxtOptions = createPxtransformConfig('web', this.projectConfig);

    const styleLoader = [
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
              pxtOptions.enabled ? [path.join(__dirname, '..', './plugins/postcss/PostcssPxtransformer/index.js'), pxtOptions] : null
            ].filter(p => !!p)
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
      type: !this.projectConfig.transformSvgToComponentInWeb ? 'asset/resource' : undefined,
      use: this.projectConfig.transformSvgToComponentInWeb ? [{ loader: require.resolve('@svgr/webpack') }] : undefined,
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
      new TabBarAssetsPlugin(this as unknown as ConfigHelper),
      // 75 / 750 * 100 = 10
      new HtmlWebpackPlugin({
        templateContent: `
          <!-- ${HTML_HANDLE_TAG} -->
          <!DOCTYPE html>
          <html style="font-size: 10vw">
            <head>
              <meta charset="utf-8">
              <title>Mona Web</title>
              <meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body style="padding: 0; margin: 0;">
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

export default WebConfigHelper;
