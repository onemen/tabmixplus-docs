/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:markdown/recommended',
    'plugin:astro/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['markdown'],
  settings: {
    'import/resolver': {
      // this loads <rootdir>/tsconfig.json to eslint
      typescript: {},
    },
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
  },

  // https://github.com/ota-meshi/eslint-plugin-astro
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
      rules: {},
    },
    {
      // Define the configuration for `<script>` tag.
      // Script in `<script>` is assigned a virtual file name with the `.js` extension.
      files: ['**/*.astro/*.js', '*.astro/*.js', '**/*.astro/*.ts', '*.astro/*.ts'],
      env: {
        browser: true,
        es2022: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: null,
      },
      rules: {
        // If you are using "prettier/prettier" rule,
        // you don't need to format inside <script> as it will be formatted as a `.astro` file.
        'prettier/prettier': 'off',
      },
    },
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
};
