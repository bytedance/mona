// import PackageUpdater from '../commands/update/PackageUpdater';
import { getCurrentVersion, getNewestVersion } from '../commands/update/utils/version';

import cprocess from 'child_process';
import { getPkgVersion } from '../commands/update/utils/package';

describe('package udpate', () => {
  // const pkgUpdate = new PackageUpdater();
  it('should version get correctly', () => {
    const currentVersion = getCurrentVersion();
    jest.spyOn(cprocess, 'execSync').mockImplementation(() => '1.0.0')
    const newestVersion = getNewestVersion();

    expect(currentVersion).toBe(getPkgVersion());
    expect(newestVersion).toBe('1.0.0');
    jest.resetAllMocks();
  });
});
