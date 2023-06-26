import chalk from 'chalk';
import { spawn } from 'child_process';
import minimist from 'minimist';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
const validCmdNames = ['build', 'start'];
const targetMap: { [key: string]: string } = {
  'max': '@bytedance/mona-service-target-lynx',
  'mini': '@bytedance/mona-service-target-mini'
}

function isPkgExist(pkgName: string) {
  const pathName = path.join(__dirname, '../../../', pkgName, 'package.json');
  return fs.existsSync(pathName);
}

function installPkg(pkgName: string) {
  const spinner = ora(chalk.cyan(`首次启动需安装 ${pkgName}，请耐心等待...`)).start();
  const packageJsonFile = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8');
  const packageJsonData = JSON.parse(packageJsonFile);
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const name = `${pkgName}@${packageJsonData.version}`;
  const installProcess = spawn(command, ['install', name]);
  return new Promise((resolve, reject) => {
    installProcess.stdout.on('data', (data) => {
      // stdout 输出流的 data 回调
      // 将数据转成 utf8 并输出到控制台
      spinner.color = 'magenta';
      spinner.text = data.toString('utf8');
    });
    installProcess.stderr.on('data', (data) => {
      // stdout 输出流的 data 回调
      // 将数据转成 utf8 并输出到控制台
      spinner.color = 'red';
      spinner.text = data.toString('utf8');
    });
    installProcess.on('exit', (code) => {
      if (code === 0) {
          // 安装完成，停止进度指示器
          spinner.color = 'green';
          spinner.succeed(`安装 ${name} 成功`);
          resolve(1);
      }
      else {
          // 安装失败，停止进度指示器并输出错误信息
          spinner.color = 'red';
          spinner.fail(`安装 ${name} 失败，请手动安装`);
          reject();
      }
    });
  });
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