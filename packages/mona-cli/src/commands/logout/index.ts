import { IPlugin } from '@bytedance/mona-service';
import chalk from 'chalk';
import { readUser, deleteUser } from '@bytedance/mona-service/dist/commands/publish/utils';

const logout: IPlugin = (ctx) => {
  ctx.registerCommand('logout', {
    description: '登出当前抖店开放平台账户',
    options: [
      { name: 'help', description: '输出帮助信息', alias: 'h' }
    ],
    usage: 'mona logout',
  }, () => {
    try {
      const user = readUser();
      if (user) {
        deleteUser();
        console.log(chalk.green(`用户名：${user.nickName}，登出成功！`))
      } else {
        console.log(chalk.red('未找到登录信息！'))
      }
    } catch (err) {
      console.log(chalk.red((err as Error).message));
    }
  });
}

module.exports = logout;