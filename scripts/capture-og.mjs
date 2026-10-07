// Rigenera public/og-image.png — l'anteprima che LinkedIn, WhatsApp, Slack e
// Teams mostrano quando qualcuno condivide un link al sito.
//
//   npm run build && npm run og
//
// ── Perche' esiste ──────────────────────────────────────────────────────────
//
// La card e' uno SCATTO DELL'HERO, non un disegno a parte: mostra il prodotto
// invece di descriverlo, ed e' la scelta giusta per un sito vetrina. Ma fino al
// 2026-10-07 quello scatto si faceva a mano, e un'immagine fatta a mano che
// ritrae una pagina viva scade a ogni ritocco della pagina — in silenzio,
// perche' nessuno va a guardare le anteprime dei propri link. Si e' accorta del
// problema la sostituzione del marchio: la card ne portava ancora uno vecchio.
//
// Qui lo scatto e' un comando. Resta manuale di proposito, fuori dalla build:
// e' un artefatto che cambia qualche volta l'anno e non vale un passo in CI che
// servirebbe un browser a ogni deploy.
//
// ── Come ───────────────────────────────────────────────────────────────────
//
// Si serve dist/ invece di passare dal dev server: la card deve ritrarre quello
// che vedranno i visitatori, non quello che vede chi sviluppa — font gia'
// caricati, immagini ottimizzate, nessun overlay di sviluppo. E si evita di
// litigare con un processo npm da avviare e fermare.
//
// Il Chromium e' quello che Playwright installa per gli E2E del prodotto:
// nessuna dipendenza nuova in questo repo.

import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { dirname, join, extname, normalize } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'public', 'og-image.png');

// 1200x630 e' la misura che tutte le piattaforme ritagliano senza tagliare.
const WIDTH = 1200;
const HEIGHT = 630;

// La pagina si rende su una finestra da portatile e si rimpicciolisce dopo, non
// si rende dentro 1200px. A 1200 di viewport l'hero e' gia' in territorio
// tablet: il titolo cresce rispetto alla colonna e la riga di payoff finisce
// sotto il taglio. Il fattore di scala riporta lo scatto alla misura esatta.
const VIEWPORT = 1512;
const SCALE = WIDTH / VIEWPORT;

// La pagina ritratta. L'italiano e' la lingua predefinita del sito, e la card
// e' una sola per tutte le lingue: le parole le portano og:title e
// og:description, che sono testo vero e tradotto.
const PAGE = process.argv[2] ?? '/';

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8',
};

function findChrome() {
	const base = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright');
	if (!existsSync(base)) return null;
	const dirs = readdirSync(base)
		.filter((d) => d.startsWith('chromium_headless_shell-'))
		.sort()
		.reverse();
	for (const d of dirs) {
		const exe = join(base, d, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
		if (existsSync(exe)) return exe;
	}
	return null;
}

if (!existsSync(DIST)) {
	console.error('dist/ non esiste: lancia prima `npm run build`.');
	process.exit(1);
}
const chrome = findChrome();
if (!chrome) {
	console.error('Chromium di Playwright non trovato.');
	console.error('Si installa dal repo Performa: pwsh tests/e2e/.../playwright.ps1 install');
	process.exit(1);
}

// Server statico minimale. Niente dipendenze: deve solo reggere una pagina e i
// suoi asset, per il tempo di uno scatto.
const server = createServer((req, res) => {
	const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
	// normalize() chiude la risalita con ../ prima che tocchi il filesystem.
	let file = join(DIST, normalize(path).replace(/^(\.\.[/\\])+/, ''));
	if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
	if (!file.startsWith(DIST) || !existsSync(file)) {
		res.writeHead(404).end('not found');
		return;
	}
	res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
	res.end(readFileSync(file));
});

/**
 * Lancia Chromium e aspetta che finisca.
 *
 * Asincrono e non `execFileSync`: il server statico vive in questo stesso
 * processo, e una chiamata sincrona blocca l'event loop — il browser chiede la
 * pagina, nessuno gliela serve, e lo scatto resta appeso finche' non lo uccide
 * il timeout. Sembra un problema del browser e non lo e'.
 */
const run = (args) =>
	new Promise((resolve, reject) => {
		const child = execFile(chrome, args, { timeout: 60_000 }, (err) => (err ? reject(err) : resolve()));
		child.on('error', reject);
	});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const tmp = mkdtempSync(join(tmpdir(), 'performa-og-'));
const shot = join(tmp, 'og.png');
try {
	await run([
		'--disable-gpu',
		'--no-sandbox',
		'--hide-scrollbars',
		// I font arrivano da Google Fonts: senza attesa il titolo esce col
		// fallback di sistema. Il tempo virtuale lascia caricare i font senza
		// legare lo scatto a quanto e' veloce la rete oggi.
		'--virtual-time-budget=8000',
		`--force-device-scale-factor=${SCALE}`,
		`--window-size=${VIEWPORT},${Math.round(HEIGHT / SCALE)}`,
		`--screenshot=${shot}`,
		`http://127.0.0.1:${port}${PAGE}`,
	]);
	writeFileSync(OUT, readFileSync(shot));
	const kb = (statSync(OUT).size / 1024).toFixed(1);
	console.log(`public/og-image.png  <- ${PAGE} @ ${WIDTH}x${HEIGHT}  ${kb} KB`);
	console.log(`Controllala a occhio: ${pathToFileURL(OUT).href}`);
} finally {
	rmSync(tmp, { recursive: true, force: true });
	server.close();
}
