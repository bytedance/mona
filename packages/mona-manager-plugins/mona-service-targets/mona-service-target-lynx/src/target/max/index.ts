import path from 'path';
import child_process from 'child_process';
import { IPlugin } from '@bytedance/mona-manager';
import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { requestBeforeCheck, generateRequestFromOpen } from '@bytedance/mona-shared';
import { writeLynxConfig } from './writeLynxConfig';
import { ttmlToReactLynx } from './ttmlToReactLynx';
import { writeEntry } from './writeEntry';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';

const speedy = require('@bytedance/mona-speedy');

let isFirst = true;

export interface NavComponent {
  position: 'left' | 'top',
  level: number
}

const { MAX, MAX_TEMPLATE } = Platform;
const max: IPlugin = async ctx => {
  const configHelper = ctx.configHelper;
  const monaConfig = configHelper.projectConfig;

  ctx.registerTarget(MAX, tctx => {
    const tempLynxDir = path.join(__dirname, '../../../dist/.maxTmpTtml');
    // 原始webpack打包逻辑

    const transform = ({
      isInjectProps = false,
      navComponent,
      debugPage = '',
      notBuildWeb = false,
    }: {
      isInjectProps?: boolean;
      debugPage?: string;
      navComponent?: NavComponent;
      notBuildWeb?: boolean;
    }) => {
      const entry = ttmlToReactLynx(tempLynxDir, configHelper);
      writeEntry(tempLynxDir, entry, isInjectProps);
      writeLynxConfig({
        tempReactLynxDir: tempLynxDir,
        appid: monaConfig.appId || 'NO_APPID',
        navComponent,
        debugPage,
        notBuildWeb,
      });
    };

    const runSpeedy = (cmd: 'dev' | 'build' = 'dev') => {
      const name = cmd === 'dev' ? 'app' : 'component';
      process.argv = process.argv
        .slice(0, 2)
        .concat([cmd, '--config', path.join(tempLynxDir, 'lynx.config.js'), '--config-name', name]);
      speedy.run();

      const isPipelineEnv = process.env.CI_PIPELINE;
      if (name === 'component' && isPipelineEnv) {
        console.log('分类页组件产物开始打包...')
        try {
          child_process.execSync(`npx rspeedy build --config ${path.join(tempLynxDir, 'lynx-3.config.mjs')}`, { encoding: 'utf-8' });
          console.log('分类页组件产物开始打包成功！！！');
        } catch (error: any) {
          console.error('分类页组件产物开始打包失败!', error.message);
          throw error;
        }
      }
    };

    // 复写start命令
    tctx.overrideStartCommand(async args => {
      // 进入哪个装修页面
      const debugPage = args['debug-page'];

      // 如果是分类页，需要读取appId来拉取详情
      let navComponent: NavComponent | undefined;
      if (debugPage === 'category') {
        const { user, appId } = await requestBeforeCheck(ctx, args);
        const request = generateRequestFromOpen(args, user.cookie);

        const appDetail: any = await request<any>('/captain/appManage/getAppDetail', {
          method: 'GET',
          params: { appId },
        });

        const isTopBar = appDetail.appExtend.componentGroupType === 6;
        const isSideBar = appDetail.appExtend.componentGroupType === 7;

        if (isTopBar || isSideBar) {
          const position: 'left' | 'top' = isTopBar ? 'top' : 'left';
          navComponent = {
            position,
            level: appDetail.appExtend.componentLevel || 0
          }
        }
      }

      try {
        const sourceDir = path.join(configHelper.cwd, 'src');
        chokidar.watch(sourceDir).on(
          'all',
          debounce(() => {
            if (isFirst) {
              isFirst = false;
            } else {
              transform({ isInjectProps: true, debugPage, navComponent });
            }
          }, 600),
        );
        transform({ isInjectProps: true, debugPage, navComponent });

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
