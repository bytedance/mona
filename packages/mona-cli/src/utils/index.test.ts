import { getNewestVersion, getCurrentVersion } from './version';
import { getPkgPublicName, getPkgName, getPkgVersion } from './package';
import { join } from 'path';
import semver from 'semver';
import fse from 'fs-extra';
import { commandUsage, getGlobalInstallPkgMan, hasYarn, isGlobaInstalled } from './command';
import cmds from '../cmds';

const pkgDirname = join(__dirname, '../../package.json');

test('pkgName', async () => {
  const pkgJson = await fse.readFile(pkgDirname, 'utf8');
  const { name, displayName } = JSON.parse(pkgJson);
  // expect([getPkgPublicName(), getPkgName(), getPkgVersion]).toEqual([name, displayName, version]);
  expect(getPkgPublicName()).toBe(name);
  expect(getPkgName()).toBe(displayName);
});

test('pkgVersion', async () => {
  const pkgJson = await fse.readFile(pkgDirname, 'utf8');
  let { version } = JSON.parse(pkgJson);
  version = semver.clean(version);

  expect([getCurrentVersion(), semver.valid(getCurrentVersion()) !== null]).toEqual([version, true]);
  expect([getPkgVersion(), semver.valid(getPkgVersion()) !== null]).toEqual([version, true]);

  expect(semver.valid(getNewestVersion())).not.toBeNull();
});

test('command', () => {
  expect(() => commandUsage(cmds)).not.toThrow();

  expect(hasYarn).not.toThrow();

  expect(getGlobalInstallPkgMan).not.toThrow();

  expect(['yarn', 'npm'].includes(getGlobalInstallPkgMan())).toBe(true);

  expect(isGlobaInstalled).not.toThrow();

  expect([true, false].includes(isGlobaInstalled())).toBe(true);
});
