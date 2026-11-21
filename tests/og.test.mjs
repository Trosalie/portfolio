import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { page } from './helpers.mjs';

const meta = (route, name) => page(route).match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]*)"`))?.[1];
const dist = (file) => fileURLToPath(new URL(`../dist/${file}`, import.meta.url));

// La carte qu'affiche LinkedIn quand on partage un lien du site : l'ancienne
// etait le portrait recadre au niveau de la bouche, la meme dans les deux langues.
test('chaque langue partage sa propre carte', () => {
	for (const [route, file] of [['/', 'og-fr.jpg'], ['/work/seenit/', 'og-fr.jpg'], ['/en/', 'og-en.jpg'], ['/en/cv/', 'og-en.jpg']]) {
		assert.ok(meta(route, 'og:image')?.endsWith(`/${file}`), `${route} : ${meta(route, 'og:image')}`);
		assert.ok(meta(route, 'twitter:image')?.endsWith(`/${file}`), route);
	}
});

test('les cartes font 1200 × 630 et l’ancienne a disparu', async () => {
	for (const file of ['og-fr.jpg', 'og-en.jpg']) {
		const { width, height } = await sharp(dist(file)).metadata();
		assert.deepEqual([width, height], [1200, 630], file);
	}
	assert.ok(!existsSync(dist('og.jpg')));
});

test('la carte est décrite pour ce qu’elle montre', () => {
	assert.equal(meta('/', 'og:image:alt'), 'Thibault Rosalie, développeur full stack, avec ses projets ChronoPotes et Seenit');
	assert.equal(meta('/en/', 'og:image:alt'), 'Thibault Rosalie, full stack developer, with the ChronoPotes and Seenit projects');
});
