import searchScriptFile from '../searchScriptFile';

import { join } from 'path';
// import { execSync } from 'child_process';

const tsRelativePath = '../index';
const tsFilePath = join(__dirname, tsRelativePath + '.ts');
const jsRelativePath = '../../../../jest.config';
const jsFilePath = join(__dirname, jsRelativePath + '.js');

describe('mona-shared searchScriptFile', () => {
  test('searchScriptFile js', async () => {
    expect(() => searchScriptFile(jsFilePath)).not.toThrow();
    expect(searchScriptFile(jsFilePath)).toBe(jsFilePath);
    expect(searchScriptFile(join(__dirname, jsRelativePath))).toBe(jsFilePath);
  });

  test('searchScriptFile ts', async () => {
    expect(() => searchScriptFile(tsFilePath)).not.toThrow();
    expect(searchScriptFile(tsFilePath)).toBe(tsFilePath);
    expect(searchScriptFile(join(__dirname, tsRelativePath))).toBe(tsFilePath);
  });
});

// test('build project', () => {
//   execSync(`cd ${join(__dirname, '../')} && npm run build`, { stdio: 'ignore' });
// });
