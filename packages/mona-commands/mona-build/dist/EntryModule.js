"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webpack_virtual_modules_1 = __importDefault(require("webpack-virtual-modules"));
const configHelper_1 = __importDefault(require("./configHelper"));
const mona_shared_1 = require("@ecom/mona-shared");
class EntryModule {
    constructor(configHelper) {
        this.configHelper = configHelper;
        this.name = 'entry.js';
        this.module = this.createModule();
    }
    // change extention filename
    static extendEntryName(filename) {
        const ext = path_1.default.extname(filename);
        const newExt = ext.endsWith('.ts') ? '.entry.ts' : '.entry.js';
        return filename.replace(ext, newExt);
    }
    createModule() {
        const { entryPath } = this.configHelper;
        const module = {};
        const virtualPath = EntryModule.extendEntryName(entryPath);
        module[virtualPath] = this._generatePluginEntryCode(entryPath);
        this.name = virtualPath;
        return new webpack_virtual_modules_1.default(module);
    }
    getPageTitle(page) {
        const pageConfigPath = path_1.default.join(this.configHelper.cwd, `./src/${page}`, '..', 'page.config');
        const pageConfig = mona_shared_1.readConfig(pageConfigPath);
        return pageConfig.navigationBarTitleText || '';
    }
    _generatePluginEntryCode(filename) {
        const pages = this.configHelper.appConfig.pages || [];
        let routesCode = pages.map((page, index) => `import Page${index} from './${page}';`).join('');
        routesCode += `const routes = [${pages
            .map((page, index) => `{ path: '${page}', component: Page${index}, title: '${this.getPageTitle(page)}' }`)
            .join(',')}];`;
        const code = `
      import { createPlugin } from '@ecom/mona';
      import App from './${path_1.default.basename(filename)}';
      ${routesCode}
      
      const { provider: p } =  createPlugin(App, routes);
      export const provider = p;
    `;
        return code;
    }
}
exports.default = EntryModule;
//# sourceMappingURL=EntryModule.js.map