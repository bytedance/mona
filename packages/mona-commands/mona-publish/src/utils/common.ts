import path from 'path';
import ora from 'ora';
import compressing from 'compressing';

export async function compressToZipFromDir(destPath: string) {
  const spinner = ora('开始打包').start();
  const zipPath = path.resolve(destPath, '..', 'publish.zip');
  await compressing.zip.compressDir(destPath, zipPath);
  spinner.succeed(`打包成功：${zipPath}`);
  return zipPath;
}
