import { defineMiddleware } from 'astro/middleware';

const site = process.env.CI ? 'https://onemen.github.io' : 'http://localhost:4321';
const oldUrl = new URL('/tabmixplus-docs/version_update.html', site);

export const onRequest = defineMiddleware(async ({ url }, next) => {
  if (url.pathname === oldUrl.pathname) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: '/tabmixplus-docs/version_update',
      },
    });
  }
  return next();
});
