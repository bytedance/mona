import chalk from 'chalk';
import yargs from 'yargs';
import path from 'path';
import fs from 'fs';
import { searchScriptFile, readConfig } from '@bytedance/mona-shared';
import { ProjectConfig } from '@bytedance/mona';
import { compressToZipFromDir } from './utils/common';
import { commandUsage } from './help';

function readDest(): string {
  const projectConfigPath = path.join(process.cwd(), 'mona.config');
  const fullConfigPath = searchScriptFile(projectConfigPath);
  if (fs.existsSync(fullConfigPath)) {
    const projectConfig = readConfig<ProjectConfig>(fullConfigPath);
    return path.join(process.cwd(), `./${projectConfig.output || 'dist'}`);
  } else {
    throw new Error('无效的项目目录，请在mona项目根目录执行命令');
  }
}

function publish() {
  yargs.version(false).help(false).alias('h', 'help');

  yargs.command('$0', false, {}, async function (argv) {
    if (argv.help) {
      const helpInfo = commandUsage();
      console.log(helpInfo);
      return;
    }
    try {
      const destPath = readDest();
      if (!fs.existsSync(destPath)) {
        throw new Error(`请先使用 ${chalk.cyan('mona build')} 进行打包`);
      }
      const zipPath = await compressToZipFromDir(destPath);
      console.log(chalk.green(`请在开放平台 应用后台-插件管理-新增版本 中，上传 ${chalk.cyan(zipPath)} 压缩包`));
    } catch (err: any) {
      console.log(chalk.red(err.message));
    }
  }).argv;
}

export default publish;
