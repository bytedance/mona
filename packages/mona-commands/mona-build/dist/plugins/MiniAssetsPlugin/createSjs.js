"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const webpack_1 = require("webpack");
const RawSource = webpack_1.sources.RawSource;
async function createSjs(compilation) {
    const file = `runtime.sjs`;
    if (compilation.getAsset(file)) {
        return;
    }
    const tplPath = path_1.default.join(__dirname, '../../ejs', './runtime.sjs.ejs');
    const content = await ejs_1.default.renderFile(tplPath, {});
    const source = new RawSource(content);
    compilation.emitAsset(file, source);
}
exports.default = createSjs;
//# sourceMappingURL=createSjs.js.map