import chalk from 'chalk';
import { exec } from 'child_process';
import minimist from 'minimist';
import ora from 'ora';
import fs from 'fs';
const validCmdNames = ['build', 'start'];
const targetMap: { [key: string]: string } = {
  'max': '@bytedance/mona-service-target-lynx',
  'mini': '@bytedance/mona-service-target-mini'
}

function isPkgExist(pkgName: string) {
  try {
    require.resolve(pkgName);
    return true;
  } catch (err) {
    return false;
  }
}

function installPkg(pkgName: string) {
  const spinner = ora(chalk.cyan(`安装 ${pkgName}`)).start();
  const packageJsonFile = fs.readFileSync('../package.json', 'utf8');
  const packageJsonData = JSON.parse(packageJsonFile);
  return new Promise((resolve, reject) => {
    exec(`npm install ${pkgName}@${packageJsonData.version}`, (err, stdout) => {
       if (err) {
        spinner.fail(chalk.red(`${pkgName} 安装失败，请手动安装`));
        reject(err);
       } else {
        spinner.succeed(chalk.green(`${pkgName} 安装成功`));
        resolve(stdout);
       }
    })
  })
}

async function dynamicInstallPlugins() {
  const cmdArgv = minimist(process.argv.slice(2), { alias: { t: 'target' } });
  const cmdName = cmdArgv._[0];
  const target = cmdArgv.target;
  let pkgName = '';

  if (validCmdNames.includes(cmdName)) {
    pkgName = targetMap[target];
    // 如果指定包不存在则进行安装
    if (pkgName && !isPkgExist(pkgName)) {
      await installPkg(pkgName)
    }
  }
  
  return pkgName;
}

export default dynamicInstallPlugins