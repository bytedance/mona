import log from '@/log';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import BaseBuilder from '@/builder/BaseBuilder';
import { DEFAULT_HOST, DEFAULT_PORT } from '@/constants';
import runBuild from '@/utils/runBuild';
import chalk from 'chalk';

class WebBuilder extends BaseBuilder {
  welcome() {
    const { configHelper } = this;
    const { projectConfig } = configHelper;
    console.log('');
    log(['配置', '产物目录', path.join(configHelper.cwd, projectConfig.output)]);
    log(['配置', '打包入口', path.join(configHelper.cwd, projectConfig.input)]);
    console.log('');
    console.log('');
  }

  start() {
    this.welcome();

    const { cwd, projectConfig } = this.configHelper;
    const staticDir = path.join(cwd, projectConfig.output);
    const port = projectConfig.dev?.port || DEFAULT_PORT;

    const devServer = new WebpackDevServer(
      {
        static: {
          directory: staticDir,
        },
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        port,
        // host: DEFAULT_HOST,
        // allowedHosts: 'all',
      },
      this.compiler,
    );

    devServer.startCallback(() => {
      console.log(chalk.green(`服务启动成功： http://${DEFAULT_HOST}:${port}`));
    });
  }

  build() {
    this.welcome();

    runBuild(this.compiler);
  }
}

export default WebBuilder;
