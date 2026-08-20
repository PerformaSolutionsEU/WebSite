import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { buildSitemapLinks } from './src/i18n/sitemap-links.mjs';

const SITE = process.env.PUBLIC_SITE_URL ?? 'https://performa.example';
const BASE = process.env.PUBLIC_BASE || undefined; // undefined = '/' at root

/**
 * Rehype plugin that prefixes internal absolute links (href starting with '/')
 * with the deploy base path, so MDX markdown-style links like [text](/prodotto)
 * resolve correctly under a project-page base like '/WebSite'.
 * External URLs, mailto:, tel:, and hash anchors are left untouched.
 */
function rehypeBasePath() {
  const base = (BASE || '').replace(/\/$/, '');
  if (!base) return () => (tree) => tree; // no-op when no base

  return () => (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a' && node.properties?.href) {
        const href = node.properties.href;
        if (typeof href === 'string'
          && href.startsWith('/')
          && !href.startsWith('//')
          && !href.startsWith(base + '/')) {
          node.properties.href = base + href;
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
  };
}

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  markdown: {
    rehypePlugins: [rehypeBasePath()],
  },
  integrations: [
    mdx({
      rehypePlugins: [rehypeBasePath()],
    }),
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
        // Pass site + base concatenated so buildSitemapLinks produces URLs
        // that correctly include the deploy base path (e.g. /WebSite).
        const siteWithBase = SITE.replace(/\/$/, '') + (BASE ? BASE.replace(/\/$/, '') : '');
        const links = buildSitemapLinks(item.url, siteWithBase);
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
