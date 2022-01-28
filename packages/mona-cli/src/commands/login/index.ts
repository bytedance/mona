import open from 'open';
import uuid from 'node-uuid';
import WebSocket from 'ws';
import chalk from 'chalk';
import fs from 'fs';
import { IPlugin } from '@bytedance/mona-service';

const openURL = 'https://op.jinritemai.com/authorize';
const wsURL = 'ws://xxxx';
export const userDataFile = '.user';

export function readUser() {
  try {
    const str = fs.readFileSync(userDataFile);
    const result = str ? JSON.parse(str.toString()) : null;
    if (result && result.cookie && result.name) {
      return result;
    }
  } catch(_) {
    // do nothing
  }
  return null;
}

function saveUser(data: any) {
  fs.writeFileSync(userDataFile, JSON.stringify(data));
}

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
      console.log(chalk.green(`已登录，当前用户：${user.name}`))
      return;
    }

    // generate unique token id
    const token = uuid.v1();
    
    // open op.jinritemai.com with detaul browser
    const url = `${openURL}?token=${token}`;
    console.log(chalk.cyan(`打开 ${url}`));
    open(url);
    
    // create ws link
    const ws = new WebSocket(wsURL);
    let success = false;

    ws.on('open', () => {
      console.log(chalk.cyan('等待授权登录中...'));
      ws.send(JSON.stringify({ token }));
    })

    ws.on('message', (data: { cookie: string, name: string }) => {
      // save data cookie to local
      if (data && data.cookie, data.name) {
        try {
          // save user info
          saveUser(data);
          console.log(chalk.green(`授权登录成功! 当前用户：${data.name}`));
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