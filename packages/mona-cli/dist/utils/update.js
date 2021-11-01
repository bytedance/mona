"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const child_process_1 = require("child_process");
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const package_1 = require("./package");
const version_1 = require("./version");
function generateInstallCmd(version) {
    return `npm i -g ${(0, package_1.getPkgPublicName)()}@${version}`;
}
function update() {
    const currentVersion = (0, version_1.getCurrentVersion)();
    console.log(`${(0, package_1.getPkgName)()} v${(0, version_1.getCurrentVersion)()}`);
    console.log('');
    const version = (0, version_1.getNewestVersion)();
    console.log(`最新版本是 v${version}`);
    if (version && (0, version_1.compareVersion)(version, currentVersion) > 0) {
        const spinner = (0, ora_1.default)(`升级到 v${version}...`).start();
        const installCmd = generateInstallCmd(version);
        try {
            (0, child_process_1.execSync)(installCmd).toString();
            spinner.color = 'green';
            spinner.succeed(chalk_1.default.green(`${(0, package_1.getPkgPublicName)()} v${version} 更新成功`));
        }
        catch (e) {
            spinner.color = 'red';
            spinner.fail(chalk_1.default.red(`${(0, package_1.getPkgPublicName)()} v${version} 更新失败，可手动执行 ${installCmd} 进行更新`));
        }
    }
    else {
        console.log('已是最新版本，不需要更新');
    }
}
exports.update = update;
//# sourceMappingURL=update.js.map