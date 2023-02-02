import { Compiler, Compilation, sources } from 'webpack';
import path from 'path';
// import { slash } from '../../../utils/utils';
import { slash } from '@/target/utils/utils';

const PLUGIN_NAME = 'MiniEntriesImportChunkPlugin';

// 用于将runtime 、vendor 引入每个page的入口
export default class OptimizeEntriesPlugin {
  constructor() {}

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      compilation.hooks.processAssets.tapAsync(PLUGIN_NAME, (_chunks, cb) => {
        this.importChunks(compilation);
        cb();
      });
    });
  }

  importChunks(compilation: Compilation) {
    compilation.chunkGroups.forEach(group => {
      group.chunks.reverse().forEach((chunk: any) => {
        if (chunk.name !== group.name) {
          const imports: string[] = [];
          chunk.files.forEach((file: string) => {
            if (file.endsWith('.js')) {
              const relativePath = slash(path.relative(path.dirname(group.name!), file));
              imports.push(`require('./${relativePath}');\n`);
            }
          });
          const chunkPath = group.name + '.js';
          if (compilation.getAsset(chunkPath)) {
            compilation.updateAsset(chunkPath, Source => new sources.ConcatSource(...imports, Source));
          }
        }
      });
    });
  }
}
