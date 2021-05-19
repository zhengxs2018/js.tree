// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const pkg = require('./package.json')

module.exports = {
  name: pkg.name,
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
}
