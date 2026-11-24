import assert from 'node:assert/strict';
import { test } from 'node:test';

import { page, pageCss } from './helpers.mjs';

const ROUTES = ['/', '/work/', '/work/seenit/', '/en/work/', '/contact/'];

test('les transitions respectent le mouvement réduit', () => {
	for (const route of ROUTES) {
		const css = pageCss(route);
		const rules = css.match(/@view-transition/g) ?? [];
		const guarded = css.match(/@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{\s*@view-transition\s*\{\s*navigation:\s*auto;?\s*\}/g) ?? [];
		assert.equal(rules.length, 1, route);
		assert.equal(guarded.length, 1, route);
	}
});

test('le script est dans l’en-tête, classique et court', () => {
	for (const route of ROUTES) {
		const head = page(route).split('</head>')[0];
		const scripts = [...head.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => m[2].includes('pagereveal'));
		assert.equal(scripts.length, 1, route);
		assert.doesNotMatch(scripts[0][1], /module|defer|async|src/);
		assert.ok(scripts[0][2].length < 3500, String(scripts[0][2].length));
	}
});

test('la page d’impression du CV n’a pas de transition', () => {
	assert.doesNotMatch(page('/cv-print/'), /pagereveal|@view-transition/);
});
