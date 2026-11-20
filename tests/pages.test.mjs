import assert from 'node:assert/strict';
import { test } from 'node:test';

import { page, text } from './helpers.mjs';

test('À propos montre le portrait, la disponibilité et deux liens, sans chantier', () => {
	const html = page('/about/');
	assert.match(html, /<img[^>]*alt="Photo de profil de Thibault ROSALIE"/);
	const t = text(html);
	assert.ok(t.includes("Diplômé d'un BUT Informatique de l'IUT de Bayonne"), t);
	assert.ok(!/construction|🚧/.test(t), t);
	assert.match(html, /href="\/cv\/"[^>]*>\s*Lire le CV/);
	assert.ok(page('/en/about/').includes('href="/en/contact/"'));
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
