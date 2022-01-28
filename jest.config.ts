/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  testEnvironment: 'node',
  projects: ['<rootDir>/packages/mona-clients/*', '<rootDir>/packages/mona-shared/', '<rootDir>/packages/mona-cli/'],

  // projects: ['<rootDir>', '<rootDir>/packages/mona-clients/mona-client-mini/'],
  clearMocks: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },

  setupFilesAfterEnv: ['./jest-setup.ts'],

  testEnvironmentOptions: { resources: 'usable' },

  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/local-test-fb/'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
};
