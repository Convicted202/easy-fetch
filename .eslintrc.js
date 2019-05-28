module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    '@eleks/eleks',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  rules: {
    indent: 'off',
    'one-var': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-member-accessibility': 'no-public',
    '@typescript-eslint/interface-name-prefix': 'always'
  }
};
