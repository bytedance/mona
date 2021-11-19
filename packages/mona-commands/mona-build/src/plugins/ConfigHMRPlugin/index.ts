import { ConfigHelper } from '@/configHelper';
import { Compiler } from 'webpack';
import chokidar from 'chokidar';
import PluginEntryModule from './PluginEntryModule';

class ConfigHMRPlugin {
  configHelper: ConfigHelper;
  entryModule: PluginEntryModule;
  pluginName = 'ConfigHMRPlugin'

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
    this.entryModule = new PluginEntryModule(configHelper);
  }
  
  apply(compiler: Compiler) {
    // Applying a webpack compiler to the virtual module
    this.entryModule.module.apply(compiler);
    const changed = new Set();
    const patchUpdateModule = (path: string) => {
      changed.add(path);
      if (changed.size === 1) {
        setTimeout(() => {
          this.entryModule.updateModule()
          changed.clear();
        }, 500);
      }
    }

    // watch file
    chokidar.watch(['**/page.config.ts', '**/page.config.js', 'app.config.ts', 'app.config.js'], {
      ignored: /node_modules/
    }).on('all', (_, path) => {
      // app.config page.config
      patchUpdateModule(path)
    })
  }
}

export default ConfigHMRPlugin;