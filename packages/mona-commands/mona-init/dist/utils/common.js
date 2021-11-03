"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printFinishMessage = exports.printWelcomeMessage = exports.hasYarn = void 0;
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
// 判断是否有yarn
let _hasYarn = null;
function hasYarn() {
    if (_hasYarn !== null) {
        return _hasYarn;
    }
    try {
        (0, child_process_1.execSync)('yarn --version', { stdio: 'ignore' });
        return (_hasYarn = true);
    }
    catch (e) {
        return (_hasYarn = false);
    }
}
exports.hasYarn = hasYarn;
function printWelcomeMessage() {
    console.log();
    console.log(chalk_1.default.green('mona 即将创建一个新项目！🚀 🚀 🚀 '));
    console.log();
}
exports.printWelcomeMessage = printWelcomeMessage;
function printFinishMessage(projectName) {
    console.log('');
    console.log(chalk_1.default.green(`创建项目 ${chalk_1.default.green.bold(projectName)} 成功！`));
    console.log(chalk_1.default.green(`下面进入项目目录 ${chalk_1.default.cyan.bold(`cd ${projectName}`)}，然后运行 ${chalk_1.default.cyan.bold(`${hasYarn() ? 'yarn start' : 'npm start'}`)} 开始开发吧！have a happy coding time！`));
}
exports.printFinishMessage = printFinishMessage;
//# sourceMappingURL=common.js.map