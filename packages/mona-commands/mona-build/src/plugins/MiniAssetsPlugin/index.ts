import { ConfigHelper } from '@/configHelper';
import { Compiler, Compilation } from 'webpack';
import createJson from './createJson';
import createSjs from './createSjs';
import createTtml from './createTtml';

class MiniAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'MiniAssetsPlugin'

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }
  
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise({
        name: this.pluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
      }, async () => {
        // json
        await createJson(compilation, this.configHelper)

        // ttml
        await createTtml(compilation, this.configHelper)

        // sjs
        await createSjs(compilation)
      })
    })
  }
}    

export default MiniAssetsPlugin;