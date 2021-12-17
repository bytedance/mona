import { commandUsage, getGlobalInstallPkgMan, hasYarn, isGlobaInstalled } from '../../utils/command';
import cmds from '../../cmds';

test('command', () => {
  expect(() => commandUsage(cmds)).not.toThrow();

  expect(hasYarn).not.toThrow();

  expect(getGlobalInstallPkgMan).not.toThrow();

  expect(['yarn', 'npm', 'pnpm'].includes(getGlobalInstallPkgMan())).toBe(true);

  expect(isGlobaInstalled).not.toThrow();

  expect([true, false].includes(isGlobaInstalled())).toBe(true);
});
