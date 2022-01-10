import { ConfigHelper } from '@/configHelper';
import { Compiler, Compilation } from 'webpack';
// import chokidar from 'chokidar';
import path from 'path';
import createJson from './createJson';
import createTtml from './createTtml';

class MiniAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'MiniAssetsPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(this.pluginName, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this.pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        async () => {
          this.configHelper.readAllConfig()
          // json
          await createJson(compilation, this.configHelper);

          // ttml
          await createTtml(compilation, this.configHelper);
        },
      );
    });

    // add new depenpencies
    compiler.hooks.afterCompile.tap(this.pluginName, compilation => {
      const { cwd, appConfig } = this.configHelper;
      const deps = ['app.config.ts', 'app.config.js']
      appConfig.pages.forEach(page => {
        deps.push(path.join(`./src/${page}`, '..', 'page.config.js'))
        deps.push(path.join(`./src/${page}`, '..', 'page.config.ts'))
      })

      deps.forEach(name => {
        compilation.fileDependencies.add(path.join(cwd, name))
      })
    })
  }
}

export default MiniAssetsPlugin;
