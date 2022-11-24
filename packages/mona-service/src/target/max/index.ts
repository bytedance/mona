import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { IPlugin } from '../../Service';
import { Platform } from '../constants';
import { writeLynxConfig } from './writeLynxConfig';
import { ttmlToReactLynx } from './ttmlToReactLynx';
import { writeErrorBoundaryAndInjectProps } from './writeErrorBoundaryAndInjectProps';
import chokidar from 'chokidar';
const speedy = require('@ecom/mona-speedy');

const { MAX } = Platform;
const max: IPlugin = ctx => {
  const configHelper = ctx.configHelper;
  const monaConfig = configHelper.projectConfig;

  ctx.registerTarget(MAX, tctx => {
    const maxTmp = path.join(__dirname, '../../../dist/.maxTmp');
    // 原始webpack打包逻辑
    const webpackStart = tctx.startFn;
    const webpackBuild = tctx.buildFn;
    let pxToRem = false;
    const lynxEntry = path.join(maxTmp, monaConfig.input);
    const h5Entry = path.join(configHelper.cwd, monaConfig.input);
    let buildType = 'umd';

    // 复写start命令
    tctx.overrideStartCommand(args => {
      const { old } = args;
      try {
        if (!old) {
          // 新的lynx打包逻辑
          // 1.创建临时文件夹
          if (!fs.existsSync(maxTmp)) {
            fs.mkdirSync(maxTmp);
          }
          const sourceDir = path.join(configHelper.cwd, 'src');
          chokidar.watch(sourceDir).on('all', () => {
            // 1. 将ttml转成reactLynx并存储到临时文件夹中
            ttmlToReactLynx(maxTmp, configHelper);
            // 2. 加入errorboundary并且注入props
            writeErrorBoundaryAndInjectProps(maxTmp, configHelper, true);
          });
          // 3. 通过mona.config.ts生成lynx.config.ts
          writeLynxConfig(maxTmp, configHelper);
          // 4. 执行speedy dev
          // 由于父子进程同时监视文件会失效，模拟运行lynx-speedy dev --config xxx
          process.argv = process.argv
            .slice(0, 2)
            .concat(['dev', '--config', path.join(maxTmp, 'lynx.config.js'), '--config-name', 'reactLynxApp']);
          speedy.run();
          // const monaSpeedyPath = path.join(__dirname, './monaSpeedy.js');
          // child_process.execSync(`node ${monaSpeedyPath} dev --config ${path.join(maxTmp, 'lynx.config.js')}`, {
          //   stdio: 'inherit',
          // });
        } else {
          // 旧的打包逻辑
          tctx.configureWebpack(() => {
            monaConfig.chain = (pre: any) => pre;
            if (process.env.NODE_ENV === 'production') {
              return require('./webpack-config/webpack.prod')(buildType, h5Entry, pxToRem);
            }
            return require('./webpack-config/webpack.dev')(buildType, h5Entry, pxToRem);
          });
          webpackStart({});
        }
      } catch (err) {
        console.log('max-component start失败', err);
      }
    });
    // 复写build命令
    tctx.overrideBuildCommand(args => {
      const { old } = args;
      try {
        if (!old) {
          // 新的lynx打包逻辑

          // 1.创建临时文件夹
          if (!fs.existsSync(maxTmp)) {
            fs.mkdirSync(maxTmp);
          }
          // 1. 将ttml转成reactLynx并存储到临时文件夹中
          ttmlToReactLynx(maxTmp, configHelper);
          // 2. 加入errorboundary
          writeErrorBoundaryAndInjectProps(maxTmp, configHelper);
          // 3. 通过mona.config.ts生成lynx.config.ts
          writeLynxConfig(maxTmp, configHelper);
          // 4. 执行speedy dev
          process.argv = process.argv
            .slice(0, 2)
            .concat(['build', '--config', path.join(maxTmp, 'lynx.config.js'), '--config-name', 'dynamicComponent']);
          speedy.run();
          // 5. 通过webpack打包，先将reactLynx--》标准react产物，再走h5端的正常打包逻辑
          tctx.configureWebpack(() => {
            monaConfig.chain = (pre: any) => pre;
            if (process.env.NODE_ENV === 'production') {
              return require('./webpack-config/webpack.prod')(buildType, lynxEntry, pxToRem);
            }
            return require('./webpack-config/webpack.dev')(buildType, lynxEntry, pxToRem);
          });
          webpackBuild({});
        } else {
          // 旧的打包逻辑
          tctx.configureWebpack(() => {
            monaConfig.chain = (pre: any) => pre;
            if (process.env.NODE_ENV === 'production') {
              return require('./webpack-config/webpack.prod')(buildType, h5Entry, pxToRem);
            }
            return require('./webpack-config/webpack.dev')(buildType, h5Entry, pxToRem);
          });
          webpackBuild({});
        }
      } catch (err) {
        console.log('max-component build失败', err);
      }
    });
  });
  ctx.registerCommand(
    'max-template-start',
    {
      description: '店铺装修模版start',
      usage: 'mona-service max-template-start',
    },
    () => {
      const configPath = path.resolve(__dirname, '../utils/templateStart.js');
      child_process.execSync(`node ${configPath}`, { stdio: 'inherit' });
    },
  );
};

module.exports = max;
