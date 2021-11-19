"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseBuilder_1 = __importDefault(require("./BaseBuilder"));
const chalk_1 = __importDefault(require("chalk"));
class MiniBuilder extends BaseBuilder_1.default {
    build() {
        console.log(chalk_1.default.cyan('开始打包'));
        this.compiler.run((error, stats) => {
            var _a, _b;
            if (error) {
                throw error;
            }
            const info = stats === null || stats === void 0 ? void 0 : stats.toJson();
            if (stats === null || stats === void 0 ? void 0 : stats.hasErrors()) {
                (_a = info === null || info === void 0 ? void 0 : info.errors) === null || _a === void 0 ? void 0 : _a.forEach(err => {
                    console.log(chalk_1.default.red(err.message));
                });
                process.exit(1);
            }
            if (stats === null || stats === void 0 ? void 0 : stats.hasWarnings()) {
                (_b = info === null || info === void 0 ? void 0 : info.warnings) === null || _b === void 0 ? void 0 : _b.forEach(w => {
                    console.log(chalk_1.default.yellow(w.message));
                });
            }
            Object.keys((info === null || info === void 0 ? void 0 : info.assetsByChunkName) || {}).forEach((chunkName) => {
                const assets = ((info === null || info === void 0 ? void 0 : info.assetsByChunkName) || {})[chunkName];
                console.info(chalk_1.default.green(`Chunk: ${chunkName}`));
                if (Array.isArray(assets)) {
                    assets.forEach(asset => console.log(chalk_1.default.green(` file: ${asset}`)));
                }
                console.log('');
            });
            console.log(chalk_1.default.green('打包完成'));
            process.exit(0);
        });
    }
    start() {
        console.log('not implemented yet');
    }
}
exports.default = MiniBuilder;
//# sourceMappingURL=MiniBuilder.js.map