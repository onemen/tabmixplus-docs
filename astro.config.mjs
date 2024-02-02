import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      favicon: 'public/favicon.ico',
      logo: {
        src: './src/assets/tabmix_logo.png',
      },
      title: 'Tab Mix Plus - Docs',
      social: {
        github: 'https://github.com/onemen/TabMixPlus',
      },
      editLink: {
        baseUrl: 'https://github.com/onemen/TabMixPlus-docs/',
      },
      components: {
        ContentPanel: './src/components/ContentPanel.astro',
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
      },
      sidebar: [
        {
          label: 'Welcome to Tab Mix Plus',
          link: './',
        },
        {
          label: 'Help',
          autogenerate: {
            directory: 'help',
          },
        },
        {
          label: 'Troubleshooting',
          autogenerate: {
            directory: 'troubleshooting',
          },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'en',
    }),
    tailwind(),
    expressiveCode(),
    mdx(),
  ],
});
