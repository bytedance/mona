import path from 'path';
import child_process from 'child_process';
import { IPlugin } from '../../Service';
import { Platform } from '../constants';
import { writeLynxConfig } from './writeLynxConfig';
import { ttmlToReactLynx } from './ttmlToReactLynx';
import { writeErrorBoundaryAndInjectProps } from './writeErrorBoundaryAndInjectProps';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce'
const speedy = require('@bytedance/mona-speedy');

const { MAX } = Platform;
const max: IPlugin = ctx => {
  const configHelper = ctx.configHelper;
  const monaConfig = configHelper.projectConfig;

  ctx.registerTarget(MAX, tctx => {
    const tempReactLynxDir = path.join(__dirname, '../../../dist/.maxTmpReact');
    // 原始webpack打包逻辑
    const webpackStart = tctx.startFn;
    const webpackBuild = tctx.buildFn;
    let pxToRem = false;
    const h5Entry = path.join(configHelper.cwd, monaConfig.input);
    let buildType = 'umd';

    // 复写start命令
    tctx.overrideStartCommand(args => {
      const { old } = args;
      try {
        if (!old) {
          // 新的lynx打包逻辑
          const sourceDir = path.join(configHelper.cwd, 'src');
          const transform = debounce(() => {
            const entry = ttmlToReactLynx(tempReactLynxDir, configHelper);
            writeErrorBoundaryAndInjectProps(tempReactLynxDir, configHelper, entry, true);
          }, 500)
          chokidar.watch(sourceDir).on('all', transform)
          // 3. 通过mona.config.ts生成lynx.config.ts
          writeLynxConfig(tempReactLynxDir);
          // 4. 执行speedy dev
          // 由于父子进程同时监视文件会失效，模拟运行lynx-speedy dev --config xxx
          process.argv = process.argv
            .slice(0, 2)
            .concat(['dev', '--config', path.join(tempReactLynxDir, 'lynx.config.js'), '--config-name', 'app']);
          speedy.run();
        } else {
          // 旧的打包逻辑
          tctx.configureWebpack(() => {
            monaConfig.chain = (pre: any) => pre;
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
          // 1. 将ttml转成reactLynx并存储到临时文件夹中
          const entry = ttmlToReactLynx(tempReactLynxDir, configHelper);
          // 2. 加入errorboundary
          writeErrorBoundaryAndInjectProps(tempReactLynxDir, configHelper, entry);
          // 3. 通过mona.config.ts生成lynx.config.ts
          writeLynxConfig(tempReactLynxDir);
          // 4. 执行speedy dev
          process.argv = process.argv
            .slice(0, 2)
            .concat(['build', '--config', path.join(tempReactLynxDir, 'lynx.config.js'), '--config-name', 'component']);
          speedy.run();
        } else {
          // 旧的打包逻辑
          tctx.configureWebpack(() => {
            monaConfig.chain = (pre: any) => pre;
            return require('./webpack-config/webpack.prod')(buildType, h5Entry, pxToRem)
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
