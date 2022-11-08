import { readTypescriptFile, readJavascriptFile } from '../readConfig';
import { readConfig } from '../index';

// import { join } from 'path';

const tsFilePath = './__tests__/config.ts';
const jsFilePath = './__tests__/config.js';
const jsErrorFilePath = './__tests__/config_error.js';
const tsErrorFilePath = './__tests__/config_error.ts';
const jsNumberErrorFilePath = './__tests__/config_number.js';
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

  it('should log error message when file is error', () => {
    expect(readTypescriptFile(tsErrorFilePath)).toEqual({});
    expect(readJavascriptFile(jsErrorFilePath)).toEqual({});
    expect(readJavascriptFile(jsNumberErrorFilePath)).toEqual({});
  });

  it('should read config file correctly', () => {
    expect(readConfig(tsFilePath)).toEqual({});
    expect(readConfig(jsFilePath)).toEqual({});
    expect(readConfig(emptyFilePath)).toEqual({});
  });
});
