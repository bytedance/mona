import { execSync } from 'child_process';
import { join } from 'path';
describe('mona ', () => {
  // const pkgUpdate = new PackageUpdater();
  execSync(`cd ${join(__dirname, '../../')} && npm run build`, { stdio: 'ignore' });

  test('mona -v', () => {
    execSync(`node ${join(__dirname, '../../bin/mona')} -v`, { encoding: 'utf-8' });
  });

  test('mona -h', () => {
    execSync(`node ${join(__dirname, '../../bin/mona')} -h`, { encoding: 'utf-8' });
  });

  // TODO: MONA命令集成测试
});