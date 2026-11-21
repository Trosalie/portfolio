import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chunk, page, pageCss, srcFiles, text } from './helpers.mjs';

const tile = (route, slug) => chunk(page(route), `href="${route}${slug}"`);

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

test('un projet sans identité prend le cadre encre', () => {
	assert.match(tile('/work/', 'bluepoint-waste-identifier'), /data-frame="ink"/);
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
