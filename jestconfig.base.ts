const { jsWithTs } = require('ts-jest/presets');
import jest from "jest"
const config = {
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  transform: jsWithTs.transform,

  globals: {
    'ts-jest': {
      diagnostics: {
        exclude: ['**/__tests__/**/(*.)+(spec|test).[jt]s?(x)', 'dist', 'node_modules', '**/tests/shared/*'],
      },
      // 指定ts-jest使用的tsconfig配置
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
};

export default config;
