import assert from 'node:assert/strict';
import { test } from 'node:test';

import { TARGET_MS, formatFlap, formatGap, rollPlan, tierFor } from '../src/data/chrono.ts';

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
