"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
var child_process_1 = require("child_process");
var ora_1 = __importDefault(require("ora"));
var chalk_1 = __importDefault(require("chalk"));
var package_1 = require("./package");
var version_1 = require("./version");
var compare_version_1 = __importDefault(require("compare-version"));
function generateInstallCmd(version) {
    return "npm i -g " + (0, package_1.getPkgPublicName)() + "@" + version;
}
function update() {
    var currentVersion = (0, version_1.getCurrentVersion)();
    console.log((0, package_1.getPkgName)() + " v" + (0, version_1.getCurrentVersion)());
    console.log('');
    var version = (0, version_1.getNewestVersion)();
    console.log("\u6700\u65B0\u7248\u672C\u662F v" + version);
    if (version && (0, compare_version_1.default)(version, currentVersion) > 0) {
        var spinner = (0, ora_1.default)("\u5347\u7EA7\u5230 v" + version + "...").start();
        var installCmd = generateInstallCmd(version);
        try {
            (0, child_process_1.execSync)(installCmd).toString();
            spinner.color = 'green';
            spinner.succeed(chalk_1.default.green((0, package_1.getPkgPublicName)() + " v" + version + " \u66F4\u65B0\u6210\u529F"));
        }
        catch (e) {
            spinner.color = 'red';
            spinner.fail(chalk_1.default.red((0, package_1.getPkgPublicName)() + " v" + version + " \u66F4\u65B0\u5931\u8D25\uFF0C\u53EF\u624B\u52A8\u6267\u884C " + installCmd + " \u8FDB\u884C\u66F4\u65B0"));
        }
    }
    else {
        console.log('已是最新版本，不需要更新');
    }
}
exports.update = update;
//# sourceMappingURL=update.js.map