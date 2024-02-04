import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

const linksStyle = 'font-size: var(--sl-text-sm); font-weight: 600;';

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
          items: [
            {
              label: 'Introduction',
              link: 'help/introduction',
              attrs: { style: linksStyle },
            },
            {
              label: 'Preferences - Restore, Import & Export',
              link: 'help/preferences-button',
              attrs: { style: 'font-size: 13px;' },
            },
            {
              label: 'Links',
              link: 'help/links',
              attrs: { style: linksStyle },
            },
            {
              label: 'Links - file type editor',
              link: 'help/links#file-type-editor',
              attrs: { style: 'margin-left: 12px; font-size: 13px;' },
            },
            {
              label: 'Events',
              autogenerate: {
                directory: 'help/events',
              },
            },
            {
              label: 'Display',
              autogenerate: {
                directory: 'help/display',
              },
            },
            {
              label: 'Mouse',
              autogenerate: {
                directory: 'help/mouse',
              },
            },
            {
              label: 'Menu',
              autogenerate: {
                directory: 'help/menu',
              },
            },
            {
              label: 'Session',
              link: 'help/session-startexit',
              attrs: { style: linksStyle },
              badge: { text: 'Not Implemented', variant: 'danger' },
            },
          ],
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
