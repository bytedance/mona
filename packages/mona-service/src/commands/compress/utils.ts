import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import ora from 'ora';
import chalk from 'chalk';

import { defaultMonaIgnoreContent } from './ignore';

const TEMP_DIR = '.mona';

function isDir(rawFilename: string) {
  return fs.lstatSync(rawFilename).isDirectory();
}

export function ensureDirExist(dirname: string) {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
}

export async function compressDistDir(inputPath: string) {
  console.log(chalk.cyan('当前打包目录', inputPath));
  const spinner = ora('打包中...').start();
  ensureDirExist(TEMP_DIR);
  const outputPath = path.join(process.cwd(), TEMP_DIR, `publish${Date.now()}.zip`);
  await compressDirToZip(inputPath, outputPath);
  spinner.succeed(chalk.green('打包成功'));
  return outputPath;
}

export async function compressDir(inputPath: string, ignoreList: string[] = []) {
  console.log(chalk.cyan('当前打包目录', inputPath));
  const spinner = ora('打包中...').start();
  ensureDirExist(TEMP_DIR);
  const outputPath = path.join(process.cwd(), TEMP_DIR, `publish${Date.now()}.zip`);
  await compressToZip(inputPath, outputPath, [...ignoreList, 'node_modules', '.git', TEMP_DIR]);
  spinner.succeed(chalk.green('打包成功'));
  return outputPath;
}

export function compressDirToZip(inputPath: string, outputPath: string) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const arc = archiver('zip', {
      zlib: { level: 9 },
    });

    output.on('close', () => {
      resolve('success');
    });

    // arc.on('end', () => {
    //   resolve('success');
    // });
    arc.on('error', err => {
      console.log('throw=====');
      reject(err);
    });

    arc.pipe(output);

    try {
      if (fs.existsSync(inputPath)) {
        arc.directory(inputPath, path.basename(inputPath));
      }
    } catch (err) {
      reject(err);
    }

    arc.finalize();
  });
}

export function compressToZip(inputPath: string, outputPath: string, ignoreList: string[] = []) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const arc = archiver('zip', {
      zlib: { level: 9 },
    });

    arc.on('end', () => {
      resolve('success');
    });
    arc.on('error', err => {
      console.log('throw=====');
      reject(err);
    });

    arc.pipe(output);

    const shouldIgnore = (filename: string) => ignoreList.some(p => new RegExp(p).test(filename));

    try {
      if (fs.existsSync(inputPath)) {
        if (isDir(inputPath)) {
          const filenames = fs.readdirSync(inputPath);

          const gitignoreFileName = '.gitignore';
          let gitignoreContent = defaultMonaIgnoreContent;

          if (!filenames.includes(gitignoreFileName)) {
            fs.writeFileSync(path.join(inputPath, gitignoreFileName), defaultMonaIgnoreContent, 'utf8');
            filenames.push(gitignoreFileName);
          } else {
            gitignoreContent += '\n\n' + fs.readFileSync(path.join(inputPath, gitignoreFileName), 'utf8');
          }

          filenames.forEach(filename => {
            if (!shouldIgnore(filename)) {
              const filepath = path.join(inputPath, filename);
              if (isDir(filepath)) {
                arc.directory(filepath, filename);
              } else {
                arc.file(filepath, { name: filename });
                if (filename === gitignoreFileName) arc.append(gitignoreContent, { name: filename });
              }
            }
          });
        } else {
          if (shouldIgnore(inputPath)) {
            arc.file(inputPath, { name: path.basename(inputPath) });
          }
        }
      }
    } catch (err) {
      reject(err);
    }

    arc.finalize();
  });
}
