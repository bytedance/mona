"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const ask_1 = require("./utils/ask");
const template_1 = require("./utils/template");
const common_1 = require("./utils/common");
const help_1 = require("./help");
function init() {
    yargs_1.default.version(false).help(false).alias('h', 'help');
    yargs_1.default.command('$0', false, {}, async function (argv) {
        if (argv.help) {
            const helpInfo = (0, help_1.commandUsage)();
            console.log(helpInfo);
            return;
        }
        (0, common_1.printWelcomeMessage)();
        // 交互式提问
        const answer = await (0, ask_1.ask)();
        const { projectName, templateType, useTypescript, styleProcessor } = answer;
        const appPath = process.cwd();
        const dirPath = path_1.default.resolve(appPath, projectName);
        // 拉取模板
        await (0, template_1.fetchTemplate)(dirPath, templateType);
        // 文件处理
        await (0, template_1.processTemplates)(dirPath, {
            projectName,
            cssExt: styleProcessor,
            typescript: useTypescript,
        });
        // 安装依赖
        const command = (0, common_1.hasYarn)() ? 'yarn install' : 'npm install';
        const installSpinner = (0, ora_1.default)(`安装项目依赖 ${chalk_1.default.cyan.bold(command)}，可能需要一些时间...`).start();
        try {
            // 改变当前目录
            process.chdir(dirPath);
            try {
                (0, child_process_1.execSync)(command, { stdio: 'ignore' });
            }
            catch (err) {
                throw err;
            }
            installSpinner.color = 'green';
            installSpinner.succeed(chalk_1.default.grey('依赖安装成功！'));
        }
        catch (err) {
            installSpinner.color = 'red';
            installSpinner.fail(chalk_1.default.red(`依赖安装失败，请使用 ${chalk_1.default.cyan.bold(command)} 手动安装`));
        }
        (0, common_1.printFinishMessage)(projectName);
    }).argv;
}
exports.default = init;
//# sourceMappingURL=index.js.map