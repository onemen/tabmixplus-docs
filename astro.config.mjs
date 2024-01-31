import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      favicon: 'public/favicon.ico',
      logo: {
        src: './src/assets/tabmix_logo.png',
      },
      title: 'Docs',
      social: {
        github: 'https://github.com/onemen/TabMixPlus',
      },
      editLink: {
        baseUrl: 'https://github.com/onemen/TabMixPlus-docs/',
      },
      // sidebar: [
      //   {
      //     label: 'Guides',
      //     items: [
      //       // Each item here is one entry in the navigation menu.
      //       {
      //         label: 'Example Guide',
      //         link: '/guides/example/',
      //       },
      //     ],
      //   },
      //   {
      //     label: 'Reference',
      //     autogenerate: {
      //       directory: 'reference',
      //     },
      //   },
      // {
      //   label: 'Troubleshooting',
      //   // Autogenerate a group of links for the 'guides' directory.
      //   autogenerate: { directory: 'troubleshooting' },
      // },
      // ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en', // lang is required for root locales
        },
      },
    }),
    tailwind(),
  ],
});
