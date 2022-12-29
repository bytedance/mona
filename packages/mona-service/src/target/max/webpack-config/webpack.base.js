const path = require('path');
const fs = require('fs-extra');
const PostcssPluginRpxToVw = require('postcss-plugin-rpx2vw');
const Pxtorem = require('postcss-pxtorem');
const TerserPlugin = require('terser-webpack-plugin');
const MvJSONPlugin = require('../utils/mvJsonPlugin');
const CreateUniqueId = require('../utils/createUniqueId');
const buildId = CreateUniqueId();
const createModule = require('../utils/createVirtualModule');
const webpack = require('webpack');

const generateBaseConfig = options => {
  const { pxToRem, entry, useWebExt, appid } = options;

  let postcssPlugins = [
    PostcssPluginRpxToVw,
    require.resolve('postcss-import'),
    [path.join(__dirname, '../utils/PostcssPreSelector.js'), { selector: `#${buildId}` }]
  ].filter(p => !!p);
  if (pxToRem) {
    postcssPlugins = [
      PostcssPluginRpxToVw,
      Pxtorem({
        rootValue: 50, //结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
        propList: ['*'],
        exclude: /node_modules/i, //这里表示不处理node_modules文件夹下的内容
      }),
      require.resolve('postcss-import'),
      [path.join(__dirname, '../utils/PostcssPreSelector.js'), { selector: `#${buildId}` }],
    ];
  }

  return {
    entry: {
      // 创建的虚拟模块入口，详见createModule
      index: path.resolve(entry, '../app.entry.js'),
    },
    output: {
      path: path.resolve(process.cwd(), './dist'),
      publicPath: '',
    },
    // PERF: 这里修复不热更新的问题，以后优化下
    snapshot: {
      managedPaths:[]
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          }
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: require.resolve('style-loader'),
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 2,
                modules: {
                  getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                    return localName;
                  },
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: postcssPlugins,
                },
              },
            },
          ],
        },
        {
          test: /\.less$/i,
          use: [
            {
              loader: require.resolve('style-loader'),
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 2,
                modules: {
                  getLocalIdent: (loaderContext, localIdentName, localName) => {
                    return localName;
                  },
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: postcssPlugins,
                },
              },
            },
            {
              loader: require.resolve('less-loader'),
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              }
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext][query]',
          },
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '...'],
      alias: {
        '@bytedance/mona-runtime': '@bytedance/mona-client-max/dist/index.web.js'
      }
    },
    plugins: [new MvJSONPlugin(), createModule(entry, buildId, useWebExt), new webpack.DefinePlugin({
      '__MONA_APPID': JSON.stringify(appid),
    })],
  };
};

// let pxToRem = false;
// try {
//   const cwd = process.cwd();
//   const maxJsonPath = path.resolve(cwd, './mona.config.ts');
//   // const maxJsonPath = path.resolve(cwd, './max.json');
//   const maxJson = fs.readFileSync(maxJsonPath, 'utf-8');
//   pxToRem = maxJson.indexOf('pxToRem: true') !== -1;
//   // pxToRem = maxJson.indexOf('"pxToRem": true') !== -1;
// } catch (e) {
//   console.error(e);
// }

module.exports = generateBaseConfig;
