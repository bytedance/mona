import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import Builder, { ChainWebpackConfigFn, RawWebpackConfigFn } from './Builder';
import { DEFAULT_PORT, DEFAULT_HOST } from './target/constants';

type Fn = (args: Record<string, any>) => void;

class TargetContext {
  target: string;
  builder: Builder;
  startFn: Fn;
  buildFn: Fn;

  constructor(name: string, builder: Builder) {
    this.target = name;
    this.builder = builder.clone();
    this.startFn = this._defaultStartFn;
    this.buildFn = this._defaultBuildFn;
  }

  private _defaultBuildFn() {
    const { builder } = this;
    const webpackConfig = builder.resolveWebpackConfig();
    if (!webpackConfig) {
      return;
    }

    const compiler = webpack(webpackConfig);

    const spinner = ora('编译中...').start();
    spinner.color = 'green';

    compiler.run((error: any, stats: any) => {
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

        spinner.fail('编译失败');
        process.exit(1);
      }

      if (stats?.hasWarnings()) {
        info?.warnings?.forEach((w: Error) => {
          console.log(chalk.yellow(w.message));
        });
      }

      spinner.succeed(`编译成功 ${new Date().toLocaleString()}`);
      process.exit(0);
    });
  }

  private _defaultStartFn(args: Record<string, any>) {
    const { builder } = this;
    const webpackConfig = builder.resolveWebpackConfig();
    if (!webpackConfig) {
      return;
    }

    if (builder) {
      const compiler = webpack(webpackConfig);
      const { cwd, projectConfig } = builder.configHelper;
      const staticDir = path.join(cwd, projectConfig.output);
      const port = args.port || projectConfig.dev?.port || DEFAULT_PORT;

      const devServerConfig = webpackConfig.devServer || {
        static: {
          directory: staticDir,
        },
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        port,
        client: {
          overlay: {
            errors: true,
            warnings: false,
          },
        },
      };

      const devServer = new WebpackDevServer(devServerConfig, compiler);

      devServer.startCallback(() => {
        console.log(chalk.green(`服务启动成功： http://${DEFAULT_HOST}:${port}`));
      });
    }
  }

  overrideStartCommand(fn: Fn) {
    this.startFn = fn;
  }

  overrideBuildCommand(fn: Fn) {
    this.buildFn = fn;
  }

  // chain webpack config
  chainWebpack(fn: ChainWebpackConfigFn) {
    this.builder.chainWebpackConfigFns.push(fn);
  }

  // merge webpack config
  configureWebpack(fn: RawWebpackConfigFn) {
    this.builder.rawWebpackConfigFns.push(fn);
  }
}

export default TargetContext;
