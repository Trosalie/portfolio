import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { chunk, page, text } from './helpers.mjs';

// La page « À propos » est masquée tant que son texte n'est pas écrit : ni
// construite, ni dans le menu. Ses routes sont dans src/pages/_about.astro et
// src/pages/en/_about.astro ; retirer le « _ » la remet en ligne.
test('la page À propos est masquée', () => {
	for (const file of ['about/index.html', 'en/about/index.html']) {
		assert.ok(!existsSync(new URL(`../dist/${file}`, import.meta.url)), file);
	}
	for (const route of ['/', '/en/', '/work/', '/en/contact/']) {
		const nav = chunk(page(route), '<nav', '</nav>');
		assert.ok(!/href="(\/en)?\/about\/"/.test(nav), route);
	}
});

test('le formulaire de contact garde son fonctionnement', () => {
	const html = page('/contact/');
	for (const s of ['action="https://formspree.io/f/maqdrkgr"', 'name="_gotcha"', 'name="_next"', 'id="contact-sent"']) {
		assert.ok(html.includes(s), s);
	}
});

test('la 404 renvoie à l’accueil, sans flèche', () => {
	assert.match(page('/404'), /href="\/"[^>]*>\s*Retour à l(&#39;|')accueil\s*</);
	assert.ok(!text(page('/404')).includes('←'));
});
