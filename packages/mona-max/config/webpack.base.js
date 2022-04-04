const path = require("path");
const PostcssPluginRpxToVw = require("postcss-plugin-rpx2vw");
const TerserPlugin = require("terser-webpack-plugin");
const MvJSONPlugin = require('../utils/mvJsonPlugin');
const CreateUniqueId = require('../utils/createUniqueId');
const loaderUtils = require('loader-utils');
const buildId = CreateUniqueId()
const createModule = require('../utils/createVirtualModule');

module.exports = {
  entry: {
    // 创建的虚拟模块入口，详见createModule
    index: path.resolve(process.cwd(), './src/app.entry.js')
  },
  output: {
    path: path.resolve(process.cwd(), "./dist"),
    publicPath: ""
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: {
                getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                  if (localName === buildId) {
                    return localName;
                  }
                },
              },
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  PostcssPluginRpxToVw,
                  require.resolve('postcss-import'),
                  [
                    path.join(__dirname, '../utils/PostcssPreSelector.js'),
                    { selector: `#${buildId}` },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: {
                getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                  if (localName === buildId) {
                    return localName;
                  }
                },
              },
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  PostcssPluginRpxToVw,
                  require.resolve('postcss-import'),
                  [
                    path.join(__dirname, '../utils/PostcssPreSelector.js'),
                    { selector: `#${buildId}` },
                  ],
                ],
              },
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext][query]",
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
    extensions: [".js", ".jsx", ".ts", ".tsx", "..."]
  },
  plugins: [new MvJSONPlugin(), createModule(buildId)],
};
