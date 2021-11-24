import path from 'path';
import ejs from 'ejs';
import { readConfig } from '@bytedance/mona-shared';
import { PageConfig } from '@bytedance/mona';
import { DEFAULT_APPID } from '@/constants';
import { Compilation, sources } from 'webpack'
import { ConfigHelper } from '@/configHelper';

const RawSource = sources.RawSource;

export default async function createJson(compilation: Compilation, configHelper: ConfigHelper) {
  const { appConfig, cwd, projectConfig } = configHelper;
  const pages = appConfig.pages ?? [];

  // project.config.json
  const projectFile = 'project.config.json';
  if (!compilation.getAsset(projectFile)) {
    const tplPath = path.join(__dirname, '../../ejs', './project.config.js.ejs');
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
    const file = `${pageDistPath}.json`;

     if (compilation.getAsset(file)) {
      return;
    }

    const pageConfigPath = path.join(cwd, `./src/${page}`, '..', 'page.config');
    const pageConfig = readConfig<PageConfig>(pageConfigPath);

    // generate json file
    const source = new RawSource(JSON.stringify(pageConfig))
    compilation.emitAsset(file, source)
  })
}