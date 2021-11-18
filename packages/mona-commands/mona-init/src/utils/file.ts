import fs from 'fs';
import path from 'path';

export const makeDir = (dirPath: string) => {
  if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length !== 0) {
    throw new Error('target directory is not empty!');
  }
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

export const readFileRecursive = (rootPath: string, files: string[]) => {
  fs.readdirSync(rootPath).forEach(fileName => {
    const filePath = path.join(rootPath, fileName);
    // 判断是否是文件夹
    if (fs.lstatSync(filePath).isDirectory()) {
      readFileRecursive(filePath, files);
    } else {
      files.push(filePath);
    }
  });
};

export const readAllFiles = (rootPath: string) => {
  const files: string[] = [];
  readFileRecursive(rootPath, files);
  return files;
};

// 删除空文件夹
export const removeEmptyDirs = (rootPath: string) => {
  const files = fs.readdirSync(rootPath);
  files.forEach(fileName => {
    const filePath = path.join(rootPath, fileName);
    // 判断是否是文件夹
    if (fs.lstatSync(filePath).isDirectory()) {
      removeEmptyDirs(filePath);
    }
  });
  // 没有文件则删除
  if (files.length === 0) {
    fs.rmdirSync(rootPath);
  }
};
