module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-undef': 'error',
  },
  env: {
    node: true,
    es6: true,
    jest: true,
    browser: true,
  },
  globals: {
    File: 'readonly',
    FileList: 'readonly',
    Blob: 'readonly',
    FormData: 'readonly',
    URL: 'readonly',
    URLSearchParams: 'readonly',
    HTMLFormElement: 'readonly',
    MediaSource: 'readonly',
    window: 'readonly',
    globalThis: 'readonly',
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/'],
}; 