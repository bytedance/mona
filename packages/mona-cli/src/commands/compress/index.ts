import { IPlugin } from '@bytedance/mona-service';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { searchScriptFile, readConfig } from '@bytedance/mona-shared';
import { ProjectConfig } from '@bytedance/mona';
import compressing from 'compressing';

export const ZIP_NAME = 'publish.zip';
export async function compressToZipFromDir(destPath: string) {
  const spinner = ora('开始打包').start();
  const zipPath = path.resolve(destPath, '..', ZIP_NAME);
  await compressing.zip.compressDir(destPath, zipPath);
  spinner.succeed(`打包成功：${zipPath}`);
  return zipPath;
}

export function readDest(): string {
  const projectConfigPath = path.join(process.cwd(), 'mona.config');
  const fullConfigPath = searchScriptFile(projectConfigPath);
  if (fs.existsSync(fullConfigPath)) {
    const projectConfig = readConfig<ProjectConfig>(fullConfigPath);
    return path.join(process.cwd(), `./${projectConfig.output || 'dist'}`);
  } else {
    throw new Error('无效的项目目录，请在mona项目根目录执行命令');
  }
}

const publish: IPlugin = (ctx) => {
  ctx.registerCommand('compress', {
    description: '压缩打包后的产物，以便在开放平台发布',
    options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' }
      ],
    usage: 'mona compress',
  }, async () => {
    try {
      const destPath = readDest();
      if (!fs.existsSync(destPath)) {
        throw new Error(`请先使用 ${chalk.cyan('mona build')} 进行打包`);
      }
      const zipPath = await compressToZipFromDir(destPath);
      console.log(chalk.green(`请在开放平台应用后台中， 手动上传 ${chalk.cyan(zipPath)} 压缩包`));
    } catch (err: any) {
      console.log(chalk.red(err.message));
    }
  })
}

module.exports = publish;