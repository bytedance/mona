import searchScriptFile from '../searchScriptFile';
import fs from 'fs';

describe('mona-shared searchScriptFile', () => {
  it('search file', async () => {
    const relativePath = './test';
    const absolutePath = '/test/index'
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true)
    expect(searchScriptFile(relativePath)).toBe(`${relativePath}.js`);
    expect(searchScriptFile(absolutePath)).toBe(`${absolutePath}.js`);
  });
});

