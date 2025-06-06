module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testTimeout: 60000,
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: '.', outputName: 'jest-junit.xml' }]
  ]
};
