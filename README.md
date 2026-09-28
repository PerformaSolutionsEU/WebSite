# performa-website

Sito vetrina di **Performa** — SaaS di Activity-Based Costing per PMI italiane.

Fonti di verità del progetto (vivono nel repo principale [Performa](../Performa)):

- [`docs/marketing/website-brief.md`](../Performa/docs/marketing/website-brief.md) — brief completo (target, positioning, IA, SEO/GEO, stack, milestone)
- [`docs/marketing/competitor-research.md`](../Performa/docs/marketing/competitor-research.md) — landscape competitor, matrice comparativa, hero raccomandato

## Stack

- **[Astro 7](https://astro.build/)** — SSG puro, HTML pre-renderizzato, isole React opzionali. Richiede Node ≥ 22.12.
- **MDX** per contenuti long-form (pillar SEO, landing settori). Astro 7 renderizza il Markdown con Sätteri;
  qui la pipeline resta su `unified` (`@astrojs/markdown-remark`) perché `astro.config.mjs` usa un plugin rehype.
- **React 19** per componenti interattivi (usato solo se strettamente necessario)
- **SCSS** con design tokens condivisi con l'app Performa
- **Deploy**: GitHub Pages via GitHub Actions

## Dev

```powershell
npm install
npm run dev
```

Il server locale gira su `http://localhost:4321`.

## Build

```powershell
npm run build          # output statico in ./dist
npm run preview        # preview della build locale
npm run check          # type-check + a11y hints via astro check
```

## Marchio

Gli asset di marca **non si disegnano qui**: sono generati dal sistema di marca del repo Performa e copiati. Per aggiornarli, da quel repo:

```powershell
node docs/marketing/brand/install.mjs --dest ..\performa-website\public
```

Copia i vettori più `brand-manifest.json`, che porta larghezza, altezza e rapporto di ogni file: `Brand.astro` legge da lì il rapporto d'aspetto, così non è un numero scritto a mano che invecchia al primo ritocco del marchio.

Tre regole da non violare:

- **Il marchio si monta solo via [`src/components/Brand.astro`](src/components/Brand.astro)**, mai incollando un SVG. Header e footer ne sono i due consumatori.
- **Gli SVG sono pre-colorati.** Un SVG caricato via `<img>` è un documento isolato: non eredita il `color` della pagina, quindi `currentColor` non funziona e il fondo scuro vuole un file suo. Mai `filter` per invertire — appiattisce il marchio.
- **La variante segue la superficie, non il tema.** `variant="auto"` lascia scegliere a `prefers-color-scheme`, giusto dove il fondo cambia col tema (header). Il footer è `slate-900` in entrambi i temi e vuole `variant="dark"` sempre.

La favicon è `app-icon.svg`, il quadrato con il proprio fondo: un marchio trasparente in petrolio non tiene su una barra schede scura.

## Struttura

```
performa-website/
├─ public/
│  ├─ robots.txt        # crawler policy (allow AI: GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
│  ├─ llms.txt          # riassunto per LLM (GEO)
│  ├─ logo*.svg         # generati dal sistema di marca — non modificare a mano
│  ├─ mark*.svg
│  ├─ app-icon.svg      # marchio su quadrato, serve anche da favicon
│  └─ brand-manifest.json
├─ src/
│  ├─ components/       # componenti .astro riutilizzabili
│  ├─ layouts/          # BaseLayout, MarkdownLayout
│  ├─ pages/            # ogni file .astro/.mdx = una route
│  ├─ styles/           # SCSS globale + design tokens
│  └─ env.d.ts
├─ .github/workflows/   # deploy su GitHub Pages
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json
```

## Deploy

Il workflow in `.github/workflows/deploy.yml` builda il sito e pubblica su GitHub Pages a ogni push su `main`.

Setup una volta sola (dopo aver creato il repo GitHub):

1. Settings → Pages → Source = **GitHub Actions**
2. Push su `main`
3. Sito live su `https://<user>.github.io/performa-website/` — poi CNAME quando arriva il dominio.

## Convenzioni

- **Italiano** in tutto il copy (target = mercato IT).
- Nessun buzzword vuoto ("innovativo", "leader", "AI-powered" gratuito).
- Ogni pagina ha titolo, meta description, canonical, structured data (JSON-LD) dove ha senso.
- Immagini con `alt` sempre valorizzato (informativo o vuoto se decorativo).
- Contrasti WCAG 2.1 AA verificati.
