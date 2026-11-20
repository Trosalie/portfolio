import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFiles, page, pageCss } from './helpers.mjs';

const VIOLETS = /7611a6|c561f6|1c0056|197,\s*97,\s*246|118,\s*17,\s*166/i;

test('plus de violet dans le CV, à l’écran comme à l’impression', () => {
	for (const f of distFiles()) assert.ok(!VIOLETS.test(f.content), f.path);
});

test('le CV à l’écran garde Rubik et Public Sans, installées avec le site', () => {
	for (const r of ['/cv/', '/en/cv/']) {
		assert.match(pageCss(r), /@font-face\s*{[^}]*font-family:\s*["']?Rubik/, r);
		assert.match(pageCss(r), /@font-face\s*{[^}]*font-family:\s*["']?Public Sans/, r);
	}
});

// La regle globale `h1 { color: var(--ink) }` ecrivait le nom en encre sur le
// bandeau encre de la page /cv/ : il doit heriter du blanc du bandeau.
test('le nom du CV à l’écran reste lisible sur le bandeau', () => {
	assert.match(pageCss('/cv/'), /\.cv-name(\[[^\]]*\])?\s*{[^}]*color:\s*inherit/);
});

test('les deux boutons du CV existent toujours', () => {
	assert.ok(page('/cv/').includes('href="/assets/pdf/CV_Thibault_Rosalie_FR.pdf"'));
	assert.ok(page('/en/cv/').includes('href="/en/cv-print/"'));
});
