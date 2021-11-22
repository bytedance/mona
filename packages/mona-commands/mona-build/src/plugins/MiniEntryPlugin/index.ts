import path from 'path';
import ejs from 'ejs';
import { ConfigHelper } from '@/configHelper';
import { Compiler, Compilation, sources } from 'webpack';
import MiniEntryModule from './MiniEntryModule';
import { readConfig } from '@bytedance/mona-shared';
import { PageConfig } from '@bytedance/mona';
import { DEFAULT_APPID } from '@/constants';

const RawSource = sources.RawSource;

class MiniEntryPlugin {
  configHelper: ConfigHelper;
  entryModule: MiniEntryModule;
  pluginName = 'MiniEntryPlugin'

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
    this.entryModule = new MiniEntryModule(configHelper);
  }
  
  apply(compiler: Compiler) {
    const { module } = this.entryModule;
    // Applying a webpack compiler to the virtual module
    module.apply(compiler);
    // add entry file
    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      const { appConfig, cwd, projectConfig } = this.configHelper;
      const pages = appConfig.pages ?? [];
      
      compilation.hooks.processAssets.tapPromise({
        name: this.pluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
      }, async () => {
        // project.config.json
        const projectFile = 'project.config.json';
        if (!compilation.getAsset(projectFile)) {
          const tplPath = path.join(__dirname, './project.config.js.ejs');
          const raw = await ejs.renderFile(tplPath, { appid: projectConfig.appId || DEFAULT_APPID, name: projectConfig.projectName })
          const source = new RawSource(raw);
          compilation.emitAsset(projectFile, source);
        }

        // app.json
        const appFile = 'app.json';
        if (!compilation.getAsset(appFile)) {
          const formatedAppConfig = { ...appConfig, pages: appConfig.pages.map(p => p.toLowerCase()) }
          const source = new RawSource(JSON.stringify(formatedAppConfig));
          compilation.emitAsset(appFile, source);
        }

        // page json
        pages.forEach(page => {
          const pageDistPath = path.join(page.toLowerCase());
          const pageConfigPath = path.join(cwd, `./src/${page}`, '..', 'page.config');
          const pageConfig = readConfig<PageConfig>(pageConfigPath);

          // generate json file
          const source = new RawSource(JSON.stringify(pageConfig))
          const file = `${pageDistPath}.json`;

          if (compilation.getAsset(file)) {
            return;
          }
          compilation.emitAsset(file, source)
        })
      })
    })
  }
}

export default MiniEntryPlugin;