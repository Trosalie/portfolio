import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chunk, page, pageCss, text } from './helpers.mjs';

test('l’en-tête dit ce que fait Thibault', () => {
	assert.equal(
		text(chunk(page('/'), '<h1', '</h1>')),
		"Je conçois et je développe des applications web, de la base de données jusqu'au dernier détail de l'interface.",
	);
	assert.equal(
		text(chunk(page('/en/'), '<h1', '</h1>')),
		'I design and build web applications, from the database to the last detail of the interface.',
	);
});

test('le bouton mène au CV, le lien au contact', () => {
	const hero = chunk(page('/'), '<h1', 'class="tiles"');
	assert.match(hero, /href="\/cv\/"[^>]*>\s*Lire le CV\s*</);
	assert.match(hero, /href="\/contact\/"/);
	assert.match(page('/en/'), /href="\/en\/cv\/"[^>]*>\s*Read my resume\s*</);
});

test('quatre vignettes puis un lien vers tous les projets', () => {
	assert.equal(page('/').match(/class="tile[" ]/g).length, 4);
	assert.match(page('/'), /href="\/work\/"[^>]*>\s*Voir tous les projets\s*</);
});

test('ni compétences, ni portrait, ni salutation', () => {
	const t = text(page('/'));
	for (const gone of ['Compétences', 'Bonjour', 'Back-end', 'Photo de profil']) {
		assert.ok(!t.includes(gone), gone);
	}
	assert.ok(!page('/').includes('alt="Photo de profil'));
});

test('le bloc de contact est une phrase et un lien', () => {
	assert.ok(text(page('/')).includes("Vous recrutez un développeur full stack ? M'écrire"));
	assert.ok(text(page('/en/')).includes('Hiring a full stack developer? Get in touch'));
});

test('le titre de l’accueil se resserre sur téléphone', () => {
	assert.match(pageCss('/'), /h1[^{]*\{[^}]*font-size:\s*1\.75rem/);
});
