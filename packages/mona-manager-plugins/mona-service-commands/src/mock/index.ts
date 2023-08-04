import { generateRequestFromOpen, requestBeforeCheck } from "@/common";
import { IPlugin } from "@bytedance/mona-manager";
import chalk from "chalk";
import { generateMockData, startMockServer, writeDataFile } from "./utils";
import path from "path";

const URL = '/captain/light/isv/interface/list';

const mock: IPlugin = ctx => {
  ctx.registerCommand(
    'mock',
    {
      description: '启动mock服务器，方便预先调试',
      options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
      ],
      usage: 'mona-service mock',
    },
    async args => {
      console.log(chalk.yellow('目前仅支持微应用'));
      const { user, appId } = await requestBeforeCheck(ctx, args);
      const request = generateRequestFromOpen(args, user.cookie);

      // 1. 获取IDL
      const res = await request(URL, { data: { appId } });
      // 2. 生成本地测试数据
      const data = await generateMockData(res);

      const dataPath = path.join(ctx.configHelper.cwd, 'mock', 'index.json');
       await writeDataFile(data, dataPath);
      // 3. 启动服务器
      await startMockServer(dataPath);
    })
};

module.exports = mock;