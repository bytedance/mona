import path from 'path';
import chalk from 'chalk';
import WebpackDevServer from 'webpack-dev-server';
import BaseBuilder from "@/builder/BaseBuilder";
import { DEAULT_HOST, DEFAULT_PORT } from '@/constants';
import compilerCallback from '@/utils/compilerCallback';

class WebBuilder extends BaseBuilder {
  start() {
    const { cwd, projectConfig } = this.configHelper;
    const staticDir = path.join(cwd, projectConfig.output);
    const port = projectConfig.dev?.port || DEFAULT_PORT;

    const devServer = new WebpackDevServer({
      static: {
        directory: staticDir,
      },
      hot: true,
      open: true,
      historyApiFallback: true,
      compress: true,
      port,
      // host: DEAULT_HOST,
      // allowedHosts: 'all',
    }, this.compiler);

    devServer.startCallback(() => {
      console.log(`starting server on http://${DEAULT_HOST}:${port}`);
    });
  }

  build() {
    console.log(chalk.cyan('开始打包'))
    this.compiler.run(compilerCallback);
  }
}

export default WebBuilder;