"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONA_PUBLIC_PATH = void 0;
const path_1 = __importDefault(require("path"));
const VirtualModulesPlugin_1 = __importDefault(require("./plugins/VirtualModulesPlugin"));
const configHelper_1 = __importDefault(require("./configHelper"));
const mona_shared_1 = require("@bytedance/mona-shared");
exports.MONA_PUBLIC_PATH = '__mona_public_path__';
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
        const publicPathVirtualPath = path_1.default.join(entryPath, '..', 'public-path.js');
        module[publicPathVirtualPath] = `__webpack_public_path__ = window.${exports.MONA_PUBLIC_PATH} || '/';`;
        const virtualPath = path_1.default.join(entryPath, '..', 'app.entry.js');
        module[virtualPath] = this._generatePluginEntryCode(entryPath);
        this.name = virtualPath;
        return new VirtualModulesPlugin_1.default(module);
    }
    updateModule() {
        // update config first
        this.configHelper.readAllConfig();
        // update module
        const code = this._generatePluginEntryCode(this.configHelper.entryPath);
        const virtualPath = this.name;
        this.module.writeModule(virtualPath, code);
    }
    getPageTitle(page) {
        const pageConfigPath = path_1.default.join(this.configHelper.cwd, `./src/${page}`, '..', 'page.config');
        const pageConfig = (0, mona_shared_1.readConfig)(pageConfigPath);
        return pageConfig.navigationBarTitleText || '';
    }
    _generatePluginEntryCode(filename) {
        const pages = Array.from(new Set((this.configHelper.appConfig.pages || [])));
        let routesCode = pages.map((page, index) => `import Page${index} from './${page}';`).join('');
        routesCode += `const routes = [${pages
            .map((page, index) => `{ path: '${page}', component: Page${index}, title: '${this.getPageTitle(page)}' }`)
            .join(',')}];`;
        const code = `
      import './public-path';
      import { createPlugin } from '@bytedance/mona-runtime';
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