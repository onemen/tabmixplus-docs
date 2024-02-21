import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { rehypeExternalLinks } from './src/utils/rehypePluginLinks.mjs';

export const starlightConfig = {
  favicon: '/favicon.ico',
  logo: {
    src: '/src/assets/tabmix_logo.png',
  },
  title: 'Tab Mix Plus - Docs',
  social: {
    github: 'https://github.com/onemen/TabMixPlus',
  },
  editLink: {
    baseUrl: 'https://github.com/onemen/tabmixplus-docs/',
  },
  components: {
    Head: '/src/components/Head.astro',
    Sidebar: '/src/components/Sidebar.astro',
  },
  sidebar: [
    {
      label: 'Welcome to Tab Mix Plus',
      link: '/',
    },
    {
      label: 'Installation',
      link: '/other/installation',
    },
    {
      label: 'Important Links',
      items: [
        {
          label: 'Discussions',
          link: 'https://github.com/onemen/TabMixPlus/discussions/',
          attrs: { target: '_blank', style: 'font-style: italic' },
        },
        {
          label: 'Change Log',
          link: 'https://github.com/onemen/TabMixPlus/releases/',
          attrs: { target: '_blank', style: 'font-style: italic' },
        },
        {
          label: 'Downloads',
          link: 'https://bitbucket.org/onemen/tabmixplus-for-firefox/downloads/',
          attrs: { target: '_blank', style: 'font-style: italic' },
        },
      ],
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
  customCss: ['/src/styles/custom.css'],
  defaultLocale: 'en',
};

const baseUrl = '/tabmixplus-docs';

// https://astro.build/config
export default defineConfig({
  site: process.env.CI ? 'https://onemen.github.io' : 'http://localhost:4321',
  base: baseUrl,
  cacheDir: './node_modules/.astro',
  integrations: [starlight(starlightConfig), tailwind(), expressiveCode(), mdx()],
  markdown: {
    smartypants: false,
    rehypePlugins: [
      // https://docs.astro.build/en/recipes/external-links/#recipe
      [rehypeExternalLinks, { target: '_blank', baseUrl }],
    ],
  },
});
