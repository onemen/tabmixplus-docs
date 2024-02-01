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
      title: 'Docs',
      social: {
        github: 'https://github.com/onemen/TabMixPlus',
      },
      editLink: {
        baseUrl: 'https://github.com/onemen/TabMixPlus-docs/',
      },
      components: {
        Header: './src/components/Header.astro',
      },
      sidebar: [
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
      // locales: {
      //   root: {
      //     label: 'English',
      //     lang: 'en', // lang is required for root locales
      //   },
      // },
    }),
    tailwind(),
    expressiveCode(),
    mdx(),
  ],
});
