import mona from '.';
import PackageUpdater from './PackageUpdater';

describe('pkgVersion', () => {
  const pkgUpdate = new PackageUpdater();
  test('pkg update', () => {
    //@ts-ignore
    const preIncompatible = pkgUpdate._incompatible;
    //@ts-ignore
    pkgUpdate._incompatible = true;
    pkgUpdate.update();
    //@ts-ignore
    pkgUpdate._incompatible = preIncompatible;
  });

  test('pkg check version', () => {
    pkgUpdate.check();
  });

  test('pkg start', () => {
    //@ts-ignore
    pkgUpdate._currentVersion = '0.0.0';
    //@ts-ignore
    pkgUpdate._newestVersion = '0.1.3';
    pkgUpdate.start();

    new PackageUpdater().start();
  });

  // test('mona', () => {
  //   mona();
  // });
});
