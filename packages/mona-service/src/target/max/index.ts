import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { IPlugin } from '../../Service';
import { Platform } from '../constants';
import { writeLynxConfig } from './writeLynxConfig';
import { ttmlToReactLynx } from './ttmlToReactLynx';

const { MAX } = Platform;
const max: IPlugin = ctx => {
  const configHelper = ctx.configHelper;
  const monaConfig = configHelper.projectConfig;

  ctx.registerTarget(MAX, tctx => {
    const maxTmp = path.join(__dirname, '../../../dist/maxTmp');
    // 原始webpack打包逻辑
    // const webpackStart = tctx.startFn;
    // const webpackBuild = tctx.buildFn;
    let pxToRem = false;
    // if (monaConfig?.pxToRem === true) {
    //   pxToRem = true;
    // }
    const lynxEntry = path.join(maxTmp, monaConfig.input);
    let buildType = 'umd';
    // if (monaConfig?.buildType === 'esm') {
    //   buildType = 'esm';
    // }

    tctx.configureWebpack(() => {
      monaConfig.chain = (pre: any) => pre;
      if (process.env.NODE_ENV === 'production') {
        return require('../webpack-config/webpack.prod')(buildType, lynxEntry, pxToRem);
      }
      return require('../webpack-config/webpack.dev')(buildType, lynxEntry, pxToRem);
    });

    // 复写start命令
    tctx.overrideStartCommand(() => {
      try {
        // 1.创建临时文件夹
        if (!fs.existsSync(maxTmp)) {
          fs.mkdirSync(maxTmp);
        }
        // 1. 将ttml转成reactLynx并存储到临时文件夹中
        ttmlToReactLynx(maxTmp, configHelper);
        // 2. 通过mona.config.ts生成lynx.config.ts
        writeLynxConfig(maxTmp, configHelper);
        // 3. 执行speedy dev
        child_process.execSync(`lynx-speedy dev --config ${path.join(maxTmp, 'lynx.config.js')}`, { stdio: 'inherit' });
        // 4. 通过webpack打包，先将reactLynx--》标准react产物，再走h5端的正常打包逻辑
        // webpackStart({});
      } catch (err) {
        console.log('启动失败', err);
      }
    });
    // 复写build命令
    tctx.overrideBuildCommand(() => {
      // 1.创建临时文件夹
      if (!fs.existsSync(maxTmp)) {
        fs.mkdirSync(maxTmp);
      }
      // 1. 将ttml转成reactLynx并存储到临时文件夹中
      ttmlToReactLynx(maxTmp, configHelper, false);
      // 2. 通过mona.config.ts生成lynx.config.ts
      writeLynxConfig(maxTmp, configHelper);
      // 3. 执行speedy dev
      child_process.execSync(`lynx-speedy build --config ${path.join(maxTmp, 'lynx.config.js')}`, { stdio: 'inherit' });
      // 4. 通过webpack打包，先将reactLynx--》标准react产物，再走h5端的正常打包逻辑
      // webpackBuild({});
    });
  });
};

module.exports = max;
