import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        group: z.enum(['top', 'links', 'events', 'display', 'mouse', 'menu', 'session']).optional(),
      }),
    }),
  }),
};
