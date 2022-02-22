import fse from 'fs-extra';
import { fetchTemplate, processTemplates } from '../../../../commands/init/utils/template';

function isEmptyDir(dirname: string) {
  try {
    const files = fse.readdirSync(dirname);
    if (files && files.length) {
      return false;
    }
  } catch (e) {
    return true;
  }
  return true;
}

describe('template', () => {
  let tempDir = `./monaJest`;

  afterEach(() => {
    return fse.remove(tempDir);
  });

  test('should reject when fetch invalid tempalteName', () => {
    expect(fetchTemplate(tempDir, new Date().valueOf() + '')).rejects.not.toBeNull();
  });
  test('should fetch templates to local directory correctly', async () => {
    expect(isEmptyDir(tempDir)).toBeTruthy();
    await fetchTemplate(tempDir, 'plugin');
    expect(isEmptyDir(tempDir)).toBeFalsy();
  });

  test('should process template normally', async () => {
    await fetchTemplate(tempDir, 'plugin');
    // css测试浪费时间
    await processTemplates(tempDir, {
      projectName: 'monaTest',
      cssExt: 'less',
      typescript: true,
    });
    const config = JSON.parse(fse.readFileSync(`${tempDir}/package.json`).toString());
    const names = fse.readdirSync(tempDir);
    expect(config.name).toBe('monaTest');
    expect(names.some(name => /\.ts/.test(name))).toBeTruthy();
  });
});
