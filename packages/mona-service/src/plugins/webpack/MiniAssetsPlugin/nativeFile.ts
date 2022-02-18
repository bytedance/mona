import ConfigHelper from '@/ConfigHelper';
import { TtPageEntry } from '@/target/entires/ttPageEntry';

import { Compilation, sources } from 'webpack';

import monaStore from '@/target/store';

const RawSource = sources.RawSource;

export default async function createNativeFile(compilation: Compilation, _configHelper: ConfigHelper) {
  // console.log('xmonaStore.nativeEntryMap', monaStore.nativeEntryMap);
  monaStore.nativeEntryMap.forEach(entry => {
    entry.outputResource.forEach(({ outputPath, resource }) => {
      // 小程序page目录要求小写
      if (entry instanceof TtPageEntry) {
        outputPath = outputPath.toLowerCase();
      }
      //@ts-ignore
      const currentSource = new RawSource(resource);
      if (compilation.getAsset(outputPath)) {
        // compilation.updateAsset(outputPath, currentSource);
      } else {
        // compilation.emitAsset(outputPath, currentSource);
      }
    });
  });
}
