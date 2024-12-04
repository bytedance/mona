import path from 'path';
import child_process from 'child_process';
import { IPlugin } from '@bytedance/mona-manager';
import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { writeLynxConfig } from './writeLynxConfig';
import { ttmlToReactLynx } from './ttmlToReactLynx';
import { writeEntry } from './writeEntry';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';

const speedy = require('@bytedance/mona-speedy');

let isFirst = true;

const { MAX, MAX_TEMPLATE } = Platform;
const max: IPlugin = async ctx => {
  const configHelper = ctx.configHelper;
  const monaConfig = configHelper.projectConfig;

  ctx.registerTarget(MAX, tctx => {
    const tempLynxDir = path.join(__dirname, '../../../dist/.maxTmpTtml');
    // 原始webpack打包逻辑

    const transform = ({
      isInjectProps = false,
      useComponent = false,
      notBuildWeb = false,
    }: {
      isInjectProps?: boolean;
      useComponent?: boolean;
      notBuildWeb?: boolean;
    }) => {
      const entry = ttmlToReactLynx(tempLynxDir, configHelper);
      writeEntry(tempLynxDir, entry, isInjectProps);
      writeLynxConfig({
        tempReactLynxDir: tempLynxDir,
        appid: monaConfig.appId || 'NO_APPID',
        useComponent,
        notBuildWeb,
      });
    };

    const runSpeedy = (cmd: 'dev' | 'build' = 'dev') => {
      const name = cmd === 'dev' ? 'app' : 'component';
      process.argv = process.argv
        .slice(0, 2)
        .concat([cmd, '--config', path.join(tempLynxDir, 'lynx.config.js'), '--config-name', name]);
      speedy.run();

      if (name === 'component') {
        console.log('start build ReactLynx3')
        try {
          child_process.execSync(`rspeedy build --config ${path.join(tempLynxDir, 'lynx-3.config.mjs')}`, { encoding: 'utf-8' });
          console.log('build ReactLynx3 success!')
        } catch (error: any) {
          console.error('编译ReactLyxn3失败', error.message)
        }
      }
    };

    // 复写start命令
    tctx.overrideStartCommand(args => {
      const useComponent = !!args['use-component'];
      try {
        const sourceDir = path.join(configHelper.cwd, 'src');
        chokidar.watch(sourceDir).on(
          'all',
          debounce(() => {
            if (isFirst) {
              isFirst = false;
            } else {
              transform({ isInjectProps: true, useComponent });
            }
          }, 600),
        );
        transform({ isInjectProps: true, useComponent });

        // 4. 执行speedy dev
        // 由于父子进程同时监视文件会失效，模拟运行lynx-speedy dev --config xxx
        runSpeedy('dev');
      } catch (err) {
        console.log('max-component start失败', err);
      }
    });
    // 复写build命令
    tctx.overrideBuildCommand(args => {
      try {
        transform({ notBuildWeb: args['not-build-web'] });
        runSpeedy('build');
      } catch (err) {
        console.log('max-component build失败', err);
      }
    });
  });

  const configPath = path.resolve(__dirname, './utils/templateStart.js');
  ctx.registerTarget(MAX_TEMPLATE, tctx => {
    tctx.overrideStartCommand(() => {
      child_process.execSync(`node ${configPath}`, { stdio: 'inherit' });
    });
    tctx.overrideBuildCommand(() => {
      console.log('当前target没有build命令');
    });
  });
};

module.exports = max;
