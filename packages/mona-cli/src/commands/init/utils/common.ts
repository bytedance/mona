import { execSync } from 'child_process';
import chalk from 'chalk';

// 判断是否有yarn
let _hasYarn: null | boolean = null;
export function hasYarn() {
  if (_hasYarn !== null) {
    return _hasYarn;
  }

  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return (_hasYarn = true);
  } catch (e) {
    return (_hasYarn = false);
  }
}

export function printWelcomeMessage() {
  console.log();
  console.log(chalk.green('mona 即将创建一个新项目！🚀 🚀 🚀 '));
  console.log();
}

export function printFinishMessage(projectName: string) {
  console.log('');
  console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`));
  console.log(
    chalk.green(
      `下面进入项目目录 ${chalk.cyan.bold(`cd ${projectName}`)}，然后运行 ${chalk.cyan.bold(
        `${hasYarn() ? 'yarn start' : 'npm start'}`,
      )} 开始开发吧！have a happy coding time！`,
    ),
  );
}

const CHINESE_REG = new RegExp('[\\u4E00-\\u9FA5]+', 'g');
export function checkChinese(str: string) {
  return CHINESE_REG.test(str);
}
