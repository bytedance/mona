"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const webpack_1 = require("webpack");
const RawSource = webpack_1.sources.RawSource;
async function createTtml(compilation, configHelper) {
    var _a;
    const { appConfig } = configHelper;
    const pages = (_a = appConfig.pages) !== null && _a !== void 0 ? _a : [];
    // base ttml
    const file = `base.ttml`;
    if (!compilation.getAsset(file)) {
        const tplPath = path_1.default.join(__dirname, '../../ejs', './base.ttml.ejs');
        const content = await ejs_1.default.renderFile(tplPath, {});
        const source = new RawSource(content);
        compilation.emitAsset(file, source);
    }
    // page ttml
    pages.forEach(async (page) => {
        const pageDistPath = path_1.default.join(page.toLowerCase());
        // generate ttml file
        const file = `${pageDistPath}.ttml`;
        if (compilation.getAsset(file)) {
            return;
        }
        const tplPath = path_1.default.join(__dirname, '../../ejs', './page.ttml.ejs');
        const content = await ejs_1.default.renderFile(tplPath, { pageId: pageDistPath });
        const source = new RawSource(content);
        compilation.emitAsset(file, source);
    });
}
exports.default = createTtml;
//# sourceMappingURL=createTtml.js.map