import { IPlugin } from "@/Service";
import path from 'path';
import { generateQrcodeFactory, createTestVersionFactory, pipe, compress, buildMaxComponent, buildMaxTemplate, processMaxComponentData, processMaxTemplateData, watch } from "./utils";
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
    const dist = ctx.configHelper.projectConfig.output || 'dist';
    const outputDir = path.join(ctx.configHelper.cwd, dist);

    // assert
    const { user } = await requestBeforeCheck(ctx, args);

    const request = generateRequestFromOpen(args, user.cookie)

    // common steps for all target: compress => upload
    const commonProcess = [compress, createTestVersionFactory(request), generateQrcodeFactory(request), console.log];

    watch(outputDir, {
      open: !!args.watch
    }, () => {
      if (args.target === 'max') {
        pipe(buildMaxComponent, processMaxComponentData, ...commonProcess)(ctx)
      } else if (args.target === 'max-template') {
        pipe(buildMaxTemplate, processMaxTemplateData, ...commonProcess)(ctx)
      } else {
        console.error('暂不支持该端本地预览')
      }
    })
  })
}

module.exports = preview;