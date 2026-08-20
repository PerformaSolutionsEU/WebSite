/** @typedef {'it' | 'en'} Locale */

export const LOCALES = /** @type {const} */ (['it', 'en']);
export const DEFAULT_LOCALE = 'it';

/**
 * IT → EN slug map. Add pages here as they get translated.
 * `null` means the IT page has no EN counterpart by design
 * (see docs/marketing/website-brief.md for rationale).
 * @type {Record<string, string | null>}
 */
export const IT_TO_EN = {
  '/': '/en',
  '/prodotto': '/en/product',
  '/activity-based-costing': '/en/activity-based-costing',
  '/chi-siamo': '/en/about',
  '/settori': '/en/sectors',
  '/settori/manifattura': '/en/sectors/manufacturing',
  '/settori/ospitalita': '/en/sectors/hospitality',
  '/settori/servizi-professionali': '/en/sectors/professional-services',
  '/settori/rsa-sanita': null,
  '/confronto': '/en/compare',
  '/contatti': '/en/contact',
  '/privacy': '/en/privacy',
  '/accessibilita': '/en/accessibility',
};

export const EN_TO_IT = /** @type {Record<string, string>} */ (
  Object.fromEntries(
    Object.entries(IT_TO_EN)
      .filter(([, en]) => en !== null)
      .map(([it, en]) => [/** @type {string} */ (en), it])
  )
);

/**
 * Base path from build env, used to strip the prefix out of pathnames before
 * routing lookups (so i18n maps keep working with `/prodotto` keys even when
 * Astro.url.pathname includes `/WebSite/prodotto`).
 */
const BASE_STRIP = ((typeof process !== 'undefined' && process.env.PUBLIC_BASE) || '').replace(/\/$/, '');

/**
 * Normalize a pathname: strip trailing slash, strip base prefix if present,
 * keep leading slash, "/" for root.
 * @param {string} pathname
 * @returns {string}
 */
export function normalizePath(pathname) {
  if (!pathname) return '/';
  let trimmed = pathname.replace(/\/+$/, '');
  if (BASE_STRIP && (trimmed === BASE_STRIP || trimmed.startsWith(BASE_STRIP + '/'))) {
    trimmed = trimmed.slice(BASE_STRIP.length);
  }
  return trimmed === '' ? '/' : trimmed;
}

/**
 * Infer the locale from a pathname. `/en` and everything below is EN, else IT.
 * @param {string} pathname
 * @returns {Locale}
 */
export function getLocale(pathname) {
  const p = normalizePath(pathname);
  return p === '/en' || p.startsWith('/en/') ? 'en' : 'it';
}

/**
 * Given a pathname in one locale, return the equivalent pathname in the target
 * locale, or null if no counterpart exists (page not translated).
 * If current locale === target, returns the normalized input.
 * @param {string} pathname
 * @param {Locale} target
 * @returns {string | null}
 */
export function getAlternatePath(pathname, target) {
  const p = normalizePath(pathname);
  const current = getLocale(p);
  if (current === target) return p;
  if (current === 'it' && target === 'en') return IT_TO_EN[p] ?? null;
  if (current === 'en' && target === 'it') return EN_TO_IT[p] ?? null;
  return null;
}

/**
 * Base path detected from build env (empty in dev, `/WebSite` in prod on GitHub Pages
 * project page). Read once at module load; safe for SSG.
 */
const BASE = (typeof process !== 'undefined' && process.env.PUBLIC_BASE) || '';

/**
 * Prepend the deploy base path to an absolute internal path.
 * Handles trailing/leading slash normalization. Leaves external URLs untouched.
 * @param {string} path
 * @returns {string}
 */
export function withBase(path) {
  if (!path) return path;
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;
  const cleanBase = BASE.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return cleanBase + cleanPath;
}
