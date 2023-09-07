// import { OPEN_DOMAIN, OPEN_DEV_HEADERS } from '@bytedance/mona-shared';
import chalk from 'chalk';
// import { IPlugin } from '@bytedance/mona-manager';
// import { readUser, saveUser } from '@bytedance/mona-shared';
import Koa from 'koa';
import Router from '@koa/router';
import Cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
// import https from 'https';
import ip from 'ip';
import portfinder from 'portfinder';
import ora from 'ora';
import inquirer from 'inquirer';
import { openSpiServiceClient } from './idl/api';
import opFetch from './idl/request';

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

const StartServer = async (port = 8088, _reqUri: string) => {
  return new Promise(resolve => {
    const localDevServer = new Koa();
    const router = new Router();
    localDevServer.use(
      Cors({
        // origin: 'https://fxg.jinritemai.com', // 前端地址
        credentials: true,
      }),
    );
    localDevServer.use(bodyParser());

    // router.get('/invoke', (...args) => {
    //   console.log('invoke args :>> ', args);
    //   return {};
    // });

    router.post('/invoke', async ctx => {
      // const res = await axios.post(`https://${SPI_DOMAIN}/invoke`, ctx.request.body, {
      //   headers: ctx.request.header,
      //   withCredentials: true,
      //   httpsAgent: new https.Agent({
      //     rejectUnauthorized: false,
      //   }),
      // });
      delete ctx.request.header['connection'];
      delete ctx.request.header['host'];
      const inputParams: Record<string, any> = ctx.request.body as any;
      const RequestInfo = await openSpiServiceClient.GetInvokeRequestForLightApp(inputParams, ctx.request.header);
      console.log('RequestInfo', RequestInfo);
      const responseByLocal = await opFetch(`${_reqUri}${RequestInfo.path}`, {
        method: 'POST',
        body: JSON.parse(RequestInfo.body),
        headers: RequestInfo.header,
      });
      // const responseByLocal = { success: true, code: 'test', message: null, data: 'test' };
      console.log('responseByLocal', responseByLocal);
      const responseInfo = await openSpiServiceClient.GetInvokeResponseForLightApp(
        {
          param: typeof responseByLocal === 'string' ? responseByLocal : JSON.stringify(responseByLocal),
          appId: inputParams?.appId,
          method: inputParams?.method,
          // header: RequestInfo.header,
        },
        ctx.request.header,
      );
      debugger;

      ctx.response.body = responseInfo;
      console.log('ctx.request.header :>> ', ctx.request.header);
      // const res = await fetch('https://lgw.jinritemai.com/invoke', {
      //   headers: {
      //     accept: '*/*',
      //     'accept-language': 'zh-CN,zh;q=0.9',
      //     'cache-control': 'no-cache',
      //     'content-type': 'application/json',
      //     pragma: 'no-cache',
      //     'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      //     'sec-ch-ua-mobile': '?0',
      //     'sec-ch-ua-platform': '"macOS"',
      //     'sec-fetch-dest': 'empty',
      //     'sec-fetch-mode': 'cors',
      //     'sec-fetch-site': 'same-site',
      //     'x-open-compass': '',
      //     'x-open-token':
      //       'CgwIARCtHBiqICABKAESnwEKnAE1tVfU1PnY7XPwnlus5yE7h5sgm+vnn3JbTvT9/NEdTQ2QDdvSrvcEycVZAPsb/BjKh+JqS60NncxHBHt2RqwfcPg1gPAAg+yfNEZp6Wv/DVvvC4xqfBiwVRlJlkPqev7IDhbZ9e2RKaXgWNcJQOUTnzHpEZCt1eRdh3om5JxC1+nmmHJ+iRoHX9Itz3OTcFN/d2aSjq7YW+C7XvUaAA==',
      //     'x-use-test': '0',
      //   },
      //   // referrer: 'https://fxg.jinritemai.com/',
      //   // referrerPolicy: 'strict-origin-when-cross-origin',
      //   method: 'POST',
      //   // mode: 'cors',
      //   // credentials: 'include',
      //   body: JSON.stringify(ctx.request.body),
      //   agent: new https.Agent({
      //     rejectUnauthorized: false,
      //   }),
      // });

      // ctx.body = '<h1>欢迎光临home页面</h1>';
    });
    // router.options('/invoke', (...args) => {
    //   console.log('invoke args :>> ', args);
    //   return {};
    // });

    localDevServer.use(router.routes()).use(router.allowedMethods());
    localDevServer.listen(port, () => {
      resolve(true);
    });
  });
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

    await StartServer(port, reqUri.href);

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
