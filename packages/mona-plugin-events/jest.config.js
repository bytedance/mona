module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // If you defined paths in tsconfig.json
    // you have to define them again here
    // for jest doesn't respect tsconfig.json's paths
    '@lib/(.*)': '<rootDir>/src/$1',
  },
};
