import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { chunk, page, text } from './helpers.mjs';

const COUNTS = {
	chronopotes: 6,
	seenit: 6,
	'bluepoint-waste-identifier': 5,
	boardpxl: 4,
	'covoit-etud': 4,
	'projet-chat': 1,
};
const dialog = (route) => chunk(page(route), '<dialog', '</dialog>');
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

for (const base of ['/work/', '/en/work/']) {
	for (const [slug, count] of Object.entries(COUNTS)) {
		test(`la visionneuse de ${base}${slug}`, () => {
			const html = page(`${base}${slug}/`);
			assert.equal(all(html, /(<dialog)/g).length, 1);
			const d = dialog(`${base}${slug}/`);
			const imgs = all(d, /(<img[^>]*>)/g);
			assert.equal(imgs.length, count);
			assert.match(d.match(/<[^>]*data-stage[^>]*>/)[0], /tabindex="0"/);
			for (const img of imgs) {
				assert.match(img, /loading="lazy"/);
				assert.match(img, /alt="[^"]{20,}"/);
			}
			// Chaque lien ouvre un fichier du site, le meme que la visionneuse.
			const links = all(html, /(<a[^>]*data-viewer-open="\d+"[^>]*>)/g);
			assert.ok(links.length >= count);
			for (const link of links) {
				const href = link.match(/href="([^"]+)"/)[1];
				assert.ok(existsSync(new URL(`../dist${href}`, import.meta.url)), href);
				assert.ok(imgs[Number(link.match(/data-viewer-open="(\d+)"/)[1])].includes(`src="${href}"`), href);
			}
			assert.equal(/data-prev|data-position/.test(d), count > 1);
		});
	}
}

test('la visionneuse prend les couleurs du cadre', () => {
	assert.match(dialog('/work/covoit-etud/'), /--frame-bg:#ABC4FF;[^"]*--frame-title:#31429A/i);
});

test('les libellés, dans les deux langues', () => {
	const fr = dialog('/work/seenit/');
	assert.ok(text(fr).includes('Fermer'));
	assert.ok(text(fr).includes('1 sur 6'));
	assert.match(fr, /data-zoom-label="Agrandir"[^>]*data-fit-label="Voir entière"/);
	const en = dialog('/en/work/seenit/');
	assert.ok(text(en).includes('Close'));
	assert.ok(text(en).includes('1 of 6'));
	assert.match(en, /data-zoom-label="Enlarge"[^>]*data-fit-label="Fit to screen"/);
	assert.ok(text(chunk(page('/work/seenit/'), 'class="cover-link')).endsWith('Agrandir'));
	assert.ok(text(chunk(page('/en/work/seenit/'), 'class="cover-link')).endsWith('Enlarge'));
});

test('la couverture de BluePoint et sa première capture ouvrent la même vue', () => {
	assert.deepEqual(all(page('/work/bluepoint-waste-identifier/'), /<a[^>]*data-viewer-open="(\d+)"/g), [
		'0',
		'0',
		'1',
		'2',
		'3',
		'4',
	]);
});

test('pas de visionneuse ailleurs', () => {
	for (const route of ['/', '/en/', '/work/', '/en/work/', '/contact/', '/cv/']) {
		assert.ok(!page(route).includes('data-viewer'), route);
	}
});
