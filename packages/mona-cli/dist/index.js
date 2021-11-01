"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_1 = require("./utils/package");
const version_1 = require("./utils/version");
const chalk_1 = __importDefault(require("chalk"));
const yargs_1 = __importDefault(require("yargs"));
const cmds_1 = __importDefault(require("./cmds"));
const command_1 = require("./utils/command");
const update_1 = require("./utils/update");
function checkNewVersion() {
    const currentVersion = (0, version_1.getCurrentVersion)();
    const newestVersion = (0, version_1.getNewestVersion)();
    // console.log(`${getPkgName()} current version: ${currentVersion}\n`)
    if (currentVersion && (0, version_1.compareVersion)(currentVersion, newestVersion) < 0) {
        console.log(`新版本可更新! 你可以使用 ${(0, package_1.getPkgName)()} update 更新到版本 ${newestVersion} \n`);
    }
}
function mona() {
    // 检查新版本, 提示更新
    checkNewVersion();
    yargs_1.default.help(false).version(false);
    // 注册子命令，并匹配当前命令进行调用
    const currentCmd = yargs_1.default.argv._.slice(0)[0];
    const currentCmdInfo = cmds_1.default.find(cmd => cmd.name === currentCmd);
    if (currentCmdInfo) {
        // TODO: handle option
        yargs_1.default.command(currentCmdInfo.name, currentCmdInfo.description, {}, () => {
            const cmdPath = (0, command_1.joinCmdPath)(currentCmdInfo);
            (0, command_1.dispatchCommand)(cmdPath);
        }).argv;
        return;
    }
    // 当使用-h时输出帮助命令
    if (!currentCmd) {
        if (yargs_1.default.argv.h || yargs_1.default.argv.help) {
            console.log((0, command_1.commandUsage)(cmds_1.default));
        }
        else if (yargs_1.default.argv.v || yargs_1.default.argv.version) {
            console.log(`mona v${(0, package_1.getPkgVersion)()}`);
        }
        else {
            console.log(`mona v${(0, package_1.getPkgVersion)()}`);
        }
    }
    else if (currentCmd === 'update') {
        // 更新命令
        (0, update_1.update)();
    }
    else {
        console.log(`无效的命令，使用 ${chalk_1.default.yellow(`${(0, package_1.getPkgName)()} -h`)} 查看帮助`);
    }
}
exports.default = mona;
//# sourceMappingURL=index.js.map