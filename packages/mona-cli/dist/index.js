"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var package_1 = require("./utils/package");
var chalk_1 = __importDefault(require("chalk"));
var yargs_1 = __importDefault(require("yargs"));
var cmds_1 = __importDefault(require("./cmds"));
var command_1 = require("./utils/command");
var PackageUpdater_1 = __importDefault(require("./PackageUpdater"));
function mona() {
    yargs_1.default.help(false).version(false).alias('h', 'help').alias('v', 'version');
    // 注册子命令，并匹配当前命令进行调用
    var currentCmd = yargs_1.default.argv._.slice(0)[0];
    var currentCmdInfo = cmds_1.default.find(function (cmd) { return cmd.name === currentCmd; });
    if (currentCmdInfo) {
        // TODO: handle option
        yargs_1.default.command(currentCmdInfo.name, currentCmdInfo.description, {}, function () {
            var cmdPath = (0, command_1.joinCmdPath)(currentCmdInfo);
            (0, command_1.dispatchCommand)(cmdPath);
        }).argv;
        return;
    }
    // 当使用-h时输出帮助命令
    if (!currentCmd) {
        if (yargs_1.default.argv.help) {
            console.log((0, command_1.commandUsage)(cmds_1.default));
        }
        else if (yargs_1.default.argv.version) {
            console.log("mona v" + (0, package_1.getPkgVersion)());
        }
        else {
            console.log("mona v" + (0, package_1.getPkgVersion)());
        }
    }
    else if (currentCmd === 'update') {
        // 检查新版本, 提示更新
        var pkgUpdater = new PackageUpdater_1.default();
        pkgUpdater.start();
    }
    else {
        console.log("\u65E0\u6548\u7684\u547D\u4EE4\uFF0C\u4F7F\u7528 " + chalk_1.default.yellow((0, package_1.getPkgName)() + " -h") + " \u67E5\u770B\u5E2E\u52A9");
    }
}
exports.default = mona;
//# sourceMappingURL=index.js.map