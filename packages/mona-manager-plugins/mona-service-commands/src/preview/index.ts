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
  generateMobileQrcode,
  processProjectData,
} from './utils';
import { AppSceneTypeEnum, generateRequestFromOpen, requestBeforeCheck } from '../common';
import chalk from 'chalk';

const preview: IPlugin = ctx => {
  ctx.registerCommand(
    'preview',
    {
      options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' }
      ],
      usage: 'mona-service preview',
    },
    async args => {
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
          await pipe(buildMaxComponent, processMaxComponentData, ...maxProcess)(ctx);
          break;
        case AppSceneTypeEnum.DESIGN_CENTER_TEMPLATE:
          await pipe(processMaxTemplateData, ...maxProcess)(ctx);
          break;
        case AppSceneTypeEnum.LIGHT_APP:
          if (args.t === 'mobile') {
            await pipe(
              buildProject('mobile'),
              processProjectData('mobile'),
              createTestVersionFactory(request, args),
              generateMobileQrcode(args),
              printQrcode('抖店APP'),
            )(ctx);
            break;
          } else {
            // await pipe(buildProject('light'), processProjectData, createTestVersionFactory(request, args));
            await pipe(getPlatform, getUrl, openUrlWithBrowser)({ ctx, args });
            break;
          }

        case AppSceneTypeEnum.H5:
          await pipe(
            buildProject('h5'),
            processProjectData(),
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
