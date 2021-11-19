"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const chalk_1 = __importDefault(require("chalk"));
const help_1 = require("./help");
const builder_1 = require("./builder");
function build({ dev }) {
    yargs_1.default.version(false).help(false).alias('p', 'port').alias('h', 'help').alias('t', 'target');
    yargs_1.default.command('$0', false, {}, async function (argv) {
        if (argv.help) {
            const helpInfo = dev ? (0, help_1.startCommandUsage)() : (0, help_1.buildCommandUsage)();
            console.log(helpInfo);
            return;
        }
        try {
            // 分析参数
            const builder = new builder_1.Builder(Object.assign(Object.assign({}, argv), { dev }));
            if (dev) {
                builder.start();
            }
            else {
                builder.build();
            }
        }
        catch (err) {
            console.log(chalk_1.default.red(err.message));
            console.log(err);
        }
    }).argv;
}
exports.default = build;
//# sourceMappingURL=index.js.map