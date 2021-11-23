import { makeDir, readFileRecursive, readAllFiles, removeEmptyDirs } from './file';
import { execSync } from 'child_process';
import { printWelcomeMessage, printFinishMessage, hasYarn } from './common';
import { fetchTemplate, processTemplates } from './template';
import fse from 'fs-extra';
import { join } from 'path';
import PackageUpdater from '@bytedance/mona-cli/src/PackageUpdater';
import { askConfig, ask, AskOpts } from './ask';
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
  new PackageUpdater().start();
  test('fetchTemplate', async () => {
    expect(await catchError(() => fetchTemplate(tempDir, new Date().valueOf() + ''))).toBe(true);
    await fse.remove(tempDir);
    expect(await catchError(() => fetchTemplate(tempDir, 'plugin'))).toBe(false);
    await fse.remove(tempDir);
  });
  test('process Ts Templates', async () => {
    expect(await catchError(() => fetchTemplate(tempDir, 'plugin'))).toBe(false);
    // css测试浪费时间
    expect(
      await catchError(() =>
        processTemplates(tempDir, {
          projectName: 'monaTest',
          cssExt: 'less',
          typescript: true
        })
      )
    ).toBe(false);
  }, 100000);

  test('template Ts build', async () => {
    // 安装依赖
    const command = `npm i  --registry=https://registry.npmjs.org`;
    const build = `npm run build`;

    execSync(`cd ${tempDir} && ${command} && ${build}`, { stdio: 'ignore' });

    await fse.remove(tempDir);
  }, 100000);

  test('process Js Templates', async () => {
    expect(await catchError(() => fetchTemplate(tempDir, 'plugin'))).toBe(false);
    expect(
      await catchError(() =>
        processTemplates(tempDir, {
          projectName: 'monaTest',
          cssExt: 'less',
          typescript: false
        })
      )
    ).toBe(false);
  }, 100000);
  test('template Js build', async () => {
    // 安装依赖
    const command = `npm i --registry=https://registry.npmjs.org`;
    const build = `npm run build`;
    execSync(`cd ${tempDir} && ${command} && ${build}`, { stdio: 'ignore' });
    await fse.remove(tempDir);
  }, 100000);
});

describe('ask', () => {
  test('ask use default value', async () => {
    const params = Object.keys(askConfig).reduce<AskOpts>((res, item) => {
      const askItemConfig = askConfig[item];
      res[item] = askItemConfig?.testDefault || askItemConfig.default;
      return res;
    }, <AskOpts>{});
    await ask(params);
  }, 10000);
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
