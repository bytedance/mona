import ora from 'ora';
import path from 'path';
import yargs from 'yargs';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { ask } from './utils/ask';
import { caclProjectType, fetchTemplate, processTemplates } from './utils/template';
import { hasYarn, printWelcomeMessage, printFinishMessage } from './utils/common';

function init() {
  yargs.version(false).help(false);
  yargs.command('$0', false, {}, async function () {
    printWelcomeMessage();

    // 交互式提问
    const answer = await ask();
    const { projectName, templateType, useTypescript, styleProcessor } = answer;
    const appPath = process.cwd();
    const dirPath = path.resolve(appPath, projectName);

    // 拉取模板
    await fetchTemplate(dirPath, templateType);

    // 文件处理
    await processTemplates(dirPath, {
      projectTarget: caclProjectType(templateType),
      projectName,
      input: './src/app.tsx',
      cssExt: styleProcessor,
      typescript: useTypescript,
    });

    // 安装依赖
    const command = hasYarn() ? 'yarn install' : 'npm install';
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
  }).argv;
}

export default init;
