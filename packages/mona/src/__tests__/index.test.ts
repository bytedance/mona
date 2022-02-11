import { createProjectConfig, createAppConfig, createPageConfig } from '../index';

describe('mona createConfig', () => {
  test('createProjectConfig', async () => {
    expect(() =>
      createProjectConfig({
        projectName: 'mona',
        input: './src/app.tsx',
        output: 'dist',
      }),
    ).not.toThrow();
    expect(
      createProjectConfig({
        projectName: 'mona',
        input: './src/app.tsx',
        output: 'dist',
      }),
    ).toMatchSnapshot();
  });
  test('createProjectConfig', async () => {
    expect(() =>
      createAppConfig({
        pages: [],
      }),
    ).not.toThrow();
    expect(
      createAppConfig({
        pages: [],
      }),
    ).toMatchSnapshot();
  });
  test('createProjectConfig', async () => {
    expect(() => createPageConfig({})).not.toThrow();
    expect(createPageConfig({})).toMatchSnapshot();
  });
});
