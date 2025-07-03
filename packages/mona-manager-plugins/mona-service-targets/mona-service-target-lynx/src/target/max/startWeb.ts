import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import ora from 'ora';
import chalk from 'chalk';
import { NavComponent } from '.';

let alreadyStart = false;
export const startWeb = ({ entry, appid, navComponent, debugPage }: { entry: string, appid: string, navComponent?: NavComponent, debugPage: string }) => {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    if (alreadyStart) {
      return Promise.resolve();
    }
    let webpackConfig = require('./webpack-config/webpack.dev')({
      entry,
      useWebExt: false,
      appid,
      navComponent,
      debugPage,
    });
    const webpackCompiler = webpack(webpackConfig);
    const devConfig = webpackConfig.devServer;
    const devServer = new WebpackDevServer(devConfig, webpackCompiler);

    alreadyStart = true;
    return devServer.start();
  } else {
    let webpackConfig = require('./webpack-config/webpack.prod')({ entry, useWebExt: false, appid });
    const webpackCompiler = webpack(webpackConfig);

    const spinner = ora('编译web产物中...').start();
    spinner.color = 'green';
    webpackCompiler.run((error: any, stats: any) => {
      if (error) {
        throw error;
      }

      const info = stats?.toJson();

      if (stats?.hasErrors()) {
        info?.errors?.forEach((err: Error) => {
          console.log(chalk.red(err.message));
        });
        info?.children?.forEach((item: any) => {
          console.log(item?.errors);
        });

        spinner.fail('web编译失败');
        process.exit(1);
      }

      if (stats?.hasWarnings()) {
        info?.warnings?.forEach((w: Error) => {
          console.log(chalk.yellow(w.message));
        });
      }

      spinner.succeed(`web编译成功 ${new Date().toLocaleString()}`);
      process.exit(0);
    });
  }

  return Promise.resolve();
}
