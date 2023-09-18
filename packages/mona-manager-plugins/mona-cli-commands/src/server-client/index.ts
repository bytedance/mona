import chalk from 'chalk';
import { IPlugin } from '@bytedance/mona-manager';
import { readUser } from '@bytedance/mona-shared';
import { localServer } from './server';
import { ipInterval } from './ip';

const login: IPlugin = ctx => {
  ctx.registerCommand(
    'local-dev',
    {
      description: '本地调试网关',
      options: [{ name: 'help', description: '输出帮助信息', alias: 'h' }],
      usage: 'mona local-dev',
    },
    async _args => {
      // alread login
      const user = readUser();

      if (user) {
        console.log(chalk.green(`已登录，当前用户：${user.nickName}`));
        return;
      }
      ipInterval();

      localServer(_args);
    },
  );
};

module.exports = login;
