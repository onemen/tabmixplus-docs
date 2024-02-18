/** @type {import("prettier").Config} */
export default {
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  printWidth: 100,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: ['*.astro'],
      options: {
        parser: 'astro',
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        semi: false,
        proseWrap: 'preserve',
      },
    },
  ],
};
