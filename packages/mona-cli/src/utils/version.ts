import { execSync } from 'child_process';
import { getPkgPublicName, getPkgVersion } from './package';

export function getCurrentVersion() {
  return getPkgVersion();
}

export function getNewestVersion() {
  let newestVersion = '0.0.0';
  try {
    const cmd = `npm view ${getPkgPublicName()} version --registry=https://registry.npmjs.org`;
    newestVersion = execSync(cmd).toString().replace(/\s/, '');
  } catch (err) {
    // Do Nothing
  }

  return newestVersion;
}
