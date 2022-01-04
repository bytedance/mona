/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const { RENDER_NODE } = require('@bytedance/mona-shared/dist/constants');
module.exports = {
  clearMocks: true,

  collectCoverage: false,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },

  roots: ['packages'],

  setupFilesAfterEnv: ['./jest-setup.ts'],

  testEnvironmentOptions: { resources: 'usable' },

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],

  globals: Object.keys(RENDER_NODE).reduce(
    (pre, item) => {
      pre[`${item}_STR`] = JSON.stringify(RENDER_NODE[item]);
      return pre;
    },
    { ...RENDER_NODE },
  ),
};
