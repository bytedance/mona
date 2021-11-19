import { ConfigHelper } from '@/configHelper';
import { searchScriptFile } from '@bytedance/mona-shared';
import path from 'path';
import VirtualModulesPlugin from '../VirtualModulesPlugin';

export default class MiniEntryModule {
  entries: Record<string, { filename: string }> = {}
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
      import App from './${path.basename(filename)}';

      createApp(App);
    `;
  }

  static generatePageEntryCode(filename: string, name: string) {
    return `
      import { createPage } from '@bytedance/mona-runtime';
      import Page from './${path.basename(filename)}';

      createPage(Page, '${name}');
    `;
  }

  createModule() {
    const { entryPath, appConfig, cwd } = this.configHelper;
    const pages = appConfig.pages;
    const realPagePaths = pages.map(page => searchScriptFile(path.resolve(cwd, page)))
    const names = ['app', ...pages];
    const realPaths = [entryPath, ...realPagePaths];

    const module: Record<string, string> = {};
    const entries: Record<string, { filename: string }> = {};

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const realPath = realPaths[i];
      const virtualPath = MiniEntryModule.extendEntryName(realPath);
      entries[name] = {
        filename: virtualPath.toLowerCase()
      };
      // this first entry is app entry
      if (i === 0) {
        module[virtualPath] = MiniEntryModule.generateAppEntryCode(realPath);
      } else {
        module[virtualPath] = MiniEntryModule.generatePageEntryCode(realPath, name);
      }
    }

    // update entries
    this.entries = entries;
    // PERF: type handle
    return new VirtualModulesPlugin(module);
  }
}