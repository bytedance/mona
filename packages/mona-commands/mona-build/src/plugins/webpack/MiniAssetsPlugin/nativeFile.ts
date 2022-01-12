import path from 'path';
import { ConfigHelper } from '@/configHelper';

import { Compilation, sources } from 'webpack';

import { nativeEntryMap } from '@/entires/nativeComponentEntry';

const RawSource = sources.RawSource;

export default async function createNativeFile(compilation: Compilation, configHelper: ConfigHelper) {
  nativeEntryMap.forEach(entry => {
    const source = new RawSource('xiaobobo');
    entry.dependencies.forEach(p => {
      // 判断p是否在src目录下
      // 在: 替换
      // 不在: 新创建一个目录，用于放置。同时更改entry依赖项
      const rootDir = path.join(configHelper.cwd, './src/');
      if (p.startsWith(rootDir)) {
        p = p.replace(path.join(configHelper.cwd, './src/'), '');
      } else {
      }
      compilation.emitAsset(p, source);
    });
  });
}
