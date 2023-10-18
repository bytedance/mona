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
import { openSpiServiceClient } from './idl/api';
import opFetch from './idl/request';

// const fetch = require('node-fetch');
// import axios from 'axios';
// const WS_DOMAIN = 'opws.jinritemai.com';
export const SPI_DOMAIN = 'lgw.jinritemai.com';

const getFreePort = async () => {
  return await portfinder.getPortPromise({ port: 3003, stopPort: 9999 });
};

export const isFreePort = async (port: number) => {
  try {
    const res = await portfinder.getPortPromise({ port: port });
    if (port !== res) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const StartServer = async (port = 8088, _reqUri: string) => {
  return new Promise(resolve => {
    const localDevServer = new Koa();
    const router = new Router();
    localDevServer.use(
      Cors({
        credentials: true,
      }),
    );
    localDevServer.use(bodyParser());

    router.post('/invoke', async ctx => {
      delete ctx.request.header['connection'];
      delete ctx.request.header['host'];

      try {
        const inputParams: Record<string, any> = ctx.request.body as any;
        const RequestInfo = await openSpiServiceClient.GetInvokeRequestForLightApp(inputParams, ctx.request.header);
        // console.log('RequestInfo', RequestInfo);
        // console.log('local server request', RequestInfo.body);
        // console.log('local server request', RequestInfo.body);
        const responseByLocal = await opFetch(`${_reqUri}${RequestInfo.path}`, {
          method: 'POST',
          // @ts-ignore cc
          body: RequestInfo.body,
          headers: RequestInfo.header,
        });
        // console.log('local server response', responseByLocal);

        // const responseByLocal = { success: true, code: 'test', message: null, data: 'test' };
        const responseInfo = await openSpiServiceClient.GetInvokeResponseForLightApp(
          {
            param: typeof responseByLocal === 'string' ? responseByLocal : JSON.stringify(responseByLocal),
            appId: inputParams?.appId,
            method: inputParams?.method,
          },
          ctx.request.header,
          { onlyResp: true },
        );

        ctx.response.body = responseInfo;
      } catch (error) {
        //@ts-ignore
        ctx.response.body = {
          BaseResp: { StatusCode: 0, StatusMessage: '' },
          BizError: {
            code: 90000,
            //@ts-ignore
            message: error?.message,
          },
          data: '',
        };
      }
    });

    localDevServer.use(router.routes()).use(router.allowedMethods());
    localDevServer.listen(port, () => {
      resolve(true);
    });
  });
};

export async function localServer(reqUri: URL) {
  const spinner = ora('正在启动本地调试网关，获取本地信息').start();

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
