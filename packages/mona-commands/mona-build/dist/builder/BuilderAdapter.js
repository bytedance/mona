"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configHelper_1 = require("../configHelper");
const MiniBuilder_1 = __importDefault(require("./MiniBuilder"));
const WebBuilder_1 = __importDefault(require("./WebBuilder"));
const PluginBuilder_1 = __importDefault(require("./PluginBuilder"));
const constants_1 = require("../constants");
const BaseBuilder_1 = __importDefault(require("./BaseBuilder"));
const chalk_1 = __importDefault(require("chalk"));
class BuilderAdapter {
    constructor(options) {
        const requiredOptions = { target: options.target || 'web', port: options.port || constants_1.DEFAULT_PORT, dev: options.dev || false };
        const configHelper = new configHelper_1.ConfigHelper(requiredOptions);
        console.log(chalk_1.default.cyan(`当前打包目标端：${requiredOptions.target}`));
        const target = options.target || 'web';
        let builder;
        switch (target) {
            case 'mini':
                builder = new MiniBuilder_1.default(configHelper);
                break;
            case 'plugin':
                builder = new PluginBuilder_1.default(configHelper);
                break;
            case 'web':
            default:
                builder = new WebBuilder_1.default(configHelper);
                break;
        }
        this.builder = builder;
        this.configHelper = configHelper;
        this.compiler = builder.compiler;
    }
    build() {
        return this.builder.build();
    }
    start() {
        return this.builder.start();
    }
}
exports.default = BuilderAdapter;
//# sourceMappingURL=BuilderAdapter.js.map