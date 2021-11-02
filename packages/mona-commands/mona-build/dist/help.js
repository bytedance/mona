"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommandUsage = exports.startCommandUsage = void 0;
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const startCommandUsage = () => {
    const sections = [
        {
            header: '描述',
            content: '启动本地开发服务器',
        },
        {
            header: '可选项',
            optionList: [
                { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
                { name: 'port', description: '输出当前CLI版本', alias: 'p', type: Boolean },
            ],
        }
    ];
    return (0, command_line_usage_1.default)(sections);
};
exports.startCommandUsage = startCommandUsage;
const buildCommandUsage = () => {
    const sections = [
        {
            header: '描述',
            content: '对项目进行打包',
        },
        {
            header: '可选项',
            optionList: [
                { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
            ],
        }
    ];
    return (0, command_line_usage_1.default)(sections);
};
exports.buildCommandUsage = buildCommandUsage;
//# sourceMappingURL=help.js.map