"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cmds = [
    {
        name: 'init',
        cli: './bin/mona-init',
        package: '@bytedance/mona-init',
        description: '初始化一个商家应用/商家应用插件项目',
    },
    {
        name: 'start',
        cli: './bin/mona-start',
        package: '@bytedance/mona-build',
        description: '启动开发服务',
    },
    {
        name: 'build',
        cli: './bin/mona-build',
        package: '@bytedance/mona-build',
        description: '构建项目',
    },
];
exports.default = cmds;
//# sourceMappingURL=cmds.js.map