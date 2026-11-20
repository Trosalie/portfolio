/**
 * Génère les 2 exemplaires locaux du CV Fullstack :
 * 1. Lyon / Villeurbanne : CV_Thibault_Rosalie_Fullstack_Lyon.pdf
 * 2. Bayonne / BAB : CV_Thibault_Rosalie_Fullstack_Bayonne.pdf
 *
 * Enregistrés en local dans le dossier CV_Candidatures/ (hors déploiement public).
 */

import { createServer } from 'http';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir   = join(__dirname, '..');
const distDir   = join(rootDir, 'dist');
const outDir    = join(rootDir, 'CV_Candidatures');

const TARGETS = [
	{
		label: 'Lyon (Villeurbanne)',
		addressLines: ['197 Avenue Roger Salengro', '69100 Villeurbanne'],
		filename: 'CV_Thibault_Rosalie_Fullstack_Lyon.pdf',
	},
	{
		label: 'Bayonne / BAB',
		addressLines: ['18 Avenue de Sainte-Croix', '64100 Bayonne'],
		filename: 'CV_Thibault_Rosalie_Fullstack_Bayonne.pdf',
	},
];

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.mjs': 'application/javascript',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.ico': 'image/x-icon',
	'.json': 'application/json',
};

function startServer(port) {
	return new Promise((resolve) => {
		const server = createServer((req, res) => {
			let urlPath = req.url.split('?')[0].replace(/\/+/g, '/');
			if (urlPath.endsWith('/')) urlPath += 'index.html';

			let filePath = join(distDir, urlPath);
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

(async () => {
	const PORT = 4174;
	console.log('🚀 Génération des 2 exemplaires de CV Candidatures (Lyon & Bayonne)...');

	if (!existsSync(join(distDir, 'cv-print', 'index.html'))) {
		console.error('❌ Le dossier dist/cv-print est manquant. Lancez d abord : npm run build:fast');
		process.exit(1);
	}

	mkdirSync(outDir, { recursive: true });
	const server = await startServer(PORT);
	console.log(`🌐 Serveur local démarré sur http://127.0.0.1:${PORT}`);

	let browser;
	try {
		browser = await puppeteer.launch({
			headless: true,
			args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
		});

		for (const target of TARGETS) {
			const page = await browser.newPage();
			await page.goto(`http://127.0.0.1:${PORT}/cv-print/`, { waitUntil: 'networkidle0', timeout: 30000 });

			// Injecter l'adresse de la cible
			await page.evaluate((lines) => {
				const el = document.querySelector('.cv-contact-address');
				if (el) el.innerHTML = lines.join('<br />');
			}, target.addressLines);

			// Masquer la barre d'outils et supprimer le padding
			await page.addStyleTag({
				content: '.print-toolbar { display: none !important; } .cv-page-wrapper { padding-top: 0 !important; }',
			});

			const renderedAddress = await page.$eval('.cv-contact-address', (el) => el.innerText);
			console.log(`📍 [${target.label}] Adresse injectée : ${renderedAddress.replace(/\n/g, ', ')}`);

			// Vérifier la hauteur du conteneur CV pour s'assurer qu'il tient sur une seule page A4
			const metrics = await page.evaluate(() => {
				const cvEl = document.querySelector('.cv');
				return {
					heightPx: cvEl ? cvEl.scrollHeight : 0,
					bodyHeight: document.body.scrollHeight,
				};
			});
			console.log(`📏 [${target.label}] Hauteur calculée : ${metrics.heightPx}px (body: ${metrics.bodyHeight}px)`);

			const outPath = join(outDir, target.filename);
			const pdfBuffer = await page.pdf({
				format: 'A4',
				printBackground: true,
				margin: { top: '0', right: '0', bottom: '0', left: '0' },
				preferCSSPageSize: false,
			});

			writeFileSync(outPath, pdfBuffer);
			console.log(`✅ [${target.label}] PDF généré : ${outPath}`);
			await page.close();
		}
	} finally {
		if (browser) await browser.close();
		server.close();
	}

	console.log(`\n🎉 Terminé avec succès ! Les 2 fichiers sont prêts dans : ${outDir}`);
})();
