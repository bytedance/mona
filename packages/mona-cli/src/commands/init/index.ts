import { IPlugin } from '@bytedance/mona-service';
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { ask, AskOpts } from './utils/ask';
import { fetchTemplate, processTemplates } from './utils/template';
import { hasYarn, printWelcomeMessage, printFinishMessage } from './utils/common';


const init: IPlugin = (ctx) => {
  ctx.registerCommand('init', {
    description: '初始化一个商家应用/商家应用插件项目',
    options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
        { name: 'use-typescript', description: '是否使用typescript', alias: 'u' },
        { name: 'style', description: '指定样式处理器', alias: 's' },
        { name: 'template', description: '指定模板', alias: 't' },
      ],
    usage: 'mona init <projectName>',
  }, async (args) => {
    printWelcomeMessage();

    const askOpts: AskOpts = {
      projectName: args._[1],
      useTypescript: args.u || args['use-typescript'] as AskOpts['useTypescript'],
      styleProcessor: args.s || args['style'] as AskOpts['styleProcessor'],
      templateType: args.t || args['template'] as AskOpts['templateType']
    };

    // 交互式提问
    const answer = await ask(askOpts);
    const { projectName, templateType, useTypescript, styleProcessor } = answer;
    const appPath = process.cwd();
    const dirPath = path.resolve(appPath, projectName);

    // 拉取模板
    await fetchTemplate(dirPath, templateType);

    // 文件处理
    await processTemplates(dirPath, {
      projectName,
      cssExt: styleProcessor,
      typescript: useTypescript
    });

    // 安装依赖
    const command = hasYarn() ? 'yarn' : 'npm install';
    const installSpinner = ora(`安装项目依赖 ${chalk.cyan.bold(command)}，可能需要一些时间...`).start();
    try {
      // 改变当前目录
      process.chdir(dirPath);
      try {
        execSync(command, { stdio: 'ignore' });
      } catch (err) {
        throw err;
      }
      installSpinner.color = 'green';
      installSpinner.succeed(chalk.grey('依赖安装成功！'));
    } catch (err) {
      installSpinner.color = 'red';
      installSpinner.fail(chalk.red(`依赖安装失败，请使用 ${chalk.cyan.bold(command)} 手动安装`));
    }

    printFinishMessage(projectName);
  })
}

module.exports = init;