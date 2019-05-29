module.exports = {
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'js'],
  setupFiles: ['./test/setup.js']
};
