import { hasYarn } from '../../../../init/utils/common';
describe('common', () => {
  test('common', () => {
    expect(hasYarn).not.toThrow();
  });
});
