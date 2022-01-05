import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { readConfig } from '@bytedance/mona-shared';
import { AppConfig, PageConfig } from '@bytedance/mona';
import { DEFAULT_APPID } from '@/constants';
import { Compilation, Compiler, sources } from 'webpack'
import { ConfigHelper } from '@/configHelper';
import formatMiniPath from '@/utils/formatMiniPath';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { getHashDigest } from 'loader-utils';

const RawSource = sources.RawSource;

const defaultAppConfig: AppConfig = {
  pages: []
}

function formatIconPath(input: string, iconPath?: string) {
  if (!iconPath) {
    return iconPath;
  }

  const filePath = path.join(input, iconPath);
  if (!fs.existsSync(filePath)) {
    throw new Error("can't find iconPath " + iconPath);
  }

  // @ts-ignore
  const contentHash = getHashDigest(fs.readFileSync(filePath), 'md5', 'hex', 16);
  const ext = path.extname(filePath);

  return `${contentHash}${ext}`;
}

function formatAppConfig(rawConfig: AppConfig, input: string): AppConfig {
  let config = {
    ...defaultAppConfig,
    ...rawConfig,
  }

  // format tabBar-list-pagePath
  if (config.tabBar) {
    config = {
      ...config,
      tabBar: {
        ...config.tabBar,
        list: config.tabBar.list.map(item => ({ ...item, iconPath: formatIconPath(input, item.iconPath), selectedIconPath: formatIconPath(input, item.selectedIconPath),  pagePath: formatMiniPath(item.pagePath) }))
      }
    }
  }
  console.log('config', config.tabBar?.list);

  return {
    ...config,
    pages: config.pages.map(p => formatMiniPath(p)),
  }
}

export default async function createJson(compiler: Compiler, compilation: Compilation, configHelper: ConfigHelper) {
  const { appConfig, cwd, projectConfig } = configHelper;
  const pages = appConfig.pages ?? [];

  // project.config.json
  const projectFile = 'project.config.json';
  if (!compilation.getAsset(projectFile)) {
    const tplPath = path.join(__dirname, '../../../ejs', './project.config.js.ejs');
    const raw = await ejs.renderFile(tplPath, { appid: projectConfig.appId || DEFAULT_APPID, name: projectConfig.projectName })
    const source = new RawSource(raw);
    compilation.emitAsset(projectFile, source);
  }

  // app.json
  const appFile = 'app.json';
  if (!compilation.getAsset(appFile)) {
    const formatedAppConfig = formatAppConfig(appConfig, cwd);
    const source = new RawSource(JSON.stringify(formatedAppConfig));
    compilation.emitAsset(appFile, source);


    const input = cwd;
    const output = path.join(cwd, projectConfig.output);
    if (appConfig.tabBar?.list) {
      const list = appConfig.tabBar?.list ?? [];
      const formatedList = formatedAppConfig.tabBar?.list ?? [];
      const copyConfig: { from: string, to: string }[] = []
      for (let i = 0; i < appConfig.tabBar?.list.length; i++) {
        const f1 = list[i].iconPath
        const t1 = formatedList[i].iconPath
        const f2 = list[i].selectedIconPath
        const t2 = formatedList[i].selectedIconPath
        if (f1 && t1) {
          copyConfig.push({ from: path.join(input, f1), to: path.join(output, t1) });
        }
        if (f2 && t2) {
          copyConfig.push({ from: path.join(input, f2), to: path.join(output, t2) });
        }
      }

      // add copy plugin
      new CopyWebpackPlugin({ patterns: copyConfig }).apply(compiler)
    }
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