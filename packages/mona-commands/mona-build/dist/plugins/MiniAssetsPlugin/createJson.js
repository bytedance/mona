"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const mona_shared_1 = require("@bytedance/mona-shared");
const constants_1 = require("../../constants");
const webpack_1 = require("webpack");
const RawSource = webpack_1.sources.RawSource;
async function createJson(compilation, configHelper) {
    var _a;
    const { appConfig, cwd, projectConfig } = configHelper;
    const pages = (_a = appConfig.pages) !== null && _a !== void 0 ? _a : [];
    // project.config.json
    const projectFile = 'project.config.json';
    if (!compilation.getAsset(projectFile)) {
        const tplPath = path_1.default.join(__dirname, '../../ejs', './project.config.js.ejs');
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
        const file = `${pageDistPath}.json`;
        if (compilation.getAsset(file)) {
            return;
        }
        const pageConfigPath = path_1.default.join(cwd, `./src/${page}`, '..', 'page.config');
        const pageConfig = (0, mona_shared_1.readConfig)(pageConfigPath);
        // generate json file
        const source = new RawSource(JSON.stringify(pageConfig));
        compilation.emitAsset(file, source);
    });
}
exports.default = createJson;
//# sourceMappingURL=createJson.js.map