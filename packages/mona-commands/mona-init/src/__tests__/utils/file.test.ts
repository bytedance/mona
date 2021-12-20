import { makeDir, readFileRecursive, readAllFiles, removeEmptyDirs } from '../../utils/file';
import fse from 'fs-extra';
import { join } from 'path';

describe('file', () => {
  // const rootDir =
  let tempDir = `./monaJest${new Date().valueOf()}`;
  const rootDir = join(__dirname, '../');

  beforeEach(() => {
    tempDir = `./monaJest${new Date().valueOf()}`;
  });
  afterEach(() => {
    return fse.remove(tempDir);
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
