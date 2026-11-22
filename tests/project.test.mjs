import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chunk, page, srcFiles, text } from './helpers.mjs';

const order = (html, titles) => titles.map((t) => html.indexOf(`>${t}</h2>`));

test('les sections suivent l’ordre de la spec', () => {
	const idx = order(page('/work/seenit/'), [
		'Le projet',
		'Mon rôle',
		'Identité visuelle',
		'Fonctionnalités',
		'Stack technique',
		'En images',
	]);
	assert.ok(
		idx.every((i) => i > 0),
		JSON.stringify(idx),
	);
	assert.deepEqual([...idx].sort((a, b) => a - b), idx);
});

test('le nuancier de Seenit, en français et en anglais', () => {
	const fr = text(page('/work/seenit/'));
	for (const s of [
		'Bois',
		'#2C1C0F',
		'Laiton',
		'#C5A059',
		'Velours',
		'Ivoire',
		'Playfair Display',
		'DM Sans',
		'DM Mono',
		'Mulholland Drive',
		'Vu le 14 novembre',
	]) {
		assert.ok(fr.includes(s), s);
	}
	const en = text(page('/en/work/seenit/'));
	for (const s of ['Visual identity', 'Wood', 'Brass', 'Watched on 14 November']) assert.ok(en.includes(s), s);
});

test('le nuancier de ChronoPotes et ses palettes', () => {
	assert.ok(text(page('/work/chronopotes/')).includes('Cadran'));
	assert.match(page('/work/chronopotes/'), /role="img"[^>]*aria-label="04,96 Masterclass"/);
	assert.match(page('/en/work/chronopotes/'), /aria-label="04\.96 Masterclass"/);
	assert.ok(text(page('/en/work/chronopotes/')).includes('Dial'));
});

test('pas de nuancier pour un projet sans identité', () => {
	assert.ok(!page('/work/bluepoint-waste-identifier/').includes('Identité visuelle'));
});

test('le nuancier dépend du nuancier, pas du cadre', () => {
	const layout = srcFiles(['.astro']).find((f) => f.path.endsWith('layouts/ProjectLayout.astro')).content;
	assert.match(layout, /hasSpecimen\(entry\.data\.identity\)/);
});

test('ni pilules, ni points médians, ni icônes de fonctionnalité', () => {
	for (const slug of ['seenit', 'covoit-etud']) {
		const html = page(`/work/${slug}/`);
		assert.ok(!html.includes('class="pill"'), slug);
		assert.ok(!text(chunk(html, '<main', '</main>')).includes('·'), slug);
	}
});

// Plus aucun projet n'est sans capture : la regle est verifiee dans la mise en
// page, qui n'affiche la couverture que si le projet a une image.
test('pas de couverture vide pour un projet sans capture', () => {
	const layout = srcFiles(['.astro']).find((f) => f.path.endsWith('layouts/ProjectLayout.astro')).content;
	assert.match(layout, /\{entry\.data\.img && <ProjectCover entry=\{entry\} \/>\}/);
});
