import path from 'path';
import { VirtualModulesPlugin } from '@bytedance/mona-manager-plugins-shared';
import { formatAppConfig, readConfig } from '@bytedance/mona-shared';
import { PageConfig } from '@bytedance/mona';
import { ConfigHelper } from '@bytedance/mona-manager';
const MONA_PUBLIC_PATH = '__mona_public_path__';

class WebEntryModule {
  configHelper: ConfigHelper;
  name: string;
  module: VirtualModulesPlugin;
  isMobile: boolean;
  constructor(configHelper: ConfigHelper, isMobile: boolean) {
    this.configHelper = configHelper;
    this.name = 'entry.js';
    this.module = this.createModule();
    this.isMobile = isMobile;
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
    const publicPathVirtualPath = path.join(entryPath, '..', 'public-path.js');
    module[publicPathVirtualPath] = `__webpack_public_path__ = window.${MONA_PUBLIC_PATH} || '/';`;
    const virtualPath = path.join(entryPath, '..', 'app.entry.js');
    module[virtualPath] = this._generateWebAppEntryCode(entryPath, this.isMobile);
    this.name = virtualPath;

    return new VirtualModulesPlugin(module);
  }

  updateModule() {
    // update config first
    this.configHelper.readAllConfig();

    // update module
    const code = this._generateWebAppEntryCode(this.configHelper.entryPath, this.isMobile);
    const virtualPath = this.name;
    this.module.writeModule(virtualPath, code);
  }

  getPageTitle(page: string) {
    const pageConfigPath = path.join(this.configHelper.cwd, `./src/${page}`, '..', 'page.config');
    const pageConfig = readConfig<PageConfig>(pageConfigPath);
    return pageConfig.navigationBarTitleText || '';
  }

  private _generateRoutesCode() {
    const pages = Array.from(new Set((this.configHelper.appConfig.pages || []) as string[]));
    const HomePage = pages[0];
    let routesCode;
    if (HomePage) {
      routesCode = `import HomePage from './${HomePage}';
   `;
    }

    routesCode += `const routes = [
     ${
       HomePage
         ? ` { path: '${HomePage}', component: createPageLifecycle(HomePage), title: '${this.getPageTitle(
             HomePage,
           )}' },`
         : ''
     }
      ${pages
        .slice(1)
        .map(page => {
          return `{ path: '${page}', component: createPageLifecycle(lazy(() => import(/* webpackChunkName: "${page}" */ './${page}'))), title: '${this.getPageTitle(
            page,
          )}' }`;
        })
        .join(',')}];`;
    return routesCode;
  }

  private _generateTabBarCode() {
    const formatedAppConfig = formatAppConfig(this.configHelper.appConfig);
    const tabBarCode = `const tabBar = ${JSON.stringify(formatedAppConfig.tabBar)}`;
    return tabBarCode;
  }

  private _generateNavBarCode() {
    const navBarCode = `const navBar = ${JSON.stringify(this.configHelper.appConfig.window)}`;
    return navBarCode;
  }

  private _generateDefaultPathCode() {
    const defaultPathCode = `const defaultPath = ${this.configHelper.appConfig.entryPagePath}`;
    return defaultPathCode;
  }

  private _generateWebAppEntryCode(filename: string, isMobile: boolean) {
    const code = `
      import './public-path';
      import { createWebApp, show, createAppLifeCycle, createPageLifecycle, lazy } from '@bytedance/mona-runtime';
      import App from './${path.basename(filename)}';
      ${this._generateRoutesCode()}
      ${this._generateTabBarCode()}
      ${!isMobile ? this._generateNavBarCode() : ''}
      ${this._generateDefaultPathCode()}
      
      const { provider: p } =  createWebApp(createAppLifeCycle(App), routes, { tabBar,${
        !isMobile ? ' navBar,' : ''
      } defaultPath });
      export const provider = p;
    `;

    return code;
  }
}

export default WebEntryModule;
