import { getNewestVersion, getCurrentVersion } from '../../commands/update/utils/version';
import { join } from 'path';
import semver from 'semver';
import fse from 'fs-extra';

const pkgDirname = join(__dirname, '../../../package.json');

test('pkgVersion', async () => {
  const pkgJson = await fse.readFile(pkgDirname, 'utf8');
  let { version } = JSON.parse(pkgJson);
  version = semver.clean(version);

  expect([getCurrentVersion(), semver.valid(getCurrentVersion()) !== null]).toEqual([version, true]);

  expect(semver.valid(getNewestVersion())).not.toBeNull();
});
