import { ConfigHelper } from '@/configHelper';
import { TtPageEntry } from '@/entires/ttPageEntry';

import { Compilation, sources } from 'webpack';

import monaStore from '../../../store';

const RawSource = sources.RawSource;

export default async function createNativeFile(compilation: Compilation, _configHelper: ConfigHelper) {
  monaStore.nativeEntryMap.forEach(entry => {
    entry.outputResource.forEach(({ outputPath, resource }) => {
      // 小程序page目录要求小写
      if(entry instanceof TtPageEntry){
        outputPath = outputPath.toLowerCase()
      }
      const currentSource = new RawSource(resource);
      if (compilation.getAsset(outputPath)) {
        compilation.updateAsset(outputPath, currentSource);
      } else {
        compilation.emitAsset(outputPath, currentSource);
      }
    });
  });
}
