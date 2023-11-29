// import ora from 'ora';
import path from 'path';
import chalk from 'chalk';

import { rspack, StatsCompilation, MultiStats, Stats } from '@rspack/core';
import { RspackDevServer } from '@rspack/dev-server';
import Builder, { ChainWebpackConfigFn, RawWebpackConfigFn } from './Builder';
import { DEFAULT_PORT, DEFAULT_HOST } from '@bytedance/mona-shared';
import { formatStatsMessages } from './utils/formatStats';
import log from './utils/log';

type Fn = (args: Record<string, any>) => void;

function formatStats(stats: Stats | MultiStats, showWarnings = true) {
  const statsData = stats.toJson({
    preset: 'errors-warnings',
  });

  const { errors, warnings } = formatStatsMessages(statsData);

  if (errors.length) {
    const errorMsgs = `${errors.join('\n\n')}\n`;
    const isTerserError = errorMsgs.includes('from Terser');
    const title = chalk.bold(
      chalk.red(isTerserError ? `Minify error: ` : `Compile error: `),
    );
    const tip = chalk.yellow(
      isTerserError
        ? `Failed to minify with terser, check for syntax errors.`
        : 'Failed to compile, check the errors for troubleshooting.',
    );

    return {
      message: `${title}\n${tip}\n${errorMsgs}`,
      level: 'error',
    };
  }

  // always show warnings in tty mode
  if (warnings.length && (showWarnings || process.stdout.isTTY)) {
    const title = chalk.bold(chalk.yellow(`Compile Warning: \n`));
    return {
      message: `${title}${`${warnings.join('\n\n')}\n`}`,
      level: 'warning',
    };
  }

  return {};
}

class TargetContext {
  target: string;
  builder: Builder;
  startFn: Fn;
  buildFn: Fn;

  constructor(name: string, builder: Builder) {
    this.target = name;
    this.builder = builder.clone();
    this.startFn = this._defaultStartFn.bind(this);
    this.buildFn = this._defaultBuildFn.bind(this);
  }

  private _defaultBuildFn() {
    const { builder } = this;
    const webpackConfig = builder.resolveWebpackConfig();
    if (!webpackConfig) {
      return;
    }

    // @ts-ignore
    console.log(webpackConfig, webpackConfig.module?.rules?.[2]?.use)
    const compiler = rspack(webpackConfig as any);
    compiler.run((err, statsOrigin) => {
      if (err) {
        throw err
      }

      const stats = statsOrigin!;
      const obj = stats.toJson({
        all: false,
        timings: true,
      });

      const printTime = (c: StatsCompilation) => {
        if (c.time) {
          const time = (c.time / 1000).toFixed(2) + 's';
          // const target = Array.isArray(context.target)
          //   ? context.target[index]
          //   : context.target;
          // const name = TARGET_ID_MAP[target || 'web'];
          console.log(`Client compiled in ${time}`);
        }
      };

      if (!stats.hasErrors()) {
        if (obj.children) {
          obj.children.forEach((c) => {
            printTime(c);
          });
        } else {
          printTime(obj);
        }
      }

      const { message, level } = formatStats(stats);

      if (level === 'error') {
        log.error(message);
      }
      if (level === 'warning') {
        log.warn(message);
      }

      process.exit();
    })
  }

  private _defaultStartFn(args: Record<string, any>) {
    const { builder, target } = this;
    const webpackConfig = builder.resolveWebpackConfig();
    if (!webpackConfig) {
      return;
    }

    // console.log("uses rspack", webpackConfig);
    if (builder) {
      const compiler = rspack(webpackConfig as any);
      const { cwd, projectConfig } = builder.configHelper;
      const staticDir = path.join(cwd, projectConfig.output);
      const port = args.port || projectConfig.dev?.port || DEFAULT_PORT;

      const devServerConfig: any =
        webpackConfig.devServer ||
        Object.assign(
          {},
          {
            static: {
              directory: staticDir,
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            hot: true,
            open: true,
            historyApiFallback: true,
            compress: true,
            port: DEFAULT_PORT,
            allowedHosts: 'all',
            host: DEFAULT_HOST,
            client: {
              overlay: {
                errors: true,
                warnings: false,
              },
            },
          },
          projectConfig.dev,
          { port },
        );

      const devServer = new RspackDevServer(devServerConfig, compiler);

      devServer.startCallback(() => {
        if (target !== 'max') {
          console.log(chalk.green(`服务启动成功： http://${DEFAULT_HOST}:${port}`));
        }
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
