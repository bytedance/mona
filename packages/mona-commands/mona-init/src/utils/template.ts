import fs from 'fs';
import ora from 'ora';
import ejs from 'ejs';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import download from 'download-git-repo';
import { makeDir, readAllFiles, removeEmptyDirs } from './file';

const TEMPLATE_SOURCE = 'github:bytedance/mona-templates#main'
const TEMPLATE_DIR = '.tpl';
export const fetchTemplate = function (
  projectRoot: string,
  templateName: string
) {
  return new Promise((resolve, reject) => {
    makeDir(projectRoot);
    const tplDest = path.join(projectRoot, TEMPLATE_DIR);
    makeDir(tplDest);
    const spinner = ora('拉取并生成最新模板...').start();
    download(TEMPLATE_SOURCE, tplDest, {}, error => {
      if (error) {
        spinner.fail(chalk.red(`模板拉取失败, ${error.message}`));
        return reject(error)
      } else {
        try {
          const moveCmd = `mv ${tplDest}/${templateName}/* ${projectRoot} && rm -rf ${tplDest}`
          execSync(moveCmd, { stdio: 'ignore' });
          console.log('exec success');
        } catch (err) {
           return reject(error)
        }
        spinner.color = 'green';
        spinner.succeed(chalk.grey('模板拉取成功！'));
        return resolve('success');
      }
    })
  });
};

function renameFile(filePath: string, { typescript, cssExt }: { typescript: boolean; cssExt: string }) {
  const ext = path.extname(filePath);
  let newPath = filePath;
  if (/^\.[jt]sx$/.test(ext)) {
    newPath = filePath.replace(/\.[jt]sx$/, typescript ? '.tsx' : '.jsx');
  } else if (/^\.[jt]s$/.test(ext)) {
    newPath = filePath.replace(/\.[jt]s$/, typescript ? '.ts' : '.js');
  } else if (/^\.(c|le|sa|sc)ss$/.test(ext)) {
    newPath = filePath.replace(/\.(c|le|sa|sc)ss$/, `.${cssExt}`);
  }
  fs.renameSync(filePath, newPath);
  return newPath;
}

export async function processTemplate(filePath: string, templateData: Record<string, any>) {
  // 判断文件是否应该存在, 不应该则直接删除
  // 如果不是ts则不应该存在tsconfig.json和d.ts文件
  if ((/\.d\.ts$/.test(filePath) || /tsconfig\.json$/.test(filePath)) && !templateData.typescript) {
    fs.unlinkSync(filePath);
    return;
  }
  // 判断文件是否是js/jsx/ts/tsx/css/less/sass/scss/json，如何是这些则要进行文件内容及后缀的处理
  let newFilePath = filePath;
  const spinner = ora(`创建文件： ${filePath}`);
  const ext = path.extname(filePath);
  if (/^\.[jt]sx?$/.test(ext) || /^\.(c|le|sa|sc)ss$/.test(ext) || ext === '.json') {
    // 修改内容
    const fileContent = await ejs.renderFile(
      filePath,
      {
        data: templateData,
      },
      {
        async: true,
      }
    );
    fs.writeFileSync(filePath, fileContent);
    // 修改后缀
    newFilePath = renameFile(filePath, {
      typescript: templateData.typescript,
      cssExt: templateData.cssExt,
    });
  }
  // 打印出来文件成功
  spinner.succeed(chalk.grey(`文件 ${newFilePath} 创建成功`));
}

export async function processTemplates(dirPath: string, templateData: Record<string, any>) {
  const files = readAllFiles(dirPath);
  // 遍历文件 处理问题
  await Promise.all(files.map(file => processTemplate(file, templateData)));
  // 再次遍历，删除空文件夹
  removeEmptyDirs(dirPath);
}

export function caclProjectType(templateType: 'pc' | 'mobile' | 'plugin' | 'monorepo') {
  let res: string | string[] = 'web';
  switch (templateType) {
    case 'pc':
      res = ['web', 'desktop'];
      break;
    case 'mobile':
      res = ['miniapp', 'web'];
      break;
    case 'plugin':
      res = ['plugin'];
      break;
    case 'monorepo':
      res = ['monorepo'];
      break;
    default:
      res = ['web'];
      break;
  }
  return JSON.stringify(res);
}
