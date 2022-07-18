import { IPlugin } from "@/Service";
// import path from 'path';
import { generateQrcodeFactory, createTestVersionFactory, pipe, buildMaxComponent, processMaxComponentData, processMaxTemplateData, printQrcode } from "./utils";
import { generateRequestFromOpen, requestBeforeCheck } from "../common";

const preview: IPlugin = (ctx) => {
  ctx.registerCommand('preview', {
    options: [
      { name: 'help', description: '输出帮助信息', alias: 'h' },
      { name: 'target', description: '目标端', alias: 't' },
      { name: 'watch', description: '是否监听文件更改', alias: 'w' },
    ]
  }, async (args) => {
    // output dir
    // const dist = ctx.configHelper.projectConfig.output || 'dist';
    // const outputDir = path.join(ctx.configHelper.cwd, dist);

    // assert
    const { user } = await requestBeforeCheck(ctx, args);

    const request = generateRequestFromOpen(args, user.cookie)

    // common steps for all target: compress => upload
    const commonProcess = [createTestVersionFactory(request), generateQrcodeFactory(request), printQrcode];

    if (args.target === 'max') {
      await pipe(buildMaxComponent, processMaxComponentData, ...commonProcess)(ctx)
    } else if (args.target === 'max-template') {
      await pipe(processMaxTemplateData, ...commonProcess)(ctx)
    } else {
      console.error(`${args.target}端目前不支持preview命令，敬请期待`)
    }

    // watch(outputDir, {
    //   open: !!args.watch
    // }, () => {
      
    // })
  })
}

module.exports = preview;