import { hasYarn } from '../../../../commands/init/utils/common';
describe('common', () => {
  test('common', () => {
    expect(hasYarn).not.toThrow();
  });
});
