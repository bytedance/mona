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
        description: '启动本地开发服务器',
    },
    {
        name: 'build',
        cli: './bin/mona-build',
        package: '@bytedance/mona-build',
        description: '对项目进行打包',
    },
    {
        name: 'publish',
        cli: './bin/mona-publish',
        package: '@bytedance/mona-publish',
        description: '压缩打包后的产物，以便在开放平台发布',
    },
];
exports.default = cmds;
//# sourceMappingURL=cmds.js.map