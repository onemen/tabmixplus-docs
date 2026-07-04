import { defineHastPlugin } from 'satteri';

export function createExternalLinksPlugin(baseUrl) {
  return defineHastPlugin({
    name: 'external-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (!href) return;

        const normalizedBase = baseUrl.replace(/\/$/, '');

        const isExternal =
          href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');

        if (isExternal) {
          ctx.setProperty(node, 'target', '_blank');
          ctx.setProperty(node, 'rel', 'nofollow');
          return;
        }

        if (!href.startsWith('#')) {
          const prefix = href.startsWith('/') ? '' : '/';
          ctx.setProperty(node, 'href', normalizedBase + prefix + href);
        }
      },
    },
  });
}
