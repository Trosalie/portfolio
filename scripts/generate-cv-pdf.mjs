/**
 * Génère le PDF du CV à partir de la page /cv/ du site compilé.
 * Utilise un serveur HTTP local + Puppeteer pour produire un rendu fidèle.
 *
 * Utilisation :
 *   npm run generate-pdf   →  astro build + génération du PDF
 */

import { createServer } from 'http';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir   = join(__dirname, '..', 'dist');
const outputPdf = join(__dirname, '..', 'public', 'assets', 'pdf', 'CV_Thibault_Rosalie.pdf');

/* ── Types MIME pour le serveur statique ── */
const MIME = {
	'.html'  : 'text/html; charset=utf-8',
	'.css'   : 'text/css',
	'.js'    : 'application/javascript',
	'.mjs'   : 'application/javascript',
	'.svg'   : 'image/svg+xml',
	'.png'   : 'image/png',
	'.jpg'   : 'image/jpeg',
	'.jpeg'  : 'image/jpeg',
	'.webp'  : 'image/webp',
	'.woff'  : 'font/woff',
	'.woff2' : 'font/woff2',
	'.ttf'   : 'font/ttf',
	'.ico'   : 'image/x-icon',
	'.json'  : 'application/json',
};

/* ── Serveur HTTP statique minimal ── */
function startServer(port) {
	return new Promise((resolve) => {
		const server = createServer((req, res) => {
			let urlPath = req.url.split('?')[0];

			// Nettoyer les doubles slashs
			urlPath = urlPath.replace(/\/+/g, '/');

			// Dossier → index.html
			if (urlPath.endsWith('/')) urlPath += 'index.html';

			let filePath = join(distDir, urlPath);

			// Essayer avec index.html si c'est un dossier sans slash
			if (!existsSync(filePath)) {
				const withIndex = join(distDir, urlPath, 'index.html');
				if (existsSync(withIndex)) filePath = withIndex;
			}

			if (existsSync(filePath)) {
				const ext = extname(filePath).toLowerCase();
				res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
				res.end(readFileSync(filePath));
			} else {
				res.writeHead(404);
				res.end('Not found');
			}
		});

		server.listen(port, '127.0.0.1', () => resolve(server));
	});
}

/* ── Principale ── */
(async () => {
	const PORT = 4174;
	console.log('📄 Génération du CV en PDF...');

	// Vérifier que le build existe
	if (!existsSync(join(distDir, 'cv-print', 'index.html'))) {
		console.error('❌ Le dossier dist/ est absent ou la page cv-print n\'existe pas. Lance d\'abord : npm run build');
		process.exit(1);
	}

	// Démarrer le serveur
	const server = await startServer(PORT);
	console.log(`🌐 Serveur local démarré sur http://127.0.0.1:${PORT}`);

	let browser;
	try {
		browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		// Charger la page d'impression (sans header/footer/toolbar du site)
		await page.goto(`http://127.0.0.1:${PORT}/cv-print/`, { waitUntil: 'networkidle0', timeout: 30000 });

		// Injecter le thème sombre si besoin (optionnel – commenter pour thème clair)
		// await page.evaluate(() => document.documentElement.classList.add('theme-dark'));

		// Masquer la toolbar (pas utile dans le PDF)
		await page.addStyleTag({ content: '.print-toolbar { display: none !important; } .cv-page-wrapper { padding-top: 0 !important; }' });

		// Générer le PDF
		const pdfBuffer = await page.pdf({
			format         : 'A4',
			printBackground: true,        // Conserver les couleurs et fonds
			margin         : { top: '0', right: '0', bottom: '0', left: '0' },
			preferCSSPageSize: false,
		});

		writeFileSync(outputPdf, pdfBuffer);
		console.log(`✅ PDF généré : ${outputPdf}`);

	} finally {
		if (browser) await browser.close();
		server.close();
	}
})();
