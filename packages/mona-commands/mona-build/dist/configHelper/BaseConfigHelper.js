"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mona_shared_1 = require("@bytedance/mona-shared");
const constants_1 = require("../constants");
const DEFAULT_PROJECT_CONFIG = {
    projectName: 'mona-app',
    input: './src/app',
    output: 'dist',
    dev: {
        port: constants_1.DEFAULT_PORT
    }
};
const DEFAULT_APP_CONFIG = {
    pages: []
};
class BaseConfigHelper {
    constructor(options) {
        this.options = options;
        this.cwd = process.cwd();
        this.readAllConfig();
    }
    readAllConfig() {
        this.projectConfig = Object.assign(Object.assign({}, DEFAULT_PROJECT_CONFIG), this._readConfig('mona.config'));
        this.appConfig = Object.assign(Object.assign({}, DEFAULT_APP_CONFIG), this._readConfig('app.config'));
        this.entryPath = (0, mona_shared_1.searchScriptFile)(path_1.default.resolve(this.cwd, this.projectConfig.input));
        if (this.options.port) {
            this.projectConfig.dev = Object.assign(Object.assign({}, this.projectConfig.dev), { port: this.options.port });
        }
    }
    _readConfig(configName) {
        const projectConfigPath = path_1.default.join(this.cwd, configName);
        const fullConfigPath = (0, mona_shared_1.searchScriptFile)(projectConfigPath);
        if (fs_1.default.existsSync(fullConfigPath)) {
            const projectConfig = (0, mona_shared_1.readConfig)(fullConfigPath);
            return projectConfig;
        }
        else {
            throw new Error('无效的项目目录，请在mona项目根目录执行命令');
        }
    }
}
exports.default = BaseConfigHelper;
//# sourceMappingURL=BaseConfigHelper.js.map