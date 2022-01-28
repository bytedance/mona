import { getGlobalInstallPkgMan, hasYarn } from '../../commands/update/utils/common';
// import { commandUsage } from '../../commands/init/help';

test('command', () => {
  // expect(() => commandUsage(cmds)).not.toThrow();

  expect(hasYarn).not.toThrow();

  expect(getGlobalInstallPkgMan).not.toThrow();

  expect(['yarn', 'npm', 'pnpm'].includes(getGlobalInstallPkgMan())).toBeTruthy();

  // expect(isGlobaInstalled).not.toThrow();

  // expect([true, false].includes(isGlobaInstalled())).toBeTruthy();
});
