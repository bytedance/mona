import { IPlugin } from "@/Service";
import path from 'path';
import { compressDistDir } from "../compress/utils";
import { outputQrcode, pipe, upload, watch } from "./utils";

const preview: IPlugin = (ctx) => {
  ctx.registerCommand('preview', {
    options: [
      { name: 'help', description: '输出帮助信息', alias: 'h' },
      { name: 'target', description: '目标端', alias: 't' },
      { name: 'watch', description: '是否监听文件更改', alias: 'w' },
    ]
  }, (args) => {
    // output dir
    const dist = ctx.configHelper.projectConfig.output || 'dist';
    const outputDir = path.join(ctx.configHelper.cwd, dist);

    // common steps for all target: compress => upload
    const process = () => pipe(compressDistDir, upload)(outputDir);

    watch(outputDir, {
      open: !!args.watch
    }, () => {
      if (args.target === 'max') {
        pipe(process, outputQrcode, console.log)()
      } else {
        console.error('暂不支持该端本地预览')
      }
    })
  })
}

module.exports = preview;