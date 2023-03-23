import { ConfigHelper } from '@bytedance/mona-manager';
import { searchScriptFile } from '@bytedance/mona-shared';
import path from 'path';
import { VirtualModulesPlugin } from '@bytedance/mona-manager-plugins-shared';
import { MiniPageEntry, genMiniPageEntry } from '@/target/entires/miniPageEntry';
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
    const names = ['app', ...pages];
    const realPaths = [entryPath, ...realPagePaths];

    const module: Record<string, string> = {};
    const entries: Record<string, string> = {};

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const realPath = realPaths[i];
      const virtualPath = MiniEntryModule.extendEntryName(realPath);
      if (!MiniPageEntry.isMini(realPath)) {
        entries[name.toLowerCase()] = virtualPath;

        // this first entry is app entry
        if (i === 0) {
          module[virtualPath] = MiniEntryModule.generateAppEntryCode(realPath);
        } else {
          module[virtualPath] = MiniEntryModule.generatePageEntryCode(realPath, name);
        }
      } else {
        genMiniPageEntry(this.configHelper, realPath.replace(path.extname(realPath), ''));
      }
    }

    // update entries
    this.entries = entries;

    // PERF: type handle
    return new VirtualModulesPlugin(module);
  }
}
