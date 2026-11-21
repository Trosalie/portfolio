import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chunk, page, text } from './helpers.mjs';

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

test('ni pilules, ni points médians, ni icônes de fonctionnalité', () => {
	for (const slug of ['seenit', 'covoit-etud']) {
		const html = page(`/work/${slug}/`);
		assert.ok(!html.includes('class="pill"'), slug);
		assert.ok(!text(chunk(html, '<main', '</main>')).includes('·'), slug);
	}
});

test('pas de couverture vide pour un projet sans capture', () => {
	assert.ok(!page('/work/projet-chat/').includes('data-frame='));
});
