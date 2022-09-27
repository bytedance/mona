import { IPlugin } from '@/Service';
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
} from './utils';
import { generateRequestFromOpen, requestBeforeCheck } from '../common';
import chalk from 'chalk';

const preview: IPlugin = ctx => {
  ctx.registerCommand(
    'preview',
    {
      options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
        { name: 'target', description: '目标端', alias: 't' },
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
      const { user } = await requestBeforeCheck(ctx, args);

      const request = generateRequestFromOpen(args, user.cookie);

      // common steps for all target: compress => upload
      const maxProcess = [createTestVersionFactory(request), generateQrcodeFactory(request), printQrcode('抖音')];

      switch (args.target) {
        case 'max':
          await pipe(buildMaxComponent, processMaxComponentData, ...maxProcess)(ctx);
          break;
        case 'max-template':
          await pipe(processMaxTemplateData, ...maxProcess)(ctx);
          break;
        case 'light':
          pipe(getPlatform, getUrl, openUrlWithBrowser)({ ctx, args });
          break;
        case 'h5':
          pipe(
            buildProject('h5'),
            processProjectData,
            createTestVersionFactory(request),
            generateH5Qrcode,
            printQrcode,
          )(ctx);
          break;
        default:
          console.log(chalk.red(`${args.target}端目前暂不支持preview命令，敬请期待`));
      }
      // watch(outputDir, {
      //   open: !!args.watch
      // }, () => {

      // })
    },
  );
};

module.exports = preview;
