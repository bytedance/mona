"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const webpack_1 = require("webpack");
const MiniEntryModule_1 = __importDefault(require("./MiniEntryModule"));
const mona_shared_1 = require("@bytedance/mona-shared");
const constants_1 = require("../../constants");
const RawSource = webpack_1.sources.RawSource;
class MiniEntryPlugin {
    constructor(configHelper) {
        this.pluginName = 'MiniEntryPlugin';
        this.configHelper = configHelper;
        this.entryModule = new MiniEntryModule_1.default(configHelper);
    }
    apply(compiler) {
        const { module } = this.entryModule;
        // Applying a webpack compiler to the virtual module
        module.apply(compiler);
        // add entry file
        compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
            var _a;
            const { appConfig, cwd, projectConfig } = this.configHelper;
            const pages = (_a = appConfig.pages) !== null && _a !== void 0 ? _a : [];
            compilation.hooks.processAssets.tapPromise({
                name: this.pluginName,
                stage: webpack_1.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
            }, async () => {
                // project.config.json
                const projectFile = 'project.config.json';
                if (!compilation.getAsset(projectFile)) {
                    const tplPath = path_1.default.join(__dirname, './project.config.js.ejs');
                    const raw = await ejs_1.default.renderFile(tplPath, { appid: projectConfig.appId || constants_1.DEFAULT_APPID, name: projectConfig.projectName });
                    const source = new RawSource(raw);
                    compilation.emitAsset(projectFile, source);
                }
                // app.json
                const appFile = 'app.json';
                if (!compilation.getAsset(appFile)) {
                    const formatedAppConfig = Object.assign(Object.assign({}, appConfig), { pages: appConfig.pages.map(p => p.toLowerCase()) });
                    const source = new RawSource(JSON.stringify(formatedAppConfig));
                    compilation.emitAsset(appFile, source);
                }
                // page json
                pages.forEach(page => {
                    const pageDistPath = path_1.default.join(page.toLowerCase());
                    const pageConfigPath = path_1.default.join(cwd, `./src/${page}`, '..', 'page.config');
                    const pageConfig = (0, mona_shared_1.readConfig)(pageConfigPath);
                    // generate json file
                    const source = new RawSource(JSON.stringify(pageConfig));
                    const file = `${pageDistPath}.json`;
                    if (compilation.getAsset(file)) {
                        return;
                    }
                    compilation.emitAsset(file, source);
                });
            });
        });
    }
}
exports.default = MiniEntryPlugin;
//# sourceMappingURL=index.js.map