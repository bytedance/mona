// import { OPEN_DOMAIN, OPEN_DEV_HEADERS } from '@bytedance/mona-shared';
import chalk from 'chalk';
// import { IPlugin } from '@bytedance/mona-manager';
// import https from 'https';
import ip from 'ip';
import portfinder from 'portfinder';
import ora from 'ora';
import inquirer from 'inquirer';

// const fetch = require('node-fetch');
// import axios from 'axios';
// const WS_DOMAIN = 'opws.jinritemai.com';
export const SPI_DOMAIN = 'lgw.jinritemai.com';

const getFreePort = async () => {
  return await portfinder.getPortPromise({ port: 3003, stopPort: 9999 });
};

const isFreePort = async (port: number) => {
  try {
    await portfinder.getPortPromise({ port: port, stopPort: port });
    return true;
  } catch (error) {
    return false;
  }
};

const QA = async () => {
  // TODO: 当前目录读取 appId
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'localServerPort',
      message: '请输入本地后端服务端口号',
      default: '3000',
      validate(input: string) {
        if (!input) {
          return '请输入本地后端服务端口号';
        }

        if (Number.isNaN(+input)) {
          return '无效的端口号';
        }
        return true;
      },
    },
  ]);
};

async function getServerHref() {
  const spinnerPingLocalServer = ora('测试本地网关连通性').start();

  const inputServerSchema = process.env.SERVER_IP;
  let reqUri: URL;
  if (inputServerSchema) {
    reqUri = inputServerSchema?.startsWith('http')
      ? new URL(inputServerSchema)
      : new URL(`http://${inputServerSchema}`);
  } else {
    const { localServerPort } = await QA();
    reqUri = new URL(`http://localhost:${localServerPort}`);
  }
  const freeport = await isFreePort(+reqUri.port);
  if (!freeport) {
    spinnerPingLocalServer.fail('后端本地服务未启动\n');
  } else {
    spinnerPingLocalServer.succeed('后端本地服务已启动\n');
  }
  return reqUri;
}

async function main() {
  const spinner = ora('正在启动本地调试网关，获取本地信息').start();

  //  1. 获取本地后端地址
  let reqUri: URL = await getServerHref();

  try {
    const myIp = ip.address();
    spinner.info(`获取ip成功 ${myIp}`);
    const port = await getFreePort();
    spinner.info(`获取端口号成功 ${port}`);
    const networkUri = `http://${myIp}:${port}`;
    const localUri = `http://localhost:${port}`;

    spinner.succeed('启动成功，网关运行在: \n');

    console.log('    > Network: ', chalk.green(networkUri));
    console.log('    > Local: ', chalk.green(localUri));
    console.log('\n');
    spinner.succeed('请配置代理 \n');

    console.log('    > Network: ', chalk.green(`https://${SPI_DOMAIN}/invoke`), chalk.green(`${networkUri}/invoke`));
    console.log('    > Local: ', chalk.green(`https://${SPI_DOMAIN}/invoke`), chalk.green(`${localUri}/invoke`));
  } catch (error: any) {
    spinner.fail('网关启动失败 ' + error?.message);
    process.exit(0);
  }
}

main();
