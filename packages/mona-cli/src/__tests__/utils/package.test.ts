import { getNewestVersion, getCurrentVersion } from '../../utils/version';
import { getPkgPublicName, getPkgName, getPkgVersion } from '../../utils/package';
import { join } from 'path';
import semver from 'semver';
import fse from 'fs-extra';

const pkgDirname = join(__dirname, '../../../package.json');

test('pkgName', async () => {
  const pkgJson = await fse.readFile(pkgDirname, 'utf8');
  const { name, displayName, version } = JSON.parse(pkgJson);

  expect(getPkgPublicName()).toBe(name);
  expect(getPkgName()).toBe(displayName);
  expect(getPkgVersion()).toBe(version);
  expect([getPkgVersion(), semver.valid(getPkgVersion()) !== null]).toEqual([semver.clean(version), true]);
});
