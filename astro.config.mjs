import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { createExternalLinksPlugin } from './src/utils/satteriExternalLinks.js';

export const starlightConfig = {
  favicon: '/favicon.ico',
  logo: {
    src: './src/assets/tabmix_logo.png',
  },
  title: 'Tab Mix Plus - Docs',
  social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
  editLink: {
    baseUrl: 'https://github.com/onemen/tabmixplus-docs/edit/main/',
  },
  components: {
    Head: './src/components/Head.astro',
    Sidebar: './src/components/Sidebar.astro',
    SocialIcons: './src/components/SocialIcons.astro',
  },
  sidebar: [
    {
      label: 'Installation',
      link: '/other/installation',
    },
    {
      label: 'Discussions',
      link: 'https://github.com/onemen/TabMixPlus/discussions/',
      attrs: { target: '_blank', 'data-link': 'discussions' },
    },
    {
      label: 'Download',
      link: '/download',
      attrs: { 'data-link': 'download' },
    },
    {
      label: 'Releases / Change Log',
      items: [{ autogenerate: { directory: 'releases', collapsed: true } }],
    },
    {
      label: 'Help',
      items: [{ autogenerate: { directory: 'help' } }],
    },
    {
      label: 'Troubleshooting',
      items: [{ autogenerate: { directory: 'troubleshooting' } }],
    },
  ],
  customCss: ['./src/styles/custom.css'],
  defaultLocale: 'en',
};

const baseUrl = '/tabmixplus-docs';

// https://astro.build/config
export default defineConfig({
  site: process.env.CI ? 'https://onemen.github.io' : 'http://localhost:4321',
  compressHTML: true,
  base: baseUrl,
  integrations: [starlight(starlightConfig)],
  markdown: {
    processor: satteri({
      features: { smartypants: false },
      hastPlugins: [createExternalLinksPlugin(baseUrl)],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
