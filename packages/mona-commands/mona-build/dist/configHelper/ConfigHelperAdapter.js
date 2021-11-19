"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MiniConfigHelper_1 = __importDefault(require("./MiniConfigHelper"));
const WebConfigHelper_1 = __importDefault(require("./WebConfigHelper"));
// import { Configuration } from 'webpack';
const PluginConfigHelper_1 = __importDefault(require("./PluginConfigHelper"));
const BaseConfigHelper_1 = __importDefault(require("./BaseConfigHelper"));
class ConfigHelperAdapter {
    constructor(options) {
        console.log('build for ', options.target);
        let configHelper;
        switch (options.target) {
            case 'mini':
                configHelper = new MiniConfigHelper_1.default(options);
                break;
            case 'plugin':
                configHelper = new PluginConfigHelper_1.default(options);
                break;
            case 'web':
            default:
                configHelper = new WebConfigHelper_1.default(options);
        }
        this.configHelper = configHelper;
        this.options = options;
        this.cwd = configHelper.cwd;
        this.projectConfig = configHelper.projectConfig;
        this.appConfig = configHelper.appConfig;
        this.entryPath = configHelper.entryPath;
    }
    // generate webpack config
    generate() {
        console.log('generate webpack config');
        return this.configHelper.generate();
    }
    readAllConfig() {
        return this.configHelper.readAllConfig();
    }
    //@ts-ignore
    _readConfig() {
        // do nothing
        return {};
    }
}
exports.default = ConfigHelperAdapter;
//# sourceMappingURL=ConfigHelperAdapter.js.map