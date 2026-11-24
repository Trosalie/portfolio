import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ui } from '../src/i18n/ui.ts';
import { distFiles } from './helpers.mjs';

// `useTranslations` retombe sur le francais quand une cle manque en anglais :
// sans ce test, un oubli passerait inapercu et la page anglaise afficherait du
// francais.
test('chaque clé existe dans les deux langues', () => {
	assert.deepEqual(Object.keys(ui.en).sort(), Object.keys(ui.fr).sort());
});

// En ligne, une adresse sans barre finale est redirigee : un aller-retour de plus
// a chaque clic sur un projet.
test('aucun lien vers un projet ne passe par une redirection', () => {
	let links = 0;
	for (const { path, content } of distFiles(['.html'])) {
		for (const [, href] of content.matchAll(/href="(\/(?:en\/)?work\/[^"]+)"/g)) {
			assert.match(href, /\/$/, `${path} : ${href}`);
			links++;
		}
	}
	assert.ok(links > 30, String(links));
});
