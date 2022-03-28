const fs = require('fs');
const path = require("path");
const {merge} = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default;
const baseConfig = require("./webpack.base.js");
const umdConfig = require("./build-umd-config.js");
const esmConfig = require("./build-esm-config.js");
const { DEV_SERVER_PORT, AfterBuildPlugin, TARGET_URL } = require('../utils/maxDevServer');

const {name = '@shop-isv/isv-com'} = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf-8'));

const devConfig = {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(process.cwd(), "./src"),
    },
    client: {
      logging: 'info'
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      "Cache-Control": "no-cache"
    },
    allowedHosts: 'all',
    compress: true,
    hot: true,
    port: DEV_SERVER_PORT,
    open: {
      target: [TARGET_URL]
    },
    https: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
            <head>
                <title>@max-com/isv-comp</title>
                <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            </head>
            <body></body>
                <div id="root"></div>
                <script>
                    window.onload = () => {
                        ReactDOM.render(window['${name}'].index(), document.getElementById('root'));
                    };
                </script>
            </body>
        </html>`,
    }),
    new AfterBuildPlugin(),
    new WatchExternalFilesPlugin({
      files: [
        path.join(process.cwd(), "./src/schema.json"),
      ]
    })
  ]
};



module.exports = function (buildType) {
  const moduleConfig = buildType === "umd" ? umdConfig : esmConfig;
  if (buildType !== "umd") {
    delete devConfig.devServer;
    delete devConfig.plugins;
  }

  return merge(baseConfig, devConfig, moduleConfig);
}
