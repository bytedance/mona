import { makeDir, readFileRecursive, readAllFiles, removeEmptyDirs } from './file';

import { printWelcomeMessage, printFinishMessage, hasYarn } from './common';
import { fetchTemplate, renameFile, processTemplate, processTemplates } from './template';
import fse from 'fs-extra';
import { join } from 'path';
describe('file', () => {
  // const rootDir =
  let tempDir = `./monaJest${new Date().valueOf()}`;
  const rootDir = join(__dirname, '../');

  beforeEach(() => {
    tempDir = `./monaJest${new Date().valueOf()}`;
  });
  test('makeDir error', async () => {
    expect(() => makeDir(__dirname)).toThrow();

    expect(() => makeDir(tempDir)).not.toThrow();
    expect(() => removeEmptyDirs(tempDir)).not.toThrow();
  });

  test('removeEmptyDirs', async () => {
    // expect(() => removeEmptyDirs(tempDir)).toThrow();
    expect(() => makeDir(tempDir)).not.toThrow();
    expect(() => makeDir(join(tempDir, `./monaJest${new Date().valueOf()}`))).not.toThrow();
    // 删除子文件夹
    expect(() => removeEmptyDirs(tempDir)).not.toThrow();
    // 删除根文件夹
    expect(() => removeEmptyDirs(tempDir)).not.toThrow();
  });

  test('readFileRecursive', async () => {
    // readFileRecursive(tempDir, files);
    expect(() => readFileRecursive(tempDir, [])).toThrow();
    //@ts-ignore
    expect(() => readFileRecursive(__dirname, {})).toThrow();

    const files: string[] = [];
    readFileRecursive(rootDir, files);
    expect(files.filter(item => item.includes(__dirname)).length > 0).toBe(true);
    expect(readAllFiles(rootDir)?.length > 0).toBe(true);
  });
});

describe('common', () => {
  test('common', async () => {
    expect(printWelcomeMessage).not.toThrow();
    expect(() => printFinishMessage('monaTest')).not.toThrow();
    expect(hasYarn).not.toThrow();
  });
});

describe('template', () => {
  let tempDir = `./monaJest${new Date().valueOf()}`;

  beforeEach(() => {
    tempDir = `./monaJest${new Date().valueOf()}`;
  });
  test('fetchTemplate', async () => {
    expect(await catchError(() => fetchTemplate(tempDir, new Date().valueOf() + ''))).toBe(true);
    await fse.remove(tempDir);
    expect(await catchError(() => fetchTemplate(tempDir, 'plugin'))).toBe(false);
    await fse.remove(tempDir);
  });
});

const catchError = async (fn: any) => {
  let hasError = false;
  try {
    await fn();
    hasError = false;
  } catch (error) {
    console.log(error);
    hasError = true;
  }
  return hasError;
};
