"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MiniEntryModule_1 = __importDefault(require("./MiniEntryModule"));
class MiniEntryPlugin {
    constructor(configHelper) {
        this.pluginName = 'MiniEntryPlugin';
        this.configHelper = configHelper;
        this.entryModule = new MiniEntryModule_1.default(configHelper);
    }
    apply(compiler) {
        const { module } = this.entryModule;
        // Applying a webpack compiler to the virtual module
        module.apply(compiler);
        // add entry file
        // compiler.hooks.environment.tap(this.pluginName, () => {
        //   compiler.options.entry = {
        //     ...entries
        //   }
        // })
        // @ts-ignore
        // new EntryPlugin(this.configHelper.cwd, entries['app'].filename).apply(compiler);
        // new EntryPlugin('')
    }
}
exports.default = MiniEntryPlugin;
//# sourceMappingURL=index.js.map