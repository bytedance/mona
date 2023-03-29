import { IPlugin } from '@bytedance/mona-manager';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { importRemoteModule } from './utils';
import { hasYarn } from '../init/utils/common';

const INIT = 'init';
const START = 'start';
const UPDATE = 'update';

interface Module {
  ReplayCli: {
    verifyWorkingDirectory: (dir: string) => boolean;
    startServer: () => void;
    generateWorkingDirectory: (dir?: string, packageManager?: 'npm' | 'yarn') => Promise<void>;
  };
}

const autoTest: IPlugin = ctx => {
  ctx.registerCommand(
    'ui-test',
    {
      description: 'UI自动化测试本地运行服务',
      usage: 'mona ui-test',
      options: [
        { name: INIT, description: '初始化自动化测试工程' },
        { name: START, description: '启动服务' },
      ],
    },
    async args => {
      const [_, command] = args._ ?? [];

      if (!command || ![INIT, START, UPDATE].includes(command)) {
        console.log(chalk.red(`请输入正确的指令：(${INIT}, ${START}, ${UPDATE})`));
        return;
      }

      const { ReplayCli } = await importRemoteModule<Module>(
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/8eh7vhauldps/cli/precheck.js',
      );

      const { generateWorkingDirectory, startServer, verifyWorkingDirectory } = ReplayCli;

      const packageManager = hasYarn() ? 'yarn' : 'npm';

      async function handleInitProject() {
        const { autoTestDir } = await inquirer.prompt([
          {
            type: 'input',
            name: 'autoTestDir',
            message: '请输入自动化测试项目路径',
            default: process.cwd(),
            validate(input: string) {
              if (!input.trim()) {
                return '路径不能为空';
              }

              return true;
            },
          },
        ]);

        console.log(chalk.green(`即将创建工程至 ${autoTestDir}`));

        const spinner = ora('初始化项目中...').start();

        try {
          await generateWorkingDirectory(autoTestDir, packageManager);
          const successfullyGenerated = verifyWorkingDirectory(autoTestDir);

          if (!successfullyGenerated) {
            throw new Error('初始化项目失败');
          }

          spinner.color = 'green';
          const successMessage = [
            '初始化项目成功',
            '——————————————————————',
            '启动服务：',
            `cd ${autoTestDir}`,
            'mona ui-test start',
          ].join('\n');

          spinner.succeed(successMessage);
        } catch (error) {
          spinner.color = 'red';
          spinner.fail(chalk.red(String(error) || '初始化项目失败'));
        }
      }

      switch (command) {
        case INIT:
          await handleInitProject();
          break;
        case START:
          const isValidWorkingDir = verifyWorkingDirectory(process.cwd());

          if (!isValidWorkingDir) {
            console.log(chalk.red('此目录未检测到测试工程, 请使用 mona ui-test init 进行初始化...'));
            return;
          }
          startServer();
          break;
        default:
          break;
      }
    },
  );
};

module.exports = autoTest;
