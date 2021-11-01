"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmds = [
    {
        name: 'init',
        cli: './bin/mona-init',
        package: '@ecom/mona-init',
        description: '初始化一个商家应用/商家应用插件项目',
    },
    {
        name: 'start',
        cli: './bin/mona-start',
        package: '@ecom/mona-build',
        description: '启动开发服务',
    },
    {
        name: 'build',
        cli: './bin/mona-build',
        package: '@ecom/mona-build',
        description: '构建项目',
    },
    // {
    //   name: 'build-app',
    //   cli: './bin/mona-build-app',
    //   package: '@ecom/mona-miniapp',
    //   description: '构建商家应用',
    // },
    // {
    //   name: 'lint',
    //   cli: './bin/mona-lint',
    //   package: '@ecom/mona-lint',
    //   description: '格式化代码',
    // },
    // {
    //   name: 'proxy',
    //   cli: './bin/mona-proxy',
    //   package: '@ecom/mona-proxy',
    //   description: '开启代理服务器',
    // },
    // {
    //   name: 'publish',
    //   cli: './bin/mona-publish',
    //   package: '@ecom/mona-publish',
    //   description: '发布一个商家应用插件',
    // },
];
exports.default = cmds;
//# sourceMappingURL=cmds.js.map