import { generateNewFileName } from '../../../plugins/babel/BabelPluginMultiTarget';
import fs from 'fs';

describe('babel plugin: BabelPluginMultiTarget', () => {
  it('should generate filename correctly in any case', () => {
    const originFsLstatSync = fs.lstatSync.bind(fs);
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    const arrs = ['index.ts', 'index', 'Title', 'Title/index', 'components/Title', '/a/b/index.tsx', '/a/index', '/a/b/c/Title']
    jest.spyOn(fs, 'lstatSync').mockImplementation((name) => {
      if(arrs.indexOf(name as string) !== -1) {
        return { isDirectory: () => (name as string).endsWith('Title') }
      }
      return originFsLstatSync(name);
    })

    expect(generateNewFileName('a.js', 'index.ts', 'web')).toBe('./index.web.ts');
    expect(generateNewFileName('a.js', 'index', 'web')).toBe('./index.web');
    expect(generateNewFileName('a.js', 'Title', 'web')).toBe('./Title/index.web');
    expect(generateNewFileName('a.js', 'Title/index', 'web')).toBe('./Title/index.web');
    expect(generateNewFileName('a.js', './components/Title', 'web')).toBe('./components/Title/index.web');
    expect(generateNewFileName('/a/b/a.js', './index.tsx', 'web')).toBe('./index.web.tsx');
    expect(generateNewFileName('/a/b/a.js', '@/index', 'web', { '@': '/a' })).toBe('../index.web');
    expect(generateNewFileName('/a/b/a.js', '@/Title', 'web', { '@': '/a/b/c'})).toBe('./c/Title/index.web');

    jest.restoreAllMocks();
  })
})