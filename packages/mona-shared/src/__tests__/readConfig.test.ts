import { readTypescriptFile, readJavascriptFile } from '../readConfig';
import { readConfig } from '../index';

import { join } from 'path';

const tsRelativePath = '../index';
const tsFilePath = join(__dirname, tsRelativePath + '.ts');
const jsRelativePath = '../../../../babel.config';
const jsFilePath = join(__dirname, jsRelativePath + '.js');

const emptyFilePath = `./${new Date()}`;

describe('mona-shared readConfig', () => {
  test('readTypescriptFile', async () => {
    readTypescriptFile(tsFilePath);
  });

  test('readJavascriptFile', async () => {
    readJavascriptFile(jsFilePath);
  });

  test('readTsFile empty', async () => {
    expect(() => readTypescriptFile(emptyFilePath)).toThrow();
  });

  test('readJsFile empty', async () => {
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
