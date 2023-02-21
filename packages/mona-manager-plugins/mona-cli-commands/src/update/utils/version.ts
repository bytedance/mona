import { execSync } from 'child_process';
import { getPkgPublicName, getPkgVersion } from './package';

export function getCurrentVersion(pkg?: any) {
  return getPkgVersion(pkg);
}

export function getNewestVersion(registry: string, pkg?: any) {
  let newestVersion = '0.0.0';
  try {
    const cmd = `npm view ${getPkgPublicName(pkg)} version --registry=${registry}`;
    newestVersion = execSync(cmd).toString().replace(/\s/, '');
  } catch (err) {
    // Do Nothing
  }

  return newestVersion;
}
