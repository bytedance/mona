import ConfigHelper from '@/ConfigHelper';
import { searchScriptFile } from '@bytedance/mona-shared';
import path from 'path';
import VirtualModulesPlugin from '../VirtualModulesPlugin';
import { MiniPageEntry, genMiniPageEntry } from '@/target/entires/miniPageEntry';
import { genMiniAppEntry, MiniAppEntry } from '@/target/entires/miniAppEntry';
import monaStore from '@/target/store';

export default class MiniEntryModule {
  entries: Record<string, string> = {};
  module: VirtualModulesPlugin;
  configHelper: ConfigHelper;

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
    this.module = this.createModule();
  }

  // change extention filename
  static extendEntryName(filename: string) {
    const ext = path.extname(filename);
    return filename.replace(ext, '.entry.js');
  }

  static generateAppEntryCode(filename: string) {
    return `
      import { createApp } from '@bytedance/mona-runtime';
      import AppComponent from './${path.basename(filename)}';

      App(createApp(AppComponent));
    `;
  }

  static generatePageEntryCode(filename: string, name: string) {
    return `
      import { createPage } from '@bytedance/mona-runtime';
      import PageComponent  from './${path.basename(filename)}';
      
      Page(createPage(PageComponent, '${name}'));
    `;
  }

  createModule() {
    const { entryPath, appConfig, cwd } = this.configHelper;
    const pages = appConfig.pages;
    const realPagePaths = pages.map(page => searchScriptFile(path.resolve(cwd, 'src', page)));

    const module: Record<string, string> = {};
    const entries: Record<string, string> = {};
    console.log({ entryPath });
    if (!MiniAppEntry.isMini(entryPath)) {
      const virtualPath = MiniEntryModule.extendEntryName(entryPath);
      entries['app'] = virtualPath;
      module[virtualPath] = MiniEntryModule.generateAppEntryCode(entryPath);
    } else {
      entries['index'] = './fakeEntry/index.js';
      module['./fakeEntry/index.js'] = '';
      monaStore.miniAppEntry = true;
      genMiniAppEntry(this.configHelper, entryPath.replace(path.extname(entryPath), ''));
    }

    for (let i = 0; i < pages.length; i++) {
      const name = pages[i];
      const realPath = realPagePaths[i];
      const virtualPath = MiniEntryModule.extendEntryName(realPath);
      const isMiniEntry = MiniPageEntry.isMini(realPath);
      if (!isMiniEntry && monaStore.miniAppEntry) {
        console.log(`${name} 非法page入口`);
        continue;
      }
      if (!isMiniEntry) {
        entries[name.toLowerCase()] = virtualPath;
        module[virtualPath] = MiniEntryModule.generatePageEntryCode(realPath, name);
      } else {
        // entries[name.toLowerCase()] = realPath;
        genMiniPageEntry(this.configHelper, realPath.replace(path.extname(realPath), ''));
        // pEntry.readUsingComponents();
      }
    }

    // update entries
    this.entries = entries;

    // PERF: type handle
    return new VirtualModulesPlugin(module);
  }
}
