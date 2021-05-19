module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-tsdoc'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        'tsdoc/syntax': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
      },
      parser: '@typescript-eslint/parser',
    },
    {
      files: ['cypress/**/*.spec.js', 'cypress/**/*.spec.ts'],
      env: {
        'cypress/globals': true,
      },
      plugins: ['cypress', '@cypress/dev'],
    },
  ],
}
