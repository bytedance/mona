import path from 'path';
import VirtualModulesPlugin from '../VirtualModulesPlugin';
import { readConfig } from '@bytedance/mona-shared';
import { PageConfig } from '@bytedance/mona';
import ConfigHelper from '@/ConfigHelper';

export const MONA_PUBLIC_PATH = '__mona_public_path__'

abstract class CommonEntryModule {
  configHelper: ConfigHelper;
  name: string;
  module: VirtualModulesPlugin;

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
    this.name = 'entry.js';
    this.module = this.createModule();
  }

  // change extention filename
  static extendEntryName(filename: string) {
    const ext = path.extname(filename);
    const newExt = ext.endsWith('.ts') ? '.entry.ts' : '.entry.js';
    return filename.replace(ext, newExt);
  }

  createModule() {
    const { entryPath } = this.configHelper;

    const module: Record<string, string> = {};
    const publicPathVirtualPath = path.join(entryPath, '..', 'public-path.js')
    module[publicPathVirtualPath] = `__webpack_public_path__ = window.${MONA_PUBLIC_PATH} || '/';`
    const virtualPath = path.join(entryPath, '..', 'app.entry.js');
    module[virtualPath] = this._generateEntryCode(entryPath);
    this.name = virtualPath;

    return new VirtualModulesPlugin(module);
  }

  updateModule() {
    // update config first
    this.configHelper.readAllConfig();

    // update module
    const code = this._generateEntryCode(this.configHelper.entryPath);
    const virtualPath = this.name;
    this.module.writeModule(virtualPath, code);
  }

  getPageTitle(page: string) {
    const pageConfigPath = path.join(this.configHelper.cwd, `./src/${page}`, '..', 'page.config');
    const pageConfig = readConfig<PageConfig>(pageConfigPath);
    return pageConfig.navigationBarTitleText || '';
  }

  private _generateEntryCode(filename: string) {
    return `
      import './public-path';
      ${this.generateEntryCode(filename)};
    `
  }

  abstract generateEntryCode(filename: string): string
}

export default CommonEntryModule;
