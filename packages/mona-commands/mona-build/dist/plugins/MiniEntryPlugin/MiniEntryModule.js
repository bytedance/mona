"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mona_shared_1 = require("@bytedance/mona-shared");
const path_1 = __importDefault(require("path"));
const VirtualModulesPlugin_1 = __importDefault(require("../VirtualModulesPlugin"));
class MiniEntryModule {
    constructor(configHelper) {
        this.entries = {};
        this.configHelper = configHelper;
        this.module = this.createModule();
    }
    // change extention filename
    static extendEntryName(filename) {
        const ext = path_1.default.extname(filename);
        return filename.replace(ext, '.entry.js');
    }
    static generateAppEntryCode(filename) {
        return `
      import { createApp } from '@bytedance/mona-runtime';
      import App from './${path_1.default.basename(filename)}';

      createApp(App);
    `;
    }
    static generatePageEntryCode(filename, name) {
        return `
      import { createPage } from '@bytedance/mona-runtime';
      import Page from './${path_1.default.basename(filename)}';

      createPage(Page, '${name}');
    `;
    }
    createModule() {
        const { entryPath, appConfig, cwd } = this.configHelper;
        const pages = appConfig.pages;
        const realPagePaths = pages.map(page => (0, mona_shared_1.searchScriptFile)(path_1.default.resolve(cwd, 'src', page)));
        const names = ['app', ...pages];
        const realPaths = [entryPath, ...realPagePaths];
        const module = {};
        const entries = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const realPath = realPaths[i];
            const virtualPath = MiniEntryModule.extendEntryName(realPath);
            entries[name.toLowerCase()] = virtualPath;
            // this first entry is app entry
            if (i === 0) {
                module[virtualPath] = MiniEntryModule.generateAppEntryCode(realPath);
            }
            else {
                module[virtualPath] = MiniEntryModule.generatePageEntryCode(realPath, name);
            }
        }
        // update entries
        this.entries = entries;
        // PERF: type handle
        return new VirtualModulesPlugin_1.default(module);
    }
}
exports.default = MiniEntryModule;
//# sourceMappingURL=MiniEntryModule.js.map