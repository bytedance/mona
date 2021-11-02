"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const yargs_1 = __importDefault(require("yargs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mona_shared_1 = require("@bytedance/mona-shared");
const common_1 = require("./utils/common");
const help_1 = require("./help");
function readDest() {
    const projectConfigPath = path_1.default.join(process.cwd(), 'mona.config');
    const fullConfigPath = (0, mona_shared_1.searchScriptFile)(projectConfigPath);
    if (fs_1.default.existsSync(fullConfigPath)) {
        const projectConfig = (0, mona_shared_1.readConfig)(fullConfigPath);
        return path_1.default.join(process.cwd(), `./${projectConfig.output || 'dist'}`);
    }
    else {
        throw new Error('无效的项目目录，请在mona项目根目录执行命令');
    }
}
function publish() {
    yargs_1.default.version(false).help(false).alias('h', 'help');
    yargs_1.default.command('$0', false, {}, async function (argv) {
        if (argv.help) {
            const helpInfo = (0, help_1.commandUsage)();
            console.log(helpInfo);
            return;
        }
        try {
            const destPath = readDest();
            if (!fs_1.default.existsSync(destPath)) {
                throw new Error(`请先使用 ${chalk_1.default.cyan('mona build')} 进行打包`);
            }
            const zipPath = await (0, common_1.compressToZipFromDir)(destPath);
            console.log(chalk_1.default.green(`请在开放平台 应用后台-插件管理-新增版本 中，上传 ${chalk_1.default.cyan(zipPath)} 压缩包`));
        }
        catch (err) {
            console.log(chalk_1.default.red(err.message));
        }
    }).argv;
}
exports.default = publish;
//# sourceMappingURL=index.js.map