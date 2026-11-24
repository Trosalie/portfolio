/**
 * Un navigateur sur le site construit, pour les comportements qui ne se lisent
 * pas dans le HTML : clics, clavier, focus, tailles a l'ecran.
 */

import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.webp': 'image/webp',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.woff2': 'font/woff2',
	'.woff': 'font/woff',
};

async function serve(request, response, split) {
	const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
	const file = join(DIST, normalize(path.endsWith('/') ? `${path}index.html` : path));
	try {
		const body = await readFile(file);
		response.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
		if (split && extname(file) === '.html') {
			// Le debut de la page, puis le reste : un reseau lent.
			const cut = body.indexOf('<main');
			response.write(body.subarray(0, cut));
			await new Promise((resolve) => setTimeout(resolve, split));
			response.end(body.subarray(cut));
			return;
		}
		response.end(body);
	} catch {
		response.writeHead(404);
		response.end();
	}
}

/** `args` : des drapeaux Chrome en plus. `split` : delai, en ms, avant le corps de chaque page. */
export async function openSite({ args = [], split = 0 } = {}) {
	// Le navigateur d'abord : s'il ne demarre pas, aucun serveur ne retient le
	// processus. Il refuse son bac a sable sur la CI, comme pour le PDF du CV.
	const browser = await puppeteer.launch({
		args: [...args, ...(process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [])],
	});

	const server = createServer((request, response) => serve(request, response, split));
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
	const url = `http://127.0.0.1:${server.address().port}`;

	return {
		url,
		/** Une page neuve sur `path`. `page.errors` et `page.requested` se remplissent des le depart. */
		async visit(path, { width = 1440, height = 900, mobile = false, js = true } = {}) {
			const page = await browser.newPage();
			page.errors = [];
			page.requested = [];
			page.on('pageerror', (error) => page.errors.push(String(error)));
			page.on('request', (request) => page.requested.push(new URL(request.url()).pathname));
			await page.setJavaScriptEnabled(js);
			await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile });
			await page.goto(url + path, { waitUntil: 'networkidle0' });
			return page;
		},
		async close() {
			await browser.close();
			server.closeAllConnections();
			await new Promise((resolve) => server.close(resolve));
		},
	};
}
