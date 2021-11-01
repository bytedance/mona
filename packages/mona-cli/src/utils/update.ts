import { execSync } from 'child_process';
import ora from 'ora';
import chalk from 'chalk';
import { getPkgName, getPkgPublicName } from './package';
import { compareVersion, getCurrentVersion, getNewestVersion } from './version';

function generateInstallCmd(version: string) {
  return `npm i -g ${getPkgPublicName()}@${version}`;
}

export function update() {
  const currentVersion = getCurrentVersion();
  console.log(`${getPkgName()} v${getCurrentVersion()}`);
  console.log('');
  const version = getNewestVersion();
  console.log(`最新版本是 v${version}`);
  if (version && compareVersion(version, currentVersion) > 0) {
    const spinner = ora(`升级到 v${version}...`).start();
    const installCmd = generateInstallCmd(version);
    try {
      execSync(installCmd).toString();
      spinner.color = 'green';
      spinner.succeed(chalk.green(`${getPkgPublicName()} v${version} 更新成功`));
    } catch (e) {
      spinner.color = 'red';
      spinner.fail(chalk.red(`${getPkgPublicName()} v${version} 更新失败，可手动执行 ${installCmd} 进行更新`));
    }
  } else {
    console.log('已是最新版本，不需要更新');
  }
}
