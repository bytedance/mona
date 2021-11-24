import { readTypescriptFile, readJavascriptFile } from './readConfig';
import { readConfig, searchScriptFile } from './index';

import { join } from 'path';
import { execSync } from 'child_process';

const tsFilePath = join(__dirname, '/index.ts');
const jsFilePath = join(__dirname, '../dist/index.js');
const emptyFilePath = `./${new Date()}`;

describe('mona-shared readConfig', () => {
  test('readTypescriptFile', async () => {
    readTypescriptFile(tsFilePath);
  });

  test('readJavascriptFile', async () => {
    readJavascriptFile(jsFilePath);
  });

  test('readTypescriptFile empty', async () => {
    expect(() => readTypescriptFile(emptyFilePath)).toThrow();
  });

  test('readJavascriptFile empty', async () => {
    expect(() => readJavascriptFile(emptyFilePath)).toThrow();
  });

  test('readConfig Ts', async () => {
    readConfig(tsFilePath);
  });

  test('readConfig Js', async () => {
    readConfig(jsFilePath);
  });

  test('readConfig empty', async () => {
    expect(() => readConfig(emptyFilePath)).not.toThrow();
    expect(readConfig(emptyFilePath)).toEqual({});
  });
});

describe('mona-shared searchScriptFile', () => {
  test('searchScriptFile', async () => {
    expect(() => searchScriptFile(tsFilePath)).not.toThrow();
    expect(() => searchScriptFile(jsFilePath)).not.toThrow();
    expect(searchScriptFile(jsFilePath)).toBe(jsFilePath);
    expect(searchScriptFile(join(__dirname, '/index'))).toBe(join(__dirname, '/index.ts'));
  });
});

test('build project', () => {
  execSync(`cd ${join(__dirname, '../')} && npm run build`, { stdio: 'ignore' });
});
