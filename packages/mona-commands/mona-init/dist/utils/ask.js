"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = void 0;
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
async function askTypescript(prompts) {
    prompts.push({
        type: 'confirm',
        name: 'useTypescript',
        message: '是否使用Typescript',
        default: true,
    });
}
const templates = [
    // {
    //   name: 'pc（适用于桌面端应用和Web应用）',
    //   value: 'pc',
    // },
    {
        name: 'plugin（适用于商家应用插件开发）',
        value: 'plugin',
    },
    // {
    //   name: 'mobile（适用于小程序和移动端web应用）',
    //   value: 'mobile',
    //   disabled: true,
    // },
    // {
    //   name: 'monorepo（同时包含以上三种方式，使用monorepo方式进行管理）',
    //   value: 'monorepo',
    //   disabled: true,
    // },
];
async function askTemplate(prompts) {
    prompts.push({
        type: 'list',
        name: 'templateType',
        message: '请选择模板',
        choices: templates,
    });
}
const styleProcessors = [
    { name: 'less', value: 'less' },
    { name: 'css', value: 'css' },
];
async function askStyleProcessor(prompts) {
    prompts.push({
        type: 'list',
        name: 'styleProcessor',
        message: '请选择样式预处理器',
        choices: styleProcessors,
    });
}
async function askProjectName(prompts) {
    prompts.push({
        type: 'input',
        name: 'projectName',
        message: '请输入应用名称！',
        validate(input) {
            if (!input) {
                return '应用名称不能为空！';
            }
            if (fs_1.default.existsSync(input)) {
                return '当前目录已存在同名文件夹，请更换应用名称！';
            }
            return true;
        },
    });
}
async function ask() {
    const prompts = [];
    askProjectName(prompts);
    askTemplate(prompts);
    askTypescript(prompts);
    askStyleProcessor(prompts);
    const answer = await inquirer_1.default.prompt(prompts);
    return answer;
}
exports.ask = ask;
//# sourceMappingURL=ask.js.map