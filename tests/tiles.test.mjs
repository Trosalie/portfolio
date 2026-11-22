import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chunk, page, pageCss, srcFiles, text } from './helpers.mjs';

const tile = (route, slug) => chunk(page(route), `href="${route}${slug}"`);

const SLUGS = ['chronopotes', 'seenit', 'bluepoint-waste-identifier', 'projet-chat', 'boardpxl', 'covoit-etud'];

/** Rapport de contraste WCAG 2 entre deux couleurs #RRGGBB. */
function contrast(a, b) {
	const luminance = (hex) => {
		const [r, g, bl] = [1, 3, 5]
			.map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
			.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light + 0.05) / (dark + 0.05);
}

/** Le cadre d'une vignette de /work/ et ses trois couleurs. */
const frameOf = (slug) => {
	const html = tile('/work/', slug);
	const style = html.match(/style="([^"]*--frame-bg[^"]*)"/)[1];
	const value = (name) => style.match(new RegExp(`--${name}:\s*([^;]+)`))[1].trim();
	return { html, bg: value('frame-bg'), border: value('frame-border'), title: value('frame-title') };
};

test('la liste a un titre court et pas de phrase d’introduction', () => {
	assert.match(page('/work/'), /<h1[^>]*>\s*Projets\s*<\/h1>/);
	assert.match(page('/en/work/'), /<h1[^>]*>\s*Projects\s*<\/h1>/);
	assert.ok(!text(page('/work/')).includes('Découvrez'));
});

test('ChronoPotes et Seenit dans leur identité', () => {
	const c = tile('/work/', 'chronopotes');
	assert.match(c, /data-frame="identity"/);
	assert.match(c, /--frame-bg:\s*#101216/i);
	assert.match(c, /title--oswald-caps/);
	const s = tile('/work/', 'seenit');
	assert.match(s, /--frame-border:\s*#4D331E/i);
	assert.match(s, /title--playfair-italic/);
});

test('les six projets sont dans leur identité', () => {
	for (const slug of SLUGS) assert.match(tile('/work/', slug), /data-frame="identity"/, slug);
	const sport = frameOf('boardpxl');
	assert.equal(sport.bg.toUpperCase(), '#E8EAF6');
	assert.equal(sport.border.toUpperCase(), '#0A2D44');
	assert.match(sport.html, /title--jost-caps/);
	const covoit = frameOf('covoit-etud');
	assert.equal(covoit.bg.toUpperCase(), '#ABC4FF');
	assert.equal(covoit.title.toUpperCase(), '#31429A');
	assert.doesNotMatch(covoit.html, /\bbordered\b/);
	assert.match(covoit.html, /title--site/);
	const blue = frameOf('bluepoint-waste-identifier');
	assert.equal(blue.bg.toUpperCase(), '#1F1F1F');
	assert.equal(blue.title.toUpperCase(), '#338CD2');
	const chat = frameOf('projet-chat');
	assert.equal(chat.border.toUpperCase(), '#3C3F47');
	assert.match(chat.html, /title--dm-mono/);
});

test('le cadre encre reste le repli d’un projet sans identité', () => {
	const frame = srcFiles(['.astro']).find((f) => f.path.endsWith('work/ProjectFrame.astro')).content;
	assert.match(frame, /'var\(--ink\)'/);
	assert.match(frame, /'identity' : 'ink'/);
});

test('le titre de chaque cadre atteint 4,5:1 sur son fond', () => {
	assert.equal(contrast('#000000', '#FFFFFF').toFixed(1), '21.0');
	assert.ok(contrast('#4357BD', '#ABC4FF') < 4.5);
	for (const slug of SLUGS) {
		const { bg, title } = frameOf(slug);
		assert.ok(contrast(title, bg) >= 4.5, `${slug} : ${contrast(title, bg).toFixed(2)}:1`);
	}
});

test('Jost est servie par le site, pas par Google Fonts', () => {
	assert.match(pageCss('/work/'), /font-family:\s*["']?Jost["']?[^}]*jost-latin-500-normal[^)]*\.woff2/);
});

test('chaque projet a sa couverture', () => {
	const html = page('/work/');
	const slugs = [...html.matchAll(/class="tile[" ][^>]*href="\/work\/([^"]+)"|href="\/work\/([^"]+)"[^>]*class="tile[" ]/g)].map(
		(m) => m[1] ?? m[2],
	);
	assert.equal(slugs.length, 6, slugs.join(', '));
	for (const slug of slugs) assert.ok(tile('/work/', slug).includes('<img'), slug);
});

// Plus aucun projet n'est sans capture : le comportement prevu pour ce cas est
// verifie dans le code. Le titre en grand remplace l'image et reste cache aux
// lecteurs d'ecran, le lien etant deja nomme par l'etiquette.
test('un projet sans capture montrerait son titre en grand, caché aux lecteurs d’écran', () => {
	const frame = srcFiles(['.astro']).find((f) => f.path.endsWith('work/ProjectFrame.astro')).content;
	assert.match(frame, /<span class="frame-name" aria-hidden="true">/);
});

test('l’étiquette suit la convention du cartel', () => {
	const t = text(tile('/work/', 'chronopotes'));
	assert.ok(t.includes('ChronoPotes, 2026'), t);
	assert.ok(t.includes('Projet personnel, en ligne'), t);
	assert.ok(t.includes('React, TypeScript, Supabase, PostgreSQL, PWA'), t);
	assert.ok(!t.includes('·'), t);
});

test('le nom dans le cadre est caché aux lecteurs d’écran', () => {
	assert.match(tile('/work/', 'seenit'), /class="frame-title[^"]*"[^>]*aria-hidden="true"/);
});

test('les liens anglais restent en anglais', () => {
	assert.ok(page('/en/work/').includes('href="/en/work/seenit"'));
});

test('l’étiquette du projet mis en avant se pose au pied de son cadre', () => {
	assert.match(pageCss('/work/'), /\.featured(\[[^\]]*\])?\s*>\s*\.cartel\s*{[^}]*align-self:\s*(end|flex-end)/);
});
