import { execSync } from 'child_process';
import { join } from 'path';
describe('mona ', () => {
  // const pkgUpdate = new PackageUpdater();

  test('mona -v', () => {
    execSync(`node ${join(__dirname, '../../bin/mona')} -v`, { encoding: 'utf-8' });
  });

  test('mona -h', () => {
    execSync(`node ${join(__dirname, '../../bin/mona')} -h`, { encoding: 'utf-8' });
  });
});
