module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:astro/recommended'],

  env: {
    es2023: true,
    node: true,
    browser: true,
  },

  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },

  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
      },
    },
  ],

  rules: {
    'prettier/prettier': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-prototype-builtins': 'off',
    // "no-redeclare": "off",
    // "no-setter-return": "off",
    'no-shadow': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'require-await': 'error',
  },
};
