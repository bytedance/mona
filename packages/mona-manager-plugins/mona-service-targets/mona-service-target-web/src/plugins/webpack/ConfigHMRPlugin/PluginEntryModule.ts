import path from 'path';
import { VirtualModulesPlugin } from '@bytedance/mona-manager-plugins-shared';
import { readConfig } from '@bytedance/mona-shared';
import { PageConfig } from '@bytedance/mona';
import { ConfigHelper } from '@bytedance/mona-manager';

export const MONA_PUBLIC_PATH = '__mona_public_path__';

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
    const publicPathVirtualPath = path.join(entryPath, '..', 'public-path.js');
    module[publicPathVirtualPath] = `__webpack_public_path__ = window.${MONA_PUBLIC_PATH} || '/';`;
    const virtualPath = path.join(entryPath, '..', 'app.entry.js');
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

  private _generateRoutesCode() {
    const pages = Array.from(new Set((this.configHelper.appConfig.pages || []) as string[]));
    let routesCode = pages.map((page, index) => `import Page${index} from './${page}';`).join('');
    routesCode += `const routes = [${pages
      .map(
        (page, index) =>
          `{ path: '${page}', component: createPluginPageLifecycle(Page${index}), title: '${this.getPageTitle(
            page,
          )}' }`,
      )
      .join(',')}];`;
    return routesCode;
  }

  private _generateDefaultPathCode() {
    const defaultPathCode = `const defaultPath = ${this.configHelper.appConfig.entryPagePath}`;
    return defaultPathCode;
  }

  private _generateLightConfigCode() {
    // @ts-ignore 忽略 light
    const lightConfigCode = `const light = ${JSON.stringify(this.configHelper.appConfig.light)}`;
    return lightConfigCode;
  }

  private _generatePluginEntryCode(filename: string) {
    const { library, runtime } = this.configHelper.projectConfig;
    const injectMonaUi = library || runtime?.monaUi;
    const monaUiPrefix = (typeof injectMonaUi === 'object' ? injectMonaUi?.prefixCls : 'mui') || 'mui';

    const injectCode = injectMonaUi
      ? `import { ConfigProvider } from '@bytedance/mona-ui';
        import zh_CN from "@bytedance/mona-ui/es/components/locale/zh_CN";
        import '@bytedance/mona-ui/es/styles/index.less';

        ConfigProvider.config({ prefixCls: '${monaUiPrefix}' });`
      : '';

    const coverageCode = process.env.COVERAGE === '1' ? `
      import { createCoverageUploader } from '@bytedance/coverage-uploader/dist/uplodaer'

      const instance = createCoverageUploader({
        url: 'http://localhost:9125/coverage/client',
        interval: 2000,
        preReport(c) {
          return {
            coverage: c
          }
        },
      })
      
      instance.init();
    ` : '';
    const code = `
      import './public-path';
      ${injectCode}
      ${coverageCode}
      import { createPlugin, createPluginLifeCycle, createPluginPageLifecycle } from '@bytedance/mona-runtime';
      import App from './${path.basename(filename)}';
      ${this._generateRoutesCode()}
      ${this._generateDefaultPathCode()}
      ${this._generateLightConfigCode()}
      const { provider: p } =  createPlugin(createPluginLifeCycle(App), routes, { defaultPath, light }, ${!!injectMonaUi} ? { ConfigProvider, zh_CN, prefixCls:'${monaUiPrefix}'} : null);
      export const provider = p;
    `;

    

    return code;
  }
}

export default PluginEntryModule;
