import chalk from 'chalk';
import { IPlugin } from '@bytedance/mona-manager';
import { readUser } from '@bytedance/mona-shared';
import { isFreePort, localServer } from './server';
import { ipInterval } from './ip';
import inquirer from 'inquirer';
import ora from 'ora';
async function getServerHref(localServerUrl: string) {
  const inputServerSchema = localServerUrl;
  const reqUri = inputServerSchema?.startsWith('http')
    ? new URL(inputServerSchema)
    : new URL(`http://${inputServerSchema}`);
  if (reqUri.port) {
    const spinnerPingLocalServer = ora('测试本地网关连通性').start();
    const freeport = await isFreePort(+reqUri.port);
    if (!freeport) {
      spinnerPingLocalServer.fail('后端本地服务未启动\n');
    } else {
      spinnerPingLocalServer.succeed('后端本地服务已启动\n');
    }
  }

  return reqUri;
}
const QA = async () => {
  // TODO: 当前目录读取 appId
  return await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'inputAppId',
        message: '请输入app_key',
        validate(input: string) {
          if (!input) {
            return '请输入 appId';
          }
          if (Number.isNaN(+input)) {
            return '无效的appid';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'localServerUrl',
        message: '请输入本地后端服务端地址',
        default: process.env.SERVER_IP || 'http://localhost:8080',
        validate(input: string) {
          if (!input?.trim?.()) {
            return '请输入本地后端服务端地址';
          }

          return true;
        },
      },
    ].filter(a => a),
  );
};

const login: IPlugin = ctx => {
  ctx.registerCommand(
    'local-dev',
    {
      description: '本地调试网关',
      options: [{ name: 'help', description: '输出帮助信息', alias: 'h' }],
      usage: 'mona local-dev',
    },
    async _args => {
      const { inputAppId, localServerUrl } = await QA();
      console.log('localServerUrl', localServerUrl);
      const requUri = await getServerHref(localServerUrl);
      // alread login
      const user = readUser();

      if (user) {
        console.log(chalk.green(`已登录，当前用户：${user.nickName}`));
      }
      ipInterval(inputAppId);

      localServer(requUri);
    },
  );
};
(async () => {
  const requUri = await getServerHref('10.85.171.224:8080');
  // alread login
  localServer(requUri);
  // ipInterval(inputAppId);
})();

module.exports = login;
