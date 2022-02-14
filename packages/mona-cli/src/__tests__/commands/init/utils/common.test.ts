import { hasYarn } from '../../../../commands/init/utils/common';
describe('common', () => {
  test('common', () => {
    // expect(printWelcomeMessage).not.toThrow();
    // expect(() => printFinishMessage('monaTest')).not.toThrow();
    expect(hasYarn).not.toThrow();
  });
});
