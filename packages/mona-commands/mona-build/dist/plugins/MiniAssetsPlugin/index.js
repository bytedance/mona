"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const createJson_1 = __importDefault(require("./createJson"));
class MiniAssetsPlugin {
    constructor(configHelper) {
        this.pluginName = 'MiniAssetsPlugin';
        this.configHelper = configHelper;
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
            compilation.hooks.processAssets.tapPromise({
                name: this.pluginName,
                stage: webpack_1.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
            }, async () => {
                // json
                await (0, createJson_1.default)(compilation, this.configHelper);
                // ttml
            });
        });
    }
}
exports.default = MiniAssetsPlugin;
//# sourceMappingURL=index.js.map