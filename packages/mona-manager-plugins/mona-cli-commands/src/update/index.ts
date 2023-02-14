import { IPlugin } from '@bytedance/mona-manager';
import PackageUpdater from './PackageUpdater';

const update: (pkg?: any, registry?: string) => IPlugin = (pkg, registry) => ctx => {
  ctx.registerCommand(
    'update',
    {
      description: '更新CLI版本',
      usage: 'mona update',
    },
    () => {
      const pkgUpdater = new PackageUpdater(pkg, registry);
      pkgUpdater.start();
    },
  );
};

module.exports = update;
