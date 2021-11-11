"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configHelper_1 = __importDefault(require("../configHelper"));
const chokidar_1 = __importDefault(require("chokidar"));
const EntryModule_1 = __importDefault(require("../EntryModule"));
class ConfigHMRPlugin {
    constructor(configHelper) {
        this.pluginName = 'ConfigHMRPlugin';
        this.configHelper = configHelper;
        this.entryModule = new EntryModule_1.default(configHelper);
    }
    apply(compiler) {
        // Applying a webpack compiler to the virtual module
        this.entryModule.module.apply(compiler);
        const changed = new Set();
        const patchUpdateModule = (path) => {
            changed.add(path);
            if (changed.size === 1) {
                setTimeout(() => {
                    this.entryModule.updateModule();
                    changed.clear();
                }, 500);
            }
        };
        // watch file
        chokidar_1.default.watch(['**/page.config.ts', '**/page.config.js', 'app.config.ts', 'app.config.js'], {
            ignored: /node_modules/
        }).on('all', (_, path) => {
            // app.config page.config
            patchUpdateModule(path);
        });
    }
}
exports.default = ConfigHMRPlugin;
//# sourceMappingURL=ConfigHMRPlugin.js.map