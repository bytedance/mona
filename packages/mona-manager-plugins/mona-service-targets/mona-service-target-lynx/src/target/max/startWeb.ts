import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import ora from 'ora';
import chalk from 'chalk';
import { NavComponent } from '.';
import path from 'path';
import fs from 'fs';

let alreadyStart = false;

// 工具函数：应用 mona.config.js 的 chain 字段
function applyMonaChainConfig(webpackConfig: any) {
  // 支持 mona.config.ts 和 mona.config.js，优先 ts
  const tsConfigPath = path.resolve(process.cwd(), 'mona.config.ts');
  const jsConfigPath = path.resolve(process.cwd(), 'mona.config.js');
  let configPath = '';
  if (fs.existsSync(tsConfigPath)) {
    configPath = tsConfigPath;
  } else if (fs.existsSync(jsConfigPath)) {
    configPath = jsConfigPath;
  } else {
    return webpackConfig;
  }
  // 清除 require 缓存，支持本地开发热更新
  delete require.cache[require.resolve(configPath)];
  const rawConfig = require(configPath);
  const monaConfig = rawConfig.default || rawConfig;
  if (typeof monaConfig.chain === 'function') {
    const Config = require('webpack-chain');
    const chainConfig = new Config();
    monaConfig.chain(chainConfig);
    const chainResult = chainConfig.toConfig();
    // 用 webpack-merge 合并，防止覆盖
    const { merge } = require('webpack-merge');
    return merge(webpackConfig, chainResult);
  }
  return webpackConfig;
}

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
    webpackConfig = applyMonaChainConfig(webpackConfig);
    const webpackCompiler = webpack(webpackConfig);
    const devConfig = webpackConfig.devServer;
    const devServer = new WebpackDevServer(devConfig, webpackCompiler);

    alreadyStart = true;
    return devServer.start();
  } else {
    let webpackConfig = require('./webpack-config/webpack.prod')({ entry, useWebExt: false, appid });
    webpackConfig = applyMonaChainConfig(webpackConfig);
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

export function buildWeb({
  entry,
  appid,
  navComponent,
  debugPage,
}: {
  entry: string;
  appid: string;
  navComponent?: NavComponent;
  debugPage: string;
}) {
  let webpackConfig = require('./webpack-config/webpack.prod')({
    entry,
    useWebExt: false,
    appid,
    navComponent,
    debugPage,
  });
  webpackConfig = applyMonaChainConfig(webpackConfig);
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