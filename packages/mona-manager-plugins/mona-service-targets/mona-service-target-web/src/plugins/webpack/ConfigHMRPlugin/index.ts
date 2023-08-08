import { ConfigHelper } from '@bytedance/mona-manager';
import { Compiler } from 'webpack';
import chokidar from 'chokidar';
import PluginEntryModule from './PluginEntryModule';
import WebEntryModule from './WebEntryModule';
import { Platform } from '@bytedance/mona-manager-plugins-shared';

class ConfigHMRPlugin {
  configHelper: ConfigHelper;
  entryModule: PluginEntryModule | WebEntryModule;
  pluginName = 'ConfigHMRPlugin';

  constructor(configHelper: ConfigHelper, TARGET: Platform) {
    this.configHelper = configHelper;
    if (TARGET === Platform.LIGHT || TARGET === Platform.PLUGIN) {
      this.entryModule = new PluginEntryModule(configHelper);
    } else {
      this.entryModule = new WebEntryModule(configHelper, TARGET === Platform.MOBILE);
    }
  }

  apply(compiler: Compiler) {
    // Applying a webpack compiler to the virtual module
    this.entryModule.module.apply(compiler);
    const changed = new Set();
    const patchUpdateModule = (path: string) => {
      changed.add(path);
      if (changed.size === 1) {
        setTimeout(() => {
          this.entryModule.updateModule();
          changed.clear();
        }, 500);
      }
    };

    // watch file
    chokidar
      .watch(['**/page.config.ts', '**/page.config.js', 'app.config.ts', 'app.config.js'], {
        ignored: /node_modules/,
      })
      .on('all', (_, path) => {
        // app.config page.config
        patchUpdateModule(path);
      });
  }
}

export default ConfigHMRPlugin;
