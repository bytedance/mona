import { startCommandUsage, buildCommandUsage } from '../help';

test('command', () => {
  expect(buildCommandUsage).not.toThrow();
  expect(startCommandUsage).not.toThrow();
});
