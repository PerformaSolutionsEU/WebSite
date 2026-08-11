/** @typedef {import('./routes.mjs').Locale} Locale */

/** @type {Record<Locale, Record<string, string>>} */
export const UI = {
  it: {
    'html.lang': 'it',
    'og.locale': 'it_IT',
    'skip.link': 'Vai al contenuto',

    'nav.aria': 'Navigazione principale',
    'nav.product': 'Prodotto',
    'nav.abc': "Cos'è l'ABC",
    'nav.sectors': 'Settori',
    'nav.compare': 'Confronto',
    'nav.contact': 'Contattaci',

    'brand.aria': 'Performa — home',

    'lang.switcher.aria': 'Cambia lingua',
    'lang.it': 'Italiano',
    'lang.en': 'English',

    'footer.col.product': 'Prodotto',
    'footer.col.method': 'Metodo',
    'footer.col.contact': 'Contatti',
    'footer.col.legal': 'Trasparenza',
    'footer.link.what': "Cos'è Performa",
    'footer.link.sectors': 'Settori',
    'footer.link.compare': 'Confronto',
    'footer.link.abc': "L'Activity-Based Costing",
    'footer.link.contact': 'Scrivici',
    'footer.link.privacy': 'Privacy policy',
    'footer.link.accessibility': 'Accessibilità',
    'footer.brand.desc':
      'Activity-Based Costing per PMI italiane. Il metodo di Kaplan & Cooper, in un SaaS che il consulente può usare con tutti i suoi clienti.',
    'footer.copyright': 'Tutti i diritti riservati.',

    'seo.default.description': 'SaaS di Activity-Based Costing per PMI italiane',
    'seo.org.description': 'SaaS di Activity-Based Costing per PMI italiane',
  },
  en: {
    'html.lang': 'en',
    'og.locale': 'en_GB',
    'skip.link': 'Skip to content',

    'nav.aria': 'Main navigation',
    'nav.product': 'Product',
    'nav.abc': 'What is ABC',
    'nav.sectors': 'Sectors',
    'nav.compare': 'Compare',
    'nav.contact': 'Contact us',

    'brand.aria': 'Performa — home',

    'lang.switcher.aria': 'Change language',
    'lang.it': 'Italiano',
    'lang.en': 'English',

    'footer.col.product': 'Product',
    'footer.col.method': 'Method',
    'footer.col.contact': 'Contact',
    'footer.col.legal': 'Legal',
    'footer.link.what': 'What is Performa',
    'footer.link.sectors': 'Sectors',
    'footer.link.compare': 'Compare',
    'footer.link.abc': 'Activity-Based Costing',
    'footer.link.contact': 'Write to us',
    'footer.link.privacy': 'Privacy policy',
    'footer.link.accessibility': 'Accessibility',
    'footer.brand.desc':
      "Activity-Based Costing SaaS. Kaplan & Cooper's method in a tool the advisor can use across every client.",
    'footer.copyright': 'All rights reserved.',

    'seo.default.description': 'Activity-Based Costing SaaS for European SMEs',
    'seo.org.description': 'Activity-Based Costing SaaS for European SMEs',
  },
};

/**
 * Read a UI string for the given locale. Falls back to IT, then to the key itself.
 * @param {Locale} locale
 * @param {string} key
 * @returns {string}
 */
export function t(locale, key) {
  return UI[locale]?.[key] ?? UI.it[key] ?? key;
}
