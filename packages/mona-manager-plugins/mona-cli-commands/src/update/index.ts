import { IPlugin } from '@bytedance/mona-manager';
import PackageUpdater from './PackageUpdater';

const update: (registry?: any, pkg?: any) => IPlugin = (registry, pkg) => ctx => {
  ctx.registerCommand(
    'update',
    {
      description: '更新CLI版本',
      usage: 'mona update',
    },
    () => {
      const pkgUpdater = new PackageUpdater(registry, pkg);
      pkgUpdater.start();
    },
  );
};

module.exports = update;
