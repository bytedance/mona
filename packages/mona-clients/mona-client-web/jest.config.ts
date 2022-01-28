import baseConfig from '../../../jestconfig.base';

module.exports = {
  ...baseConfig,
  testEnvironmentOptions: { resources: 'usable' },

  setupFilesAfterEnv: ['../../../jest-setup.ts'],
};
