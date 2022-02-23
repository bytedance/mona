import { OPEN_DOMAIN, OPEN_DEV_HEADERS } from '@bytedance/mona-shared';
import open from 'open';
import uuid from 'node-uuid';
import WebSocket from 'ws';
import chalk from 'chalk';
import { IPlugin } from '@bytedance/mona-service';
import { readUser, saveUser } from './utils';

const openURL = `https://${OPEN_DOMAIN}/authorization`;
const wsURL = `wss://${OPEN_DOMAIN}/ws/api/terminal`;

const login: IPlugin = (ctx) => {
  ctx.registerCommand('login', {
    description: '登录抖店开放平台账户',
    options: [
      { name: 'help', description: '输出帮助信息', alias: 'h' }
    ],
    usage: 'mona login',
  }, () => {
    // alread login
    const user = readUser();
    if (user) {
      console.log(chalk.green(`已登录，当前用户：${user.nickName}`))
      return;
    }

    // generate unique token id
    const token = uuid.v1();
    
    // open op.jinritemai.com with detaul browser
    const url = `${openURL}?token=${token}`;
    console.log(chalk.cyan(`打开 ${url}`));
    open(url);
    // TODO: to delete boe header
    const ws = new WebSocket(`${wsURL}?token=${token}`, { headers: OPEN_DEV_HEADERS });
    let success = false;
    ws.on('open', () => {
      console.log(chalk.cyan('等待授权登录中...'));
    })

    ws.on('message', (buffer: Buffer) => {
      const data = JSON.parse(buffer.toString());

      // save data cookie to local
      if (data && data.cookie && data.nickName && data.userId) {
        try {
          // save user info
          saveUser(data);
          console.log(chalk.green(`授权登录成功! 当前用户：${data.nickName}`));
          success = true;
        } catch(err) {
          console.log(chalk.red((err as Error).message));
        }
        ws.close();
      }
    })

    ws.on('close', () => {
      if (!success) {
        console.log(chalk.red('链接超时，请重新运行该命令进行登录！'));
      }
    })
  })
}

module.exports = login;