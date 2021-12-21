import { fetchTemplate, processTemplates } from '../../utils/template';
import fse from 'fs-extra';
import PackageUpdater from '@bytedance/mona-cli/src/PackageUpdater';

describe('template', () => {
  let tempDir = `./monaJest${new Date().valueOf()}`;
  new PackageUpdater().start();
  afterEach(() => {
    return fse.remove(tempDir);
  });
  test('fetchTemplate use error templateName', async () => {
    expect(await catchError(() => fetchTemplate(tempDir, new Date().valueOf() + ''))).toBe(true);
    // await fse.remove(tempDir);
  });
  test('fetchTemplate', async () => {
    expect(await catchError(() => fetchTemplate(tempDir, 'plugin'))).toBe(false);
    // await fse.remove(tempDir);
  });

  test('process Ts Templates', async () => {
    expect(await catchError(() => fetchTemplate(tempDir, 'plugin'))).toBe(false);
    // css测试浪费时间
    expect(
      await catchError(() =>
        processTemplates(tempDir, {
          projectName: 'monaTest',
          cssExt: 'less',
          typescript: true,
        }),
      ),
    ).toBe(false);
    // await fse.remove(tempDir);
  }, 100000);

  // test('template Ts build', async () => {
  //   // 安装依赖
  //   const command = `npm i  --registry=https://registry.npmjs.org`;
  //   const build = `npm run build`;
  //   execSync(`cd ${tempDir} && ${command} `, { stdio: 'ignore' });
  //   execSync(`cd ${tempDir} &&  yarn build`, { stdio: 'ignore' });

  //   // execSync(`cd ${tempDir} && ${command} && ${build}`, { stdio: 'ignore' });

  //   await fse.remove(tempDir);
  // }, 100000);

  test('process Js Templates', async () => {
    expect(await catchError(() => fetchTemplate(tempDir, 'plugin'))).toBe(false);
    expect(
      await catchError(() =>
        processTemplates(tempDir, {
          projectName: 'monaTest',
          cssExt: 'less',
          typescript: false,
        }),
      ),
    ).toBe(false);
  }, 100000);
  // test('template Js build', async () => {
  //   // 安装依赖
  //   const command = `npm i --registry=https://registry.npmjs.org`;
  //   const build = `npm run build`;
  //   execSync(`cd ${tempDir} && ${command} && ${build}`, { stdio: 'ignore' });
  //   await fse.remove(tempDir);
  // }, 100000);
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