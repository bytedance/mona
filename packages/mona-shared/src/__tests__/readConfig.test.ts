import { readTypescriptFile, readJavascriptFile } from '../readConfig';
import { readConfig } from '../index';

// import { join } from 'path';

const tsFilePath = './__tests__/config.ts';
const jsFilePath = './__tests__/config.js';
const emptyFilePath = `./temp`;

describe('mona-shared readConfig', () => {
  it('should read config file correctly', () => {
    expect(readTypescriptFile(tsFilePath)).toEqual({});
    expect(readJavascriptFile(jsFilePath)).toEqual({});
  });

  it('should not throw error when file not found', () => {
    expect(() => readTypescriptFile(emptyFilePath)).not.toThrow();
    expect(() => readJavascriptFile(emptyFilePath)).not.toThrow();
  });

  it('should read config file correctly', () => {
    expect(readConfig(tsFilePath)).toEqual({});
    expect(readConfig(jsFilePath)).toEqual({});
    expect(readConfig(emptyFilePath)).toEqual({});
  });
});
