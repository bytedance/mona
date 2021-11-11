"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configHelper_1 = __importDefault(require("../configHelper"));
const chokidar_1 = __importDefault(require("chokidar"));
const EntryModule_1 = __importDefault(require("../EntryModule"));
class VirtualEntryPlugin {
    constructor(configHelper) {
        this.pluginName = 'MonaEntryPlugin';
        this.configHelper = configHelper;
        this.entryModule = new EntryModule_1.default(configHelper);
    }
    apply(compiler) {
        // Applying a webpack compiler to the virtual module
        this.entryModule.module.apply(compiler);
        // const entryPlugin = new EntryPlugin(this.configHelper.cwd, _this.entryModule.name);
        // entryPlugin.apply(compiler);
        // console.log('apply---');
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
        // const name = this.entryModule.name;
        // compiler.hooks.watchRun.tapAsync('VirtualModulesPlugin', (watcher, callback) => {
        //   const finalWatchFileSystem = watcher.watchFileSystem;
        //   const fileWatchers: any[] = Array.from((finalWatchFileSystem as any).watcher.fileWatchers.values());
        //   for (const fileWatcher of fileWatchers) {
        //     if (fileWatcher.path === name) {
        //       console.log('fileWatcher', fileWatcher);
        //     }
        //   }
        //   // const virtualFiles = (compiler as any).inputFileSystem._virtualFiles;
        //   // const fts = compiler.fileTimestamps as any;
        //   // if (virtualFiles && fts && typeof fts.set === 'function') {
        //   //   Object.keys(virtualFiles).forEach((file) => {
        //   //     console.log(file, virtualFiles[file])
        //   //   });
        //   // }
        //   callback();
        // })
        // // update when change
        // // const name = this.entryModule.name;
        compiler.hooks.compilation.tap(this.pluginName, function (compilation) {
            // update module
            try {
                console.log('modifiedFiles', compiler.modifiedFiles);
                // console.log('update----', name, compilation.assets)
            }
            catch (err) {
                compilation.errors.push(err);
            }
        });
    }
}
exports.default = VirtualEntryPlugin;
//# sourceMappingURL=VirtualEntryPlugin.js.map