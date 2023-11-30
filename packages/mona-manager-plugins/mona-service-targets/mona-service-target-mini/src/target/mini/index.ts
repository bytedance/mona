import chalk from 'chalk';
import path from 'path';
import webpack, { StatsCompilation } from 'webpack';

import { IPlugin, formatStats, log } from '@bytedance/mona-manager';
import { MonaPlugins } from '@/plugins';

import { chainModuleRule } from './chainModuleRule';
import { chainOptimization } from './chainOptimization';
import { chainPlugins } from './chainPlugins';
import { chainResolve } from '../utils/chainResolve';
import { Platform } from '@bytedance/mona-manager-plugins-shared';

const { MINI } = Platform;

const mini: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(MINI, tctx => {
    const { cwd, projectConfig } = configHelper;

    tctx.overrideStartCommand(() => {
      const { builder } = tctx;
      const webpackConfig = builder.resolveWebpackConfig();
      if (!webpackConfig) {
        return;
      }
      const compiler = webpack(webpackConfig);

      compiler.watch(
        {
          aggregateTimeout: 1000,
          poll: false,
          ignored: /node_modules/,
        },
        (error: any, stats: any) => {
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
            chalk.red('编译失败');
            return;
          }
          if (stats?.hasWarnings()) {
            info?.warnings?.forEach((w: Error) => {
              console.log(chalk.yellow(w.message));
            });
          }
          console.log(chalk.green(`✅  编译成功 ${new Date().toLocaleString()}`));
          console.log(chalk.gray('文件修改监听中...'));
        },
      );
    });

    tctx.overrideBuildCommand(() => {
       const { builder } = tctx;
        const webpackConfig = builder.resolveWebpackConfig();
        if (!webpackConfig) {
          return;
        }

        // @ts-ignore
        // console.log(webpackConfig, webpackConfig.module?.rules?.[2]?.use)
        const compiler = webpack(webpackConfig as any);
        compiler.run((err, statsOrigin) => {
          if (err) {
            throw err;
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

          const { message, level } = formatStats(stats as any);

          if (level === 'error') {
            log.error(message);
          }
          if (level === 'warning') {
            log.warn(message);
          }

          process.exit();
        })
    });

    tctx.chainWebpack(webpackConfig => {
      const miniEntryPlugin = new MonaPlugins.MiniEntryPlugin(configHelper);
      webpackConfig
        .devtool(configHelper.isDev ? projectConfig.abilities?.sourceMap! : false)
        .merge({ entry: miniEntryPlugin.entryModule.entries })
        .mode(configHelper.isDev ? 'development' : 'production')
        .output.path(path.join(cwd, projectConfig.output))
        .publicPath('/')
        .globalObject('tt');
      webpackConfig.externals(['@bytedance/mona-client-plugin', '@bytedance/mona-client-web']);
      chainResolve(webpackConfig, configHelper, MINI);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, miniEntryPlugin);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = mini;
