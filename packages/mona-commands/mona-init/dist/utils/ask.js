"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = void 0;
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const templates = [
    // {
    //   name: 'pc（适用于桌面端应用和Web应用）',
    //   value: 'pc',
    // },
    {
        name: 'plugin（适用于商家应用插件开发）',
        value: 'plugin'
    }
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
async function ask(opts) {
    const prompts = [];
    Object.keys(opts).map(type => {
        var _a;
        const defaultValue = opts[type];
        const itemInst = askConfig[type];
        if (itemInst && (((_a = itemInst === null || itemInst === void 0 ? void 0 : itemInst.checkAsk) === null || _a === void 0 ? void 0 : _a.call(itemInst, defaultValue)) || typeof (itemInst === null || itemInst === void 0 ? void 0 : itemInst.checkAsk) !== 'function')) {
            itemInst['checkAsk'] = undefined;
            prompts.push(itemInst);
        }
    });
    console.log(prompts);
    const answer = await inquirer_1.default.prompt(prompts);
    return Object.assign({}, opts, answer);
}
exports.ask = ask;
const styleProcessors = [
    { name: 'less', value: 'less' },
    { name: 'css', value: 'css' }
];
const askConfig = {
    useTypescript: {
        type: 'confirm',
        name: 'useTypescript',
        message: '是否使用Typescript',
        default: true,
        checkAsk: (defaultValue) => typeof defaultValue !== 'boolean'
    },
    templateType: {
        type: 'list',
        name: 'templateType',
        message: '请选择模板',
        choices: templates,
        checkAsk: (defaultValue) => !defaultValue || !templates.find(t => t.value === defaultValue)
    },
    styleProcessor: {
        type: 'list',
        name: 'styleProcessor',
        message: '请选择样式预处理器',
        choices: styleProcessors,
        checkAsk: (defaultValue) => !defaultValue || !styleProcessors.find(s => s.value === defaultValue)
    },
    projectName: {
        type: 'input',
        name: 'projectName',
        message: '请输入应用名称！',
        checkAsk: (defaultValue) => !defaultValue,
        validate(input) {
            if (!input) {
                return '应用名称不能为空！';
            }
            if (fs_1.default.existsSync(input)) {
                return '当前目录已存在同名文件夹，请更换应用名称！';
            }
            return true;
        }
    }
};
//# sourceMappingURL=ask.js.map