import chalk from 'chalk';
import path from 'path';
import fse from 'fs-extra';
import webpack from 'webpack';

import { IPlugin } from '../../Service';
import { MonaPlugins } from '@/plugins';

import { chainModuleRule } from './chainModuleRule';
import { chainOptimization } from './chainOptimization';
import { chainPlugins } from './chainPlugins';
import { chainResolve } from './chainResolve';
import { TARGET } from './constants';

const mini: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(TARGET, tctx => {
    const { cwd, projectConfig, isDev } = configHelper;

    tctx.overrideStartCommand(() => {
      const { builder } = tctx;
      const webpackConfig = builder.resolveWebpackConfig();
      if (!webpackConfig) {
        return;
      }
      const compiler = webpack(webpackConfig);

      compiler.watch(
        {
          aggregateTimeout: 300,
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
            console.log(info.children[0].errors);
            fse.outputFile(
              '/Users/bytedance/Desktop/mona2/mona/packages/mona-service/src/target/mini/error.text',
              JSON.stringify(info.children[0].errors, null, 2),
            );
            process.exit(1);
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

    tctx.chainWebpack(webpackConfig => {
      const miniEntryPlugin = new MonaPlugins.MiniEntryPlugin(configHelper);
      webpackConfig
        .target('web')
        .devtool(projectConfig.abilities?.sourceMap!)
        .merge({ entry: miniEntryPlugin.entryModule.entries })
        .mode(isDev ? 'development' : 'production')
        .output.path(path.join(cwd, projectConfig.output))
        .publicPath('/')
        .globalObject('tt');
      webpackConfig.externals(['@bytedance/mona-client-plugin', '@bytedance/mona-client-web']);
      chainResolve(webpackConfig, configHelper);
      chainModuleRule(webpackConfig, configHelper);
      chainPlugins(webpackConfig, configHelper, miniEntryPlugin);
      chainOptimization(webpackConfig, configHelper);
    });
  });
};

module.exports = mini;
