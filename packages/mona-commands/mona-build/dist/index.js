"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const configHelper_1 = __importDefault(require("./configHelper"));
const DEFAULT_PORT = '9000';
function build({ dev }) {
    yargs_1.default.version(false).help(false);
    yargs_1.default.command('$0', false, {}, async function (argv) {
        // 分析参数
        const port = argv.port || DEFAULT_PORT;
        const configHelper = new configHelper_1.default(Object.assign(Object.assign({}, argv), { dev, port }));
        // 生成webpack配置
        const webpackConfig = configHelper.generate();
        // 调用webpack进行打包
        const webpackCompiler = (0, webpack_1.default)(webpackConfig);
        if (dev) {
            const devServer = new webpack_dev_server_1.default({
                static: {
                    directory: path_1.default.join(configHelper.cwd, configHelper.projectConfig.output),
                },
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                // hot: true,
                open: true,
                historyApiFallback: true,
                // compress: true,
                port,
                host: '127.0.0.1',
                allowedHosts: 'all'
            }, webpackCompiler);
            devServer.startCallback(() => {
                console.log(`starting server on http://localhost:${port}`);
            });
        }
        else {
            console.log('start build');
            webpackCompiler.run((error, stats) => {
                var _a, _b;
                if (error) {
                    throw error;
                }
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
                console.log('build finish');
            });
        }
    }).argv;
}
exports.default = build;
//# sourceMappingURL=index.js.map