import { createProjectConfig, createAppConfig, createPageConfig } from '../index';

describe('mona createConfig', () => {
  test('createProjectConfig', async () => {
    expect(() => createProjectConfig({})).not.toThrow();
  });
  test('createProjectConfig', async () => {
    expect(() => createAppConfig({})).not.toThrow();
  });
  test('createProjectConfig', async () => {
    expect(() => createPageConfig({})).not.toThrow();
  });
});
