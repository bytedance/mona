import { execSync } from 'child_process';
import { getPkgPublicName, getPkgVersion } from './package';

export function getCurrentVersion() {
  return getPkgVersion();
}

export function getNewestVersion() {
  let newestVersion = '0.0.0';
  try {
    const cmd = `npm show ${getPkgPublicName()} version`;
    newestVersion = execSync(cmd).toString().replace(/\s/, '');
  } catch (err) {
    // Do Nothing
  }

  return newestVersion;
}

export function compareVersion(v1?: string, v2?: string) {
  if (!v1 || !v2) {
    return 0;
  }
  const arr1 = v1.split('.');
  const arr2 = v2.split('.');
  const maxLength = Math.max(arr1.length, arr2.length);
  for (let i = 0; i < maxLength; i++) {
    if (Number(arr1[i] || 0) > Number(arr2[i] || 0)) {
      return 1;
    } else if (Number(arr1[i]) < Number(arr2[i])) {
      return -1;
    }
  }
  return 0;
}
