import baseConfig from '../../../jestconfig.base';

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: ['../../mona-clients/mona-client-web/jest-setup.ts'],

};
