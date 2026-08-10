# performa-website

Sito vetrina di **Performa** — SaaS di Activity-Based Costing per PMI italiane.

Fonti di verità del progetto (vivono nel repo principale [Performa](../Performa)):

- [`docs/marketing/website-brief.md`](../Performa/docs/marketing/website-brief.md) — brief completo (target, positioning, IA, SEO/GEO, stack, milestone)
- [`docs/marketing/competitor-research.md`](../Performa/docs/marketing/competitor-research.md) — landscape competitor, matrice comparativa, hero raccomandato

## Stack

- **[Astro 5](https://astro.build/)** — SSG puro, HTML pre-renderizzato, isole React opzionali
- **MDX** per contenuti long-form (pillar SEO, landing settori)
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

## Struttura

```
performa-website/
├─ public/
│  ├─ robots.txt        # crawler policy (allow AI: GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
│  ├─ llms.txt          # riassunto per LLM (GEO)
│  └─ favicon.svg
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
