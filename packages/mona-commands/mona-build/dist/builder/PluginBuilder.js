"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const BaseBuilder_1 = __importDefault(require("./BaseBuilder"));
const constants_1 = require("../constants");
class PluginBuilder extends BaseBuilder_1.default {
    start() {
        var _a;
        const { cwd, projectConfig } = this.configHelper;
        const staticDir = path_1.default.join(cwd, projectConfig.output);
        const port = ((_a = projectConfig.dev) === null || _a === void 0 ? void 0 : _a.port) || constants_1.DEFAULT_PORT;
        const devServer = new webpack_dev_server_1.default({
            static: {
                directory: staticDir,
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            hot: true,
            open: true,
            historyApiFallback: true,
            compress: true,
            port,
            host: constants_1.DEAULT_HOST,
            allowedHosts: 'all',
        }, this.compiler);
        devServer.startCallback(() => {
            console.log(`starting server on http://${constants_1.DEAULT_HOST}:${port}`);
        });
    }
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
}
exports.default = PluginBuilder;
//# sourceMappingURL=PluginBuilder.js.map