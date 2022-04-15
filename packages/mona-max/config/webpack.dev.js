const fs = require('fs');
const path = require("path");
const {merge} = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default;
const baseConfig = require("./webpack.base.js");
const umdConfig = require("./build-umd-config.js");
const esmConfig = require("./build-esm-config.js");
const { DEV_SERVER_PORT, AfterBuildPlugin, TARGET_URL } = require('../utils/maxDevServer');
const getDevProps = require('../utils/getDevProps');

const {name = '@shop-isv/isv-com'} = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf-8'));
const schemaJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './src/schema.json'), 'utf-8'));
const devProps = getDevProps(schemaJson)

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
      target: [TARGET_URL, '']
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
                <style>
                  :root {
                    --color-primary: #7283ff;
                  }
                  *,
                  *::before,
                  *::after {
                    box-sizing: border-box;
                  }   
                  html {
                    -webkit-text-size-adjust: 100%;
                    line-height: 1.15;
                  }  
                  body {
                    margin: 0;
                    font-size: 14px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans",
                      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                    font-variant: tabular-nums;
                    line-height: 1.5715;
                    font-feature-settings: "tnum";
                  }             
                  #root {
                    position: relative;
                    height: 100vh;
                    overflow: hidden;
                  }
                </style>
            </head>
            <body></body>
                <div id="root"></div>
                <script>
                    function flexible() {
                      const metaEl = document.createElement('meta');
                      var scale = window.outerWidth / 375;
                      metaEl.setAttribute('name', 'viewport');
                      metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
                      document.head.prepend(metaEl);
                    }
                    flexible()
                    window.onload = () => {
                        const devProps = '${JSON.stringify(devProps)}'
                        ReactDOM.render(window['${name}'].index(JSON.parse(devProps)), document.getElementById('root'));
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
