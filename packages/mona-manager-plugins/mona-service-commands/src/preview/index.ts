import { IPlugin } from '@bytedance/mona-manager';
import {
  generateQrcodeFactory,
  createTestVersionFactory,
  pipe,
  buildMaxComponent,
  processMaxComponentData,
  processMaxTemplateData,
  printQrcode,
  getPlatform,
  getUrl,
  openUrlWithBrowser,
  buildProject,
  generateH5Qrcode,
  processProjectData,
  askMixedComponentFactory,
  askMixedTemplateFactory,
} from './utils';
import { AppSceneTypeEnum, generateRequestFromOpen, requestBeforeCheck } from '../common';
import chalk from 'chalk';

const preview: IPlugin = ctx => {
  ctx.registerCommand(
    'preview',
    {
      options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
        // { name: 'watch', description: '是否监听文件更改', alias: 'w' },
        {
          name: 'platform',
          description: '平台类型（当target为light即微应用时，有效值为compass，不填默认compass）',
          alias: 'p',
        },
      ],
      usage: 'mona-service preview -t max',
    },
    async args => {
      // output dir

      // assert
      const { user, appId } = await requestBeforeCheck(ctx, args);
      const request = generateRequestFromOpen(args, user.cookie);

      const appDetail: any = await request<any>('/captain/appManage/getAppDetail', {
        method: 'GET',
        params: { appId },
      });

      // common steps for all target: compress => upload
      const maxProcess = [createTestVersionFactory(request, args), generateQrcodeFactory(request), printQrcode('抖音')];

      switch (appDetail.appSceneType) {
        case AppSceneTypeEnum.DESIGN_CENTER_COMPONENT:
          await pipe(askMixedComponentFactory(request), buildMaxComponent, processMaxComponentData, ...maxProcess)(ctx);
          break;
        case AppSceneTypeEnum.DESIGN_CENTER_TEMPLATE:
          await pipe(askMixedTemplateFactory(request), processMaxTemplateData, ...maxProcess)(ctx);
          break;
        case AppSceneTypeEnum.LIGHT_APP:
          await pipe(getPlatform, getUrl, openUrlWithBrowser)({ ctx, args });
          break;
        case AppSceneTypeEnum.H5:
          await pipe(
            buildProject('h5'),
            processProjectData,
            createTestVersionFactory(request, args),
            generateH5Qrcode(args),
            printQrcode('抖店APP'),
          )(ctx);
          break;
        default:
          console.log(chalk.red(`当前应用类型暂不支持preview命令，敬请期待`));
      }
      // watch(outputDir, {
      //   open: !!args.watch
      // }, () => {

      // })
    },
  );
};

module.exports = preview;
