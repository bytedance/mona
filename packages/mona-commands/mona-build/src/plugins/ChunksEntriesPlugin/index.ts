// 参考自remax
import { ConcatSource } from 'webpack-sources';
import { Compiler, Compilation } from 'webpack';
import path from 'path';
import { slash } from '@/utils/utils';

const PLUGIN_NAME = 'OptimizeEntriesPlugin';


export default class OptimizeEntriesPlugin {
  constructor() {}

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      compilation.hooks.processAssets.tapAsync(PLUGIN_NAME, (_chunks, callback) => {
        this.requireChunks(compilation);
        callback();
      });
    });
  }

  requireChunks(compilation: Compilation) {
    compilation.chunkGroups.forEach(group => {
      group.chunks.reverse().forEach((chunk: any) => {
        // require 相关的 chunk
        if (chunk.name !== group.name) {
          const requires: string[] = [];
          chunk.files.forEach((file: string) => {
            if (file.endsWith('.js')) {
              console.log('group.name', group.name);
              console.log('file', file);

              const relativePath = slash(path.relative(path.dirname(group.name!), file));
              console.log('relativePath', relativePath);
              requires.push(`require('./${relativePath}');\n`);
            }
          });
          const chunkPath = group.name + '.js';
          console.log('chunkPath', chunkPath);

          //@ts-ignore
          compilation.assets[chunkPath] = new ConcatSource(...requires, compilation.assets[chunkPath] ?? '');
        }
      });
    });
  }
}
