import { IPlugin } from "@bytedance/mona-service";
import PackageUpdater from "./PackageUpdater";

const update: IPlugin = (ctx) => {
  ctx.registerCommand('update', {
    description: '更新CLI版本',
    usage: 'mona update'
  }, () => {
    const pkgUpdater = new PackageUpdater();
    pkgUpdater.start();
  })
}

module.exports = update;