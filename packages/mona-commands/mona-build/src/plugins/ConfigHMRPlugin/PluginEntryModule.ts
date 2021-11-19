import path from 'path';
import VirtualModulesPlugin from '../VirtualModulesPlugin';
import { readConfig } from '@bytedance/mona-shared';
import { PageConfig } from '@bytedance/mona';
import { ConfigHelper } from '@/configHelper';

export const MONA_PUBLIC_PATH = '__mona_public_path__'

class PluginEntryModule {
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
    const virtualPath = path.join(entryPath, '..', 'app.entry.js')
    module[virtualPath] = this._generatePluginEntryCode(entryPath);
    this.name = virtualPath;


    return new VirtualModulesPlugin(module);
  }

  updateModule() {
    // update config first
    this.configHelper.readAllConfig();

    // update module
    const code = this._generatePluginEntryCode(this.configHelper.entryPath);
    const virtualPath = this.name;
    this.module.writeModule(virtualPath, code);
  }

  getPageTitle(page: string) {
    const pageConfigPath = path.join(this.configHelper.cwd, `./src/${page}`, '..', 'page.config');
    const pageConfig = readConfig<PageConfig>(pageConfigPath);
    return pageConfig.navigationBarTitleText || '';
  }

  private _generatePluginEntryCode(filename: string) {
    const pages = Array.from(new Set((this.configHelper.appConfig.pages || []) as string[]));
    let routesCode = pages.map((page, index) => `import Page${index} from './${page}';`).join('');
    routesCode += `const routes = [${pages
      .map((page, index) => `{ path: '${page}', component: Page${index}, title: '${this.getPageTitle(page)}' }`)
      .join(',')}];`;

    const code = `
      import './public-path';
      import { createPlugin } from '@bytedance/mona-runtime';
      import App from './${path.basename(filename)}';
      ${routesCode}
      
      const { provider: p } =  createPlugin(App, routes);
      export const provider = p;
    `;

    return code;
  }
}

export default PluginEntryModule;
