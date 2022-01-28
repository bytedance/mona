import { IPlugin } from '@bytedance/mona-service';
import fs from 'fs';
import chalk from 'chalk';
import { userDataFile, readUser } from '../login';

const logout: IPlugin = (ctx) => {
  ctx.registerCommand('logout', {
    description: '登出当前抖店开放平台账户',
    options: [
      { name: 'help', description: '输出帮助信息', alias: 'h' }
    ],
    usage: 'mona login',
  }, () => {
    try {
      if (fs.existsSync(userDataFile)) {
        fs.unlinkSync(userDataFile)
        console.log(chalk.green(`用户名：${readUser().name},登出成功！`))
      } else {
        console.log(chalk.red('未找到登录信息！'))
      }
    } catch (err) {
      console.log(chalk.red((err as Error).message));
    }
  });
}


module.exports = logout;