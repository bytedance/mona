import path from 'path';
import CommonEntryModule from './CommonEntryModule';

class PluginEntryModule extends CommonEntryModule {
  generateEntryCode(filename: string) {
    const pages = Array.from(new Set((this.configHelper.appConfig.pages || []) as string[]));
    let routesCode = pages.map((page, index) => `import Page${index} from './${page}';`).join('');
    routesCode += `const routes = [${pages
      .map((page, index) => `{ path: '${page}', component: Page${index}, title: '${this.getPageTitle(page)}' }`)
      .join(',')}];`;

    const code = `
      import './public-path';
      import { createPlugin, createPluginLifeCycle } from '@bytedance/mona-runtime';
      import App from './${path.basename(filename)}';
      ${routesCode}
      
      const { provider: p } =  createPlugin(createPluginLifeCycle(App), routes);
      export const provider = p;
    `;

    return code;
  }
}

export default PluginEntryModule;
