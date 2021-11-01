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
  console.log(chalk.green(`下面进入项目目录 ${chalk.green.bold(projectName)} 开始使用吧！have a happy time！`));
}
