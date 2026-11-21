import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFiles, page, pageCss } from './helpers.mjs';

// Le violet du thème Astro existait aussi sous la forme hsla(280, 89 %, 67 %, …).
const VIOLETS = /7611a6|c561f6|1c0056|197,\s*97,\s*246|118,\s*17,\s*166|hsla?\(\s*28[01]\b/i;

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

// La barre et le bouton principal de /cv-print/ avaient pris la meme encre :
// « Imprimer / Sauvegarder en PDF » se fondait dans la barre.
test('le bouton d’impression se détache de sa barre', () => {
	const css = pageCss('/cv-print/');
	const background = (selector) =>
		css.match(new RegExp(`${selector}\\s*{[^}]*?background:\\s*([^;}]+)`))?.[1].trim().toLowerCase();
	const bar = background('\\.print-toolbar');
	const button = background('\\.btn-print');
	assert.ok(bar && button, `${bar} / ${button}`);
	assert.notEqual(button, bar);
});

test('les deux boutons du CV existent toujours', () => {
	assert.ok(page('/cv/').includes('href="/assets/pdf/CV_Thibault_Rosalie_FR.pdf"'));
	assert.ok(page('/en/cv/').includes('href="/en/cv-print/"'));
});
