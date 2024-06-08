import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import markdown from 'eslint-plugin-markdown';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// TODO: update to eslint 9 when all plugins are supported

export default [
  {
    ignores: [
      '.hg',
      '**/*~/*',
      '**/*~*.xul',
      '**/*~*.xml',
      '**/*~*.js',
      '**/*~*.jsm',
      '**/*~*.*',
      '**/*׳¢׳•׳×׳§*.js',
      '**/*׳¢׳•׳×׳§*.jsm',
      '**/*עותק*.js',
      '**/*עותק*.jsm',
      '**/private/*',
      '**/config/*',
      'eslint_result.js',
      '.eslintrc.js',
      'manifest.json',
      'logs/',
      'lib',
      // generated files,
      'releases/',
      'downloadsInfo.json',
    ],
  },

  js.configs.recommended,
  ...markdown.configs.recommended,
  eslintPluginPrettierRecommended,
  ...eslintPluginAstro.configs.recommended,

  {
    files: ['**/*.{js,cjs,mjs,ts,jsx,tsx,astro,md,mdx}'],
    plugins: { markdown },
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

  ...compat.config({
    overrides: [
      {
        files: ['*.mdx'],
        extends: ['plugin:jsx-a11y/recommended', 'plugin:mdx/recommended'],
        plugins: ['jsx-a11y', 'import', 'react'],
        parser: 'eslint-mdx',
        rules: {
          'no-unused-expressions': 'off',
          'react/jsx-uses-vars': 'error',
        },
      },
      {
        files: ['*.yml'],
        plugins: ['yaml'],
        extends: ['plugin:yaml/recommended'],
      },
    ],
  }),
];
