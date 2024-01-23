module.exports = {
  env: {
    browser: true,
    es6: true,
  },

  extends: ['eslint:recommended', 'plugin:prettier/recommended'],

  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },

  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'script',
    requireConfigFile: false,
  },

  overrides: [
    {
      // All .eslintrc.js files are in the node environment, so turn that
      // on here.
      // https://github.com/eslint/eslint/issues/13008
      files: ['.eslintrc.js', '*.config.js'],
      env: {
        node: true,
        browser: false,
      },
      rules: {strict: 'off'},
    },
    {
      files: ['*.html'],
      plugins: ['html'],
    },
  ],

  rules: {
    'no-unused-vars': ['error', {vars: 'all', args: 'all', argsIgnorePattern: '^_'}],
    'no-shadow': 'error',
    'prettier/prettier': 'error',
  },
};
