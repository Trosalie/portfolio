/**
 * Outils communs aux tests du site.
 *
 * Les tests lisent la sortie de `npm run build:fast` dans `dist/` : ils
 * verifient ce qu'un visiteur recoit, pas la facon dont les composants sont
 * ecrits. Lancer le build avant `npm test`.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const SRC = join(ROOT, 'src');

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

function filesUnder(dir, exts) {
	return walk(dir)
		.filter((path) => exts.includes(extname(path)))
		.map((path) => ({
			path: relative(ROOT, path).replaceAll('\\', '/'),
			content: readFileSync(path, 'utf8'),
		}));
}

/** HTML d'une route du site construit : '/' -> dist/index.html, '/404' -> dist/404.html. */
export function page(route) {
	const clean = route.replace(/^\/+|\/+$/g, '');
	const file = clean === '404' ? join(DIST, '404.html') : join(DIST, clean, 'index.html');
	if (!existsSync(file)) {
		throw new Error(`Page absente de dist/ pour la route ${route} : ${file}. Lancer npm run build:fast.`);
	}
	return readFileSync(file, 'utf8');
}

const ENTITIES = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': "'",
	'&#x27;': "'",
	'&nbsp;': ' ',
	'&copy;': '©',
};

/**
 * Le texte visible d'un fragment HTML, espaces resserres. Les balises de texte
 * en ligne disparaissent sans laisser d'espace (`<strong>A</strong>, B` se lit
 * « A, B ») ; les autres balises separent leur contenu par une espace.
 */
export function text(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<\/?(strong|em|b|i|small|abbr|time|span)\b[^>]*>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp|copy);/g, (entity) => ENTITIES[entity])
		.replace(/\s+/g, ' ')
		.trim();
}

/** De la premiere occurrence de `start` a la fin de la premiere occurrence de `end` qui suit. */
export function chunk(html, start, end = '</a>') {
	const from = html.indexOf(start);
	if (from === -1) throw new Error(`Fragment introuvable : ${start}`);
	const to = html.indexOf(end, from + start.length);
	return to === -1 ? html.slice(from) : html.slice(from, to + end.length);
}

/** Tous les fichiers de dist/ ayant ces extensions. */
export function distFiles(exts = ['.html', '.css']) {
	return filesUnder(DIST, exts);
}

/** Les styles d'une page : ses <style> et les feuilles /_astro/*.css qu'elle lie. */
export function pageCss(route) {
	const html = page(route);
	const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
	const linked = [...html.matchAll(/<link[^>]+href="(\/_astro\/[^"]+\.css)"/gi)].map((m) =>
		readFileSync(join(DIST, m[1]), 'utf8'),
	);
	return [...inline, ...linked].join('\n');
}

/** Tous les fichiers de src/ ayant ces extensions. */
export function srcFiles(exts = ['.astro', '.css', '.ts']) {
	return filesUnder(SRC, exts);
}
