/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

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
};
