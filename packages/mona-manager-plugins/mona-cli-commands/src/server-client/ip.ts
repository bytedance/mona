import opFetch from './idl/request';
import { deleteUser, readUser } from '@bytedance/mona-shared';
import chalk from 'chalk';

async function reportIp() {
  const user = readUser();
  if (!user) {
    console.log(chalk.red(`未登录，请使用 mona login 进行登录`));
    return;
  }
  if (user?.cookie) {
    return opFetch('https://opencloud.jinritemai.com/', {
      headers: {
        cookie: user?.cookie,
      },
    });
  }
}

export async function ipInterval() {
  //  1. 获取本地后端地址

  try {
    await reportIp();
    setInterval(() => {
      reportIp();
    }, 30000);
  } catch (error: any) {
    deleteUser();
    console.log(`未登录，请使用 mona login 进行登录`);
    // process.exit(0);
    // spinner.fail('网关启动失败 ' + error?.message);
  }
}
