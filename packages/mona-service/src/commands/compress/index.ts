import { searchScriptFile, readConfig } from '@bytedance/mona-shared';
import { ProjectConfig } from '../../ConfigHelper';
import { IPlugin } from '../../Service';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { compressDir, compressDistDir } from './utils';

export function readDest(): string {
  const projectConfigPath = path.join(process.cwd(), 'mona.config');
  const fullConfigPath = searchScriptFile(projectConfigPath);
  if (fs.existsSync(fullConfigPath)) {
    const projectConfig = readConfig<ProjectConfig>(fullConfigPath);
    return path.join(process.cwd(), `./${projectConfig.output}`);
  } else {
    throw new Error('无效的项目目录，请在mona项目根目录执行命令');
  }
}

const compress: IPlugin = ctx => {
  ctx.registerCommand(
    'compress',
    {
      description: '压缩打包后的产物，以便在开放平台发布',
      options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
        { name: 'use-root', description: '是否打包根目录（默认为产物目录）', alias: 'r' },
      ],
      usage: 'mona-service compress',
    },
    async args => {
      console.log(chalk.yellow('请确保在项目根目录使用该命令'));
      try {
        let inputPath = process.cwd();
        if (!args.r) {
          inputPath = readDest();
          if (!fs.existsSync(inputPath)) {
            throw new Error(`请先使用 ${chalk.cyan('mona-service build')} 进行打包`);
          }
          const output = await compressDistDir(inputPath);
          // const output = await compressDir(inputPath, args.r ? ['dist'] : []);
          console.log(chalk.green(`请在开放平台应用后台中手动上传 ${chalk.cyan(output)} 压缩包`));
        } else {
          const output = await compressDir(inputPath, args.r ? ['dist'] : []);
          console.log(chalk.green(`请在开放平台应用后台中手动上传 ${chalk.cyan(output)} 压缩包`));
        }
      } catch (err: any) {
        console.log(chalk.red(`打包失败，${err.message}`));
      }
    },
  );
};

module.exports = compress;
