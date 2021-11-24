import path from 'path';
import ora from 'ora';
import compressing from 'compressing';

export const ZIP_NAME = 'publish.zip';
export async function compressToZipFromDir(destPath: string) {
  const spinner = ora('开始打包').start();
  const zipPath = path.resolve(destPath, '..', ZIP_NAME);
  await compressing.zip.compressDir(destPath, zipPath);
  spinner.succeed(`打包成功：${zipPath}`);
  return zipPath;
}
