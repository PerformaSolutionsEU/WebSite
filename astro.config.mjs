import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { buildSitemapLinks } from './src/i18n/sitemap-links.mjs';

const SITE = process.env.PUBLIC_SITE_URL ?? 'https://performa.example';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'it',
        locales: {
          it: 'it-IT',
          en: 'en-GB',
        },
      },
      serialize(item) {
        const links = buildSitemapLinks(item.url, SITE);
        return links ? { ...item, links } : item;
      },
    }),
  ],
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  prefetch: {
    defaultStrategy: 'viewport',
  },
});
