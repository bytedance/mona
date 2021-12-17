import { commandUsage } from '../help';

describe('publish help', () => {
  test('commandUsage', async () => {
    expect(commandUsage).not.toThrow();
  });
});
