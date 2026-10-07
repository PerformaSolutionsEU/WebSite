# performa-website

Sito vetrina di **Performa** — SaaS di Activity-Based Costing per PMI italiane.

Fonti di verità del progetto (vivono nel repo principale [Performa](../Performa)):

- [`docs/marketing/website-brief.md`](../Performa/docs/marketing/website-brief.md) — brief completo (target, positioning, IA, SEO/GEO, stack, milestone)
- [`docs/marketing/competitor-research.md`](../Performa/docs/marketing/competitor-research.md) — landscape competitor, matrice comparativa, hero raccomandato

## Stack

- **[Astro 7](https://astro.build/)** — SSG puro, HTML pre-renderizzato. Richiede Node ≥ 22.12.
- **MDX** per contenuti long-form (pillar SEO, landing settori). Astro 7 renderizza il Markdown con Sätteri;
  qui la pipeline resta su `unified` (`@astrojs/markdown-remark`) perché `astro.config.mjs` usa un plugin rehype.
- **Nessun framework UI.** Il sito è HTML e CSS statici: non ci sono isole idratate.
  Se una pagina avrà bisogno di interattività vera, `npx astro add react` rimette l'integrazione in un minuto.
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

## CI

`.github/workflows/ci.yml` gira su ogni pull request e su ogni push a `dev`:
`npm run check`, build, e link check sull'output servito. `npm run check` è
bloccante ed è verde — se torna rosso, è una regressione, non rumore di fondo.

`.github/workflows/deploy.yml` gira **solo su `main`**: il merge su `main` è la
pubblicazione. Le variabili `PUBLIC_SITE_URL` e `PUBLIC_BASE` sono repo Variables;
i default nel workflow descrivono la produzione (dominio custom, base `/`), così
se le variabili sparissero il build resterebbe corretto.

## Marchio

Gli asset di marca **non si disegnano qui**: sono generati dal sistema di marca del repo Performa e copiati. Per aggiornarli, da quel repo:

```powershell
node docs/marketing/brand/install.mjs --dest ..\performa-website\public
```

Copia gli SVG, le icone raster e `brand-manifest.json`, che porta misure e soglie: `Brand.astro` legge da lì sia i rapporti d'aspetto sia la soglia del master piccolo, così non sono numeri scritti a mano che invecchiano al primo ritocco del marchio.

Cinque regole da non violare:

- **Il marchio si monta solo via [`src/components/Brand.astro`](src/components/Brand.astro)**, mai incollando un SVG. Header e footer ne sono i due consumatori.
- **Gli SVG sono pre-colorati.** Un SVG caricato via `<img>` è un documento isolato: non eredita il `color` della pagina, quindi `currentColor` non funziona e il fondo scuro vuole un file suo. Mai `filter` per invertire — appiattisce il marchio.
- **La variante segue la superficie, non il tema.** `variant="auto"` lascia scegliere a `prefers-color-scheme`, giusto dove il fondo cambia col tema (header). Il footer è `slate-900` in entrambi i temi e vuole `variant="dark"` sempre.
- **Chiaro e scuro non hanno lo stesso rapporto.** Dal marchio depositato il 2026-10-07 il simbolo è un'illustrazione cromata che sui fondi scuri sta dentro una tile quadrata, mentre nudo è più largo che alto. Ogni variante porta il rapporto del file che monta davvero, anche sulle `<source>`: leggerne uno solo renderebbe il lockup scuro un quinto più alto di quello chiaro, con un salto visibile al cambio di tema.
- **Gli SVG incorporano un raster e non si scalano all'infinito.** Oltre i 256px di altezza del simbolo serve un master più grande da `prepare-master.mjs`, nel repo Performa. Sotto la soglia del manifest si monta il master piccolo, che lascia fuori i quadratini della dissolvenza e pesa un terzo: header e footer ci stanno entrambi sotto.

La favicon è `favicon.ico` (16/32/48) più `logo192.png` per `apple-touch-icon`, generati dal sistema di marca e copiati con tutto il resto. **Niente favicon SVG**: da quando il simbolo è raster, un SVG che lo incorpora ha gli stessi pixel di un PNG con un terzo di peso in più, e la scaricherebbe ogni pagina.

### Anteprima Open Graph

```
npm run build && npm run og
```

`og-image.png` è uno **scatto dell'hero**, non un disegno a parte. Si rigenera con [`scripts/capture-og.mjs`](scripts/capture-og.mjs), che serve `dist/` e lo fotografa col Chromium di Playwright. Va rilanciato quando cambia l'hero o il marchio: finché si faceva a mano, quell'immagine scadeva in silenzio — nessuno va a guardare le anteprime dei propri link.

## Struttura

```
performa-website/
├─ public/
│  ├─ robots.txt        # crawler policy (allow AI: GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
│  ├─ llms.txt          # riassunto per LLM (GEO)
│  ├─ logo*.svg         # generati dal sistema di marca — non modificare a mano
│  ├─ mark*.svg
│  ├─ favicon.ico       # 16/32/48, generata dal sistema di marca
│  ├─ logo192/512.png   # apple-touch-icon e icone grandi
│  ├─ og-image.png      # scatto dell'hero — si rigenera con `npm run og`
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
