import { IT_TO_EN, EN_TO_IT, getLocale, normalizePath } from './routes.mjs';

/** @type {Record<import('./routes.mjs').Locale, string>} */
const LOCALE_TAG = {
  it: 'it-IT',
  en: 'en-GB',
};

/**
 * Given a full URL emitted by @astrojs/sitemap, return the `links` array
 * (self + alternate lang) or null when there is no cross-lang counterpart.
 * @param {string} fullUrl
 * @param {string} siteBase
 * @returns {{ url: string; lang: string }[] | null}
 */
export function buildSitemapLinks(fullUrl, siteBase) {
  const base = siteBase.replace(/\/$/, '');
  const rawPath = fullUrl.startsWith(base) ? fullUrl.slice(base.length) : fullUrl;
  const pathname = normalizePath(rawPath);

  const locale = getLocale(pathname);
  const otherPath = locale === 'it' ? IT_TO_EN[pathname] : EN_TO_IT[pathname];
  if (!otherPath) return null;

  const otherLocale = locale === 'it' ? 'en' : 'it';
  const toUrl = (p) => `${base}${p === '/' ? '' : p}`;

  return [
    { url: toUrl(pathname), lang: LOCALE_TAG[locale] },
    { url: toUrl(otherPath), lang: LOCALE_TAG[otherLocale] },
  ];
}
