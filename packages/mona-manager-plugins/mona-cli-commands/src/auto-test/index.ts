import { IPlugin } from '@bytedance/mona-manager';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { importRemoteModule } from './utils';
import { hasYarn } from '../init/utils/common';

const START = 'start';

interface Module {
  ReplayCli: {
    run: (param: { inquirer: typeof inquirer; ora: typeof ora; packageManager: 'npm' | 'yarn' }) => Promise<void>;
  };
}

const autoTest: IPlugin = ctx => {
  ctx.registerCommand(
    'ui-test',
    {
      description: 'UI自动化测试本地运行服务',
      usage: 'mona ui-test',
      options: [
        { name: START, description: '启动服务' },
      ],
    },
    async args => {
      const [_, command] = args._ ?? [];

      if (!command || ![START].includes(command)) {
        console.log(chalk.red(`请输入正确的指令：(${START})`));
        return;
      }

      const { ReplayCli } = await importRemoteModule<Module>(
        'http://lgw.jinritemai.com/app/light-sdk/auto-test/2.0/precheck.js',
      );

      const packageManager = hasYarn() ? 'yarn' : 'npm';

      switch (command) {
        case START:
          await ReplayCli.run({ inquirer, ora, packageManager })
          break;
        default:
          break;
      }
    },
  );
};

module.exports = autoTest;
