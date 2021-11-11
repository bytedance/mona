"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntryPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('EntryPlugin', function () {
            console.log('entry entry entry----');
        });
    }
}
exports.default = EntryPlugin;
//# sourceMappingURL=EntryPlugin.js.map