"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const chalk_1 = __importDefault(require("chalk"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const configHelper_1 = __importStar(require("./configHelper"));
const help_1 = require("./help");
function build({ dev }) {
    yargs_1.default.version(false).help(false).alias('p', 'port').alias('h', 'help');
    yargs_1.default.command('$0', false, {}, async function (argv) {
        var _a;
        if (argv.help) {
            const helpInfo = dev ? (0, help_1.startCommandUsage)() : (0, help_1.buildCommandUsage)();
            console.log(helpInfo);
            return;
        }
        try {
            // 分析参数
            const configHelper = new configHelper_1.default(Object.assign(Object.assign({}, argv), { dev, port: argv.port }));
            const port = ((_a = configHelper.projectConfig.dev) === null || _a === void 0 ? void 0 : _a.port) || configHelper_1.DEFAULT_PORT;
            // 生成webpack配置
            const webpackConfig = configHelper.generate();
            // 调用webpack进行打包
            const webpackCompiler = (0, webpack_1.default)(webpackConfig);
            if (dev) {
                const devServerOptions = {
                    static: {
                        directory: path_1.default.join(configHelper.cwd, configHelper.projectConfig.output),
                    },
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                    hot: true,
                    open: true,
                    historyApiFallback: true,
                    compress: true,
                    port,
                    host: configHelper_1.DEAULT_HOST,
                    allowedHosts: 'all'
                };
                const devServer = new webpack_dev_server_1.default(devServerOptions, webpackCompiler);
                devServer.startCallback(() => {
                    console.log(`starting server on http://${configHelper_1.DEAULT_HOST}:${port}`);
                });
            }
            else {
                webpackCompiler.run((error, stats) => {
                    var _a, _b;
                    if (error) {
                        throw error;
                    }
                    console.log('start bundling');
                    const info = stats === null || stats === void 0 ? void 0 : stats.toJson();
                    if (stats === null || stats === void 0 ? void 0 : stats.hasErrors()) {
                        (_a = info === null || info === void 0 ? void 0 : info.errors) === null || _a === void 0 ? void 0 : _a.forEach((err) => {
                            console.error(err);
                        });
                        process.exit(1);
                    }
                    if (stats === null || stats === void 0 ? void 0 : stats.hasWarnings) {
                        console.warn((_b = info === null || info === void 0 ? void 0 : info.warnings) === null || _b === void 0 ? void 0 : _b.join('\n'));
                    }
                    Object.keys((info === null || info === void 0 ? void 0 : info.assetsByChunkName) || {}).forEach((chunkName) => {
                        const assets = ((info === null || info === void 0 ? void 0 : info.assetsByChunkName) || {})[chunkName];
                        console.info(`Chunk: ${chunkName}`);
                        if (Array.isArray(assets)) {
                            assets.forEach(asset => console.log(` file: ${asset}\n`));
                        }
                        console.log('');
                    });
                    console.log('bundle finish');
                });
            }
        }
        catch (err) {
            console.log(chalk_1.default.red(err.message));
        }
    }).argv;
}
exports.default = build;
//# sourceMappingURL=index.js.map