// @ts-nocheck
import path from 'path';
import fs from 'fs-extra';
import PostcssPluginRpxToVw from 'postcss-plugin-rpx2vw';
import TerserPlugin from 'terser-webpack-plugin';
import MvJsonPlugin from '../utils/mvJsonPlugin';
import CreateUniqueId from '../utils/createUniqueId';
import createModule from '../utils/createVirtualModule';
import { BUILD_TYPE } from '../constants';
import Pxtorem from 'postcss-pxtorem';
import deepMerge from 'lodash.merge';
const { merge } = require('webpack-merge');
const buildId = CreateUniqueId();

const generateBaseConfig = projectConfig => {
  const { pxToRem, abilities, buildType = BUILD_TYPE } = projectConfig;
  const { less = {} } = abilities || {};
  let postcssPlugins = [
    PostcssPluginRpxToVw,
    require.resolve('postcss-import'),
    [path.join(__dirname, '../utils/PostcssPreSelector.js'), { selector: `#${buildId}` }],
  ];
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

  const esmConfig = {
    output: {
      filename: '[name].esm.js',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
    externalsType: 'window',
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
  };

  const { name = '@shop-isv/isv-com' } = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf-8'),
  );

  const umdConfig = {
    output: {
      filename: '[name].umd.js',
      library: {
        name: [name, '[name]'],
        type: 'umd',
        export: 'default',
      },
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  };

  const baseConfig = {
    entry: {
      // 创建的虚拟模块入口，详见createModule
      index: path.resolve(process.cwd(), './src/app.entry.js'),
    },
    output: {
      path: path.resolve(process.cwd(), './dist'),
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          use: require.resolve('babel-loader'),
          exclude: /node_modules/,
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
              options: deepMerge(less, {
                lessOptions: {
                  javascriptEnabled: true,
                },
              }),
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
    },
    plugins: [new MvJsonPlugin(), createModule(buildId)],
  };
  const buildConfig = buildType === 'umd' ? umdConfig : esmConfig;

  return merge(baseConfig, buildConfig);
};

export default generateBaseConfig;
