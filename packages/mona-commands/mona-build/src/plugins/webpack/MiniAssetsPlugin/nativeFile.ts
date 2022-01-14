import { ConfigHelper } from '@/configHelper';

import { Compilation, sources } from 'webpack';

import monaStore from '../../../store';

const RawSource = sources.RawSource;

export default async function createNativeFile(compilation: Compilation, _configHelper: ConfigHelper) {
  monaStore.nativeEntryMap.forEach(entry => {
    entry.outputResource.forEach(({ outputPath, resource }) => {
      const currentSource = new RawSource(resource);
      if (compilation.getAsset(outputPath)) {
        compilation.updateAsset(outputPath, currentSource);
      } else {
        compilation.emitAsset(outputPath, currentSource);
      }
    });
  });
}
