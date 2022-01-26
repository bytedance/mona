import ConfigHelper from '@/ConfigHelper';
import { Compiler, EntryPlugin } from 'webpack';

import createJson, { addUsingComponents } from './createJson';
// import chokidar from 'chokidar';
import path from 'path';
import createTtml from './createTtml';
import createNativeFile from './nativeFile';
import monaStore from '@/target/store';
import { TtPageEntry } from '@/target/entires/ttPageEntry';
class MiniAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'MiniAssetsPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tap(this.pluginName, params => {
      this.configHelper.readAllConfig();
      return params;
    });

    compiler.hooks.emit.tap(this.pluginName, async compilation => {
      addUsingComponents(compilation, this.configHelper);
    });

    compiler.hooks.emit.tapPromise(this.pluginName, async compilation => {
      // json
      await createJson(compilation, this.configHelper);

      // ttml
      await createTtml(compilation, this.configHelper);

      createNativeFile(compilation, this.configHelper);
    });
    monaStore.nativeEntryMap.forEach(entry => {
      if (entry instanceof TtPageEntry) {
        new EntryPlugin(path.dirname(entry.entry), `${entry.entry}.js`).apply(compiler);
      }
    });
    // add new depenpencies
    compiler.hooks.afterCompile.tap(this.pluginName, compilation => {
      const { cwd, appConfig } = this.configHelper;
      const deps = ['app.config.ts', 'app.config.js'];
      // loader里
      appConfig.pages.forEach(page => {
        deps.push(path.join(`./src/${page}`, '..', 'page.config.js'));
        deps.push(path.join(`./src/${page}`, '..', 'page.config.ts'));
      });

      deps.forEach(name => {
        compilation.fileDependencies.add(path.join(cwd, name));
      });
    });
  }
}

export default MiniAssetsPlugin;
