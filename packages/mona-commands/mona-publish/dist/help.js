"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandUsage = void 0;
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const commandUsage = () => {
    const sections = [
        {
            header: '描述',
            content: '压缩打包后的产物，以便在开放平台发布',
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
exports.commandUsage = commandUsage;
//# sourceMappingURL=help.js.map