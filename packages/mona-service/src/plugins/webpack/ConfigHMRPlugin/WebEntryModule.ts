import path from 'path';
import { formatAppConfig } from '@bytedance/mona-shared';
import CommonEntryModule from './CommonEntryModule';
class WebEntryModule extends CommonEntryModule  {
  private _generateRoutesCode() {
    const pages = Array.from(new Set((this.configHelper.appConfig.pages || []) as string[]));
    let routesCode = pages.map((page, index) => `import Page${index} from './${page}';`).join('');
    routesCode += `const routes = [${pages
      .map(
        (page, index) =>
          `{ path: '${page}', component: createPageLifecycle(Page${index}), title: '${this.getPageTitle(page)}' }`,
      )
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

  generateEntryCode(filename: string) {
    const code = `
      import { createWebApp, show, createAppLifeCycle, createPageLifecycle } from '@bytedance/mona-runtime';
      import App from './${path.basename(filename)}';
      ${this._generateRoutesCode()}
      ${this._generateTabBarCode()}
      ${this._generateNavBarCode()}
      
      const { provider: p } =  createWebApp(createAppLifeCycle(App), routes, tabBar, navBar);
      export const provider = p;
    `;

    return code;
  }
}

export default WebEntryModule;
