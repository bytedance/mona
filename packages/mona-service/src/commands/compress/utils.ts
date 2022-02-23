import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import ora from 'ora';
import chalk from 'chalk';

function isDir(rawFilename: string) {
  return fs.lstatSync(rawFilename).isDirectory()
}

export function ensureDirExist(dirname: string) {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
}

export async function compressDir(inputPath: string) {
  const spinner = ora('打包中...').start();
  ensureDirExist('.mona');
  const outputPath = path.join(inputPath, '.mona', `publish${Date.now()}.zip`);
  await compressToZip(inputPath, outputPath, ['dist', 'node_modules', '.mona'])
  spinner.succeed(chalk.green('打包成功'));
  return outputPath;
}

export function compressToZip(inputPath: string, outputPath: string, ignoreList: string[] = []) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const arc = archiver('zip', {
      zlib: { level:9 }
    })

    arc.on('close', () => {
      console.log('close now')
    })
    arc.on('end', () => {
      resolve("success");
    })
    arc.on('error', (err) => {
      reject(err);
    })

    arc.pipe(output);

    const shouldIgnore = (filename: string) => ignoreList.some(p => new RegExp(p).test(filename))

    try {
      if (fs.existsSync(inputPath)) {
        if (isDir(inputPath)) {
          const filenames = fs.readdirSync(inputPath);
          filenames.forEach(filename => {
            if (!shouldIgnore(filename)) {
              if (isDir(filename)) {
                arc.directory(path.join(inputPath, filename), filename);
              } else {
                arc.file(path.join(inputPath, filename), { name: filename });
              }
            }
          })
        } else {
          if (shouldIgnore(inputPath)) {
            arc.file(inputPath, { name: path.basename(inputPath) });
          }
        }
      }
    } catch(err) {
      reject(err)
    }

    arc.finalize();
  })
}