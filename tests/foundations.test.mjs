import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { distFiles, page, pageCss } from './helpers.mjs';

const ROUTES = ['/', '/en/', '/work/', '/cv/', '/contact/'];

test('aucune police chargée depuis Google', () => {
	for (const f of distFiles(['.html'])) {
		assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(f.content), f.path);
	}
});

test('un seul thème clair', () => {
	for (const f of distFiles()) {
		assert.ok(!f.content.includes('theme-dark'), f.path);
		assert.ok(!f.content.includes('<theme-toggle'), f.path);
	}
	for (const r of ROUTES) assert.match(page(r), /<meta name="color-scheme" content="light"/, r);
});

test('Schibsted Grotesk est la police du site', () => {
	assert.match(pageCss('/'), /@font-face\s*{[^}]*Schibsted Grotesk Variable/);
});

test('les jetons de couleur existent', () => {
	const all = distFiles().map((f) => f.content).join('\n');
	for (const [name, hex] of [
		['wall', 'e6e6e2'],
		['ink', '1c2230'],
		['ink-muted', '555c6b'],
		['rule', 'c8c9c3'],
		['paper', 'fff'],
	]) {
		assert.match(all, new RegExp(`--${name}:\\s*#${hex}`, 'i'), name);
	}
});

test('les fonds et images du modèle ont disparu', () => {
	for (const p of ['assets/backgrounds', 'assets/stock-1.jpg', 'assets/at-work.jpg']) {
		assert.ok(!existsSync(new URL(`../dist/${p}`, import.meta.url)), p);
	}
});
