import { normalizePath, getLocale } from './routes.mjs';

/**
 * Labels per breadcrumb hop. Keyed by full path (as normalized by normalizePath).
 * Only paths present here become breadcrumb items — unknown paths are skipped.
 * @type {Record<'it' | 'en', Record<string, string>>}
 */
const LABELS = {
  it: {
    '/': 'Home',
    '/prodotto': 'Prodotto',
    '/activity-based-costing': 'ABC',
    '/settori': 'Settori',
    '/settori/manifattura': 'Manifattura',
    '/settori/ospitalita': 'Ospitalità',
    '/settori/servizi-professionali': 'Servizi professionali',
    '/settori/rsa-sanita': 'RSA e sanità',
    '/confronto': 'Confronto',
    '/chi-siamo': 'Chi siamo',
    '/contatti': 'Contatti',
    '/privacy': 'Privacy',
    '/accessibilita': 'Accessibilità',
  },
  en: {
    '/en': 'Home',
    '/en/product': 'Product',
    '/en/activity-based-costing': 'ABC',
    '/en/sectors': 'Sectors',
    '/en/sectors/manufacturing': 'Manufacturing',
    '/en/sectors/hospitality': 'Hospitality',
    '/en/sectors/professional-services': 'Professional services',
    '/en/compare': 'Compare',
    '/en/about': 'About',
    '/en/contact': 'Contact',
    '/en/privacy': 'Privacy',
    '/en/accessibility': 'Accessibility',
  },
};

/**
 * Build BreadcrumbList JSON-LD for a given pathname.
 * Emits schema only when there is more than 1 hop (skips root pages).
 * @param {string} pathname
 * @param {string} siteBase
 * @returns {object | null}
 */
export function buildBreadcrumbsLd(pathname, siteBase) {
  const p = normalizePath(pathname);
  const locale = getLocale(p);
  const labels = LABELS[locale];

  const rootPath = locale === 'en' ? '/en' : '/';
  const segments = p === rootPath
    ? [rootPath]
    : [rootPath, ...cumulate(p, rootPath)];

  const items = segments
    .map((path, i) => {
      const name = labels[path];
      if (!name) return null;
      const url = `${siteBase.replace(/\/$/, '')}${path === '/' ? '' : path}`;
      return {
        '@type': 'ListItem',
        position: i + 1,
        name,
        item: url,
      };
    })
    .filter(Boolean);

  if (items.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/**
 * Given a nested path like /en/sectors/manufacturing and a root /en,
 * return the accumulated prefixes: ['/en/sectors', '/en/sectors/manufacturing'].
 * @param {string} pathname
 * @param {string} rootPath
 * @returns {string[]}
 */
function cumulate(pathname, rootPath) {
  const rest = rootPath === '/' ? pathname : pathname.slice(rootPath.length);
  if (!rest || rest === '/') return [];
  const parts = rest.split('/').filter(Boolean);
  const acc = [];
  let cur = rootPath === '/' ? '' : rootPath;
  for (const part of parts) {
    cur = `${cur}/${part}`;
    acc.push(cur);
  }
  return acc;
}
