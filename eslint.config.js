import js from '@eslint/js';
import * as eslintMdx from 'eslint-mdx';
import astroPlugin from 'eslint-plugin-astro';
import importPlugin from 'eslint-plugin-import';
import jsxA11YPlugin from 'eslint-plugin-jsx-a11y';
import markdownPlugin from 'eslint-plugin-markdown';
import * as mdx from 'eslint-plugin-mdx';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import ymlPlugin from 'eslint-plugin-yml';
import globals from 'globals';

export default [
  {
    ignores: [
      '.hg/**',
      '**/*~/**',
      '**/*~*',
      '**/*׳¢׳•׳×׳§*.*',
      '**/*עותק*.*',
      '**/private/**',
      '**/config/**',
      'eslint_result.js',
      '.eslintrc.js',
      'manifest.json',
      'logs/**',
      'lib/**',
      'dist/**',
      '.astro/**',
      '.vscode/**',
      '**/*.local.*',
      '**/*.local',
      // generated files,
      '**/releases/*',
      'downloadsInfo.json',
      // lock files
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
    ],
  },

  js.configs.recommended,
  ...markdownPlugin.configs.recommended,
  prettierRecommended,
  ...astroPlugin.configs.recommended,
  ...ymlPlugin.configs['flat/recommended'],

  {
    files: ['**/*.{js,cjs,mjs,ts,jsx,tsx,astro,md,mdx}'],
    plugins: { markdown: markdownPlugin },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        ...globals.es2022,
      },
    },
    settings: {
      'import/resolver': {
        // this loads <rootdir>/tsconfig.json to eslint
        typescript: {},
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  {
    // Define the configuration for `<script>` tag.
    // Script in `<script>` is assigned a virtual file name with the `.js` extension.
    files: ['**/*.astro', '**/*.astro/*.js', '*.astro/*.js', '**/*.astro/*.ts', '*.astro/*.ts'],
    rules: {
      // If you are using "prettier/prettier" rule,
      // you don't need to format inside <script> as it will be formatted as a `.astro` file.
      'prettier/prettier': 'off',
    },
  },

  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },

  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  {
    files: ['**/*.mdx'],
    plugins: {
      'jsx-a11y': jsxA11YPlugin,
      import: importPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      parser: eslintMdx,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...jsxA11YPlugin.configs.recommended.rules,
      'no-unused-expressions': 'off',
      'react/jsx-uses-vars': 'error',
    },
  },
];
