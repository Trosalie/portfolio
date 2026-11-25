import assert from 'node:assert/strict';
import { test } from 'node:test';

import { TARGET_MS, formatFlap, formatGap, rollPlan, tierFor } from '../src/data/chrono.ts';
import { distFiles, page } from './helpers.mjs';

const NBSP = String.fromCharCode(0xa0);
const MINUS = String.fromCharCode(0x2212);

test('les mentions changent aux bornes du jeu', () => {
	const expected = [
		[0, 'masterclass'],
		[149, 'masterclass'],
		[150, 'good'],
		[500, 'good'],
		[501, 'average'],
		[1000, 'average'],
		[1001, 'missed'],
		[30000, 'missed'],
	];
	for (const [diff, tier] of expected) assert.equal(tierFor(diff), tier, String(diff));
});

test('le temps et l’écart, dans les deux langues', () => {
	assert.equal(formatFlap(5123, 'fr'), '05,12');
	assert.equal(formatFlap(5123, 'en'), '05.12');
	assert.equal(formatFlap(12304, 'fr'), '12,30');
	assert.equal(formatFlap(400, 'fr'), '00,40');
	assert.equal(formatFlap(120000, 'fr'), '99,99');
	assert.equal(formatGap(123, 'fr'), `+0,12${NBSP}s`);
	assert.equal(formatGap(-40, 'en'), `${MINUS}0.04${NBSP}s`);
	assert.equal(formatGap(-4600, 'fr'), `${MINUS}4,60${NBSP}s`);
	assert.equal(formatGap(4, 'fr'), `0,00${NBSP}s`);
	assert.equal(formatGap(-4, 'fr'), `0,00${NBSP}s`);
});

// Un temps affiche 05,00 avec un ecart de -0,01 se contredirait.
test('l’écart affiché est celui des deux temps affichés', () => {
	const hundredths = (value) => Math.round(Number(value.replace(MINUS, '-').replace(NBSP, '').replace('s', '')) * 100);
	for (let ms = 400; ms <= 12000; ms += 1) {
		assert.equal(hundredths(formatGap(ms - TARGET_MS, 'en')), hundredths(formatFlap(ms, 'en')) - 500, String(ms));
	}
});

test('le roulement est celui du jeu', () => {
	const plan = [
		['7', '8', '9', '0'],
		['1', '2', '3', '4', '5'],
		[','],
		['6', '7', '8', '9', '0', '1'],
		['6', '7', '8', '9', '0', '1', '2'],
	];
	assert.deepEqual(rollPlan('05,12'), plan);
	assert.deepEqual(rollPlan('05.12'), plan.map((frames) => (frames[0] === ',' ? ['.'] : frames)));
});

test('la pièce garde son exemple, et le jeu reste caché sans script', () => {
	const routes = { '/work/chronopotes/': '04,96 Masterclass', '/en/work/chronopotes/': '04.96 Masterclass' };
	for (const [route, label] of Object.entries(routes)) {
		const html = page(route);
		const tag = (name) => html.match(new RegExp(`<[a-z]+[^>]*\\sdata-${name}[\\s=>][^>]*>?`))?.[0] ?? '';
		assert.ok(tag('flaps').includes('role="img"') && tag('flaps').includes(`aria-label="${label}"`), tag('flaps'));
		assert.match(tag('play'), /\shidden[\s>]/, route);
		assert.match(tag('chrono'), /role="group"/, route);
		assert.match(tag('chrono'), /aria-label="[^"]+"/, route);
		assert.match(tag('live'), /aria-live="polite"/, route);
	}
});

test('aucune autre page ne porte le jeu ni son script', () => {
	const pages = distFiles(['.html']);
	const players = pages.filter((file) => file.content.includes('data-chrono'));
	assert.deepEqual(players.map((file) => file.path).sort(), [
		'dist/en/work/chronopotes/index.html',
		'dist/work/chronopotes/index.html',
	]);
	for (const file of pages) {
		if (!players.includes(file)) assert.doesNotMatch(file.content, /ChronoFlaps[^"']*\.js/, file.path);
	}
});
