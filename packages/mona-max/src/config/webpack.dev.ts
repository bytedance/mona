import path from 'path';
import { merge } from 'webpack-merge';
import generateBaseConfig from './webpack.base.js';
import AfterBuildPlugin from '../utils/maxDevServer';
import { TARGET_URL, WS_PORT, DEV_SERVER_PORT } from '../constants';

const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default;

module.exports = function (projectConfig) {
  const { targetUrl = TARGET_URL, wsPort = WS_PORT, devPort = DEV_SERVER_PORT } = projectConfig;
  const baseConfig = generateBaseConfig(projectConfig);
  const devConfig = {
    mode: 'development',
    devServer: {
      static: {
        directory: path.join(process.cwd(), './dist'),
      },
      client: {
        logging: 'info',
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        'Cache-Control': 'no-cache',
      },
      allowedHosts: 'all',
      compress: true,
      hot: true,
      port: devPort,
      open: {
        target: [`${targetUrl}?debug=1&WSPORT=${wsPort}`],
      },
    },
    plugins: [
      new AfterBuildPlugin(),
      new WatchExternalFilesPlugin({
        files: [path.join(process.cwd(), './src/schema.json')],
      }),
    ],
  };

  return merge(baseConfig, devConfig);
};
