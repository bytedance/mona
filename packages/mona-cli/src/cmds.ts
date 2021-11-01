export interface CommandInfo {
  name: string;
  cli: string;
  package: string;
  description: string;
}

const cmds: CommandInfo[] = [
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

export default cmds;
