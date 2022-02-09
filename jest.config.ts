/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  projects: [
    '<rootDir>/packages/mona-clients/*',
    '<rootDir>/packages/mona-cli/',
    '<rootDir>/packages/mona-service/',
    '<rootDir>/packages/mona-shared/',
    '<rootDir>/packages/mona-runtime/',
    '<rootDir>/packages/mona/',
  ],

  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/local-test-fb/'],
};
