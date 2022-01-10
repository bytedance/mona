//@ts-nocheck
import { ConfigHelper } from '@/configHelper';
import { Compiler, Compilation } from 'webpack';
import createJson, { addUsingComponents } from './createJson';
import createTtml from './createTtml';
import monaStore from '../../../store';

class MiniAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'MiniAssetsPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    addUsingComponents(compiler, this.configHelper);

    compiler.hooks.emit.tapPromise(this.pluginName, async compilation => {
      //
      // json
      await createJson(compiler, compilation, this.configHelper);

      // ttml
      await createTtml(compilation, this.configHelper);
    });
  }
}

export default MiniAssetsPlugin;
