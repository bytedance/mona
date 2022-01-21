
import { execSync } from 'child_process';

let _hasYarn: null | boolean = null;
export function hasYarn() {
  if (_hasYarn !== null) {
    return _hasYarn;
  }

  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return (_hasYarn = true);
  } catch (e) {
    return (_hasYarn = false);
  }
}

let _pkgMan: string
export function getGlobalInstallPkgMan() {
  if (_pkgMan !== undefined) {
    return _pkgMan;
  }
  if (hasYarn()) {
    const [yarnGlobalDir] = execSync('yarn global dir').toString().split('\n');
    if (__dirname.includes(yarnGlobalDir)) {
      return (_pkgMan = 'yarn');
    }
  }
  const [npmGlobalPrefix] = execSync('npm config get prefix').toString().split('\n');
  if (__dirname.includes(npmGlobalPrefix)) {
    return (_pkgMan = 'npm');
  }

  return (_pkgMan = 'npm');
}