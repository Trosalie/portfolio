import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { byLevel } from '../src/data/levels.ts';

const entry = (id, level) => ({ id, data: { level } });
const ids = (list) => list.map((e) => e.id);

test('les projets se répartissent sans changer d’ordre', () => {
	const groups = byLevel([entry('a', 'featured'), entry('b', 'university'), entry('c', 'featured')]);
	assert.deepEqual(ids(groups.featured), ['a', 'c']);
	assert.deepEqual(ids(groups.university), ['b']);
	assert.deepEqual(byLevel([]), { featured: [], university: [] });
});

// Le contenu : memes niveaux dans les deux langues, sur les fichiers eux-memes.
test('chaque projet a son niveau, identique en français et en anglais', () => {
	const expected = {
		chronopotes: 'featured',
		seenit: 'featured',
		'bluepoint-waste-identifier': 'featured',
		'projet-chat': 'university',
		boardpxl: 'university',
		'covoit-etud': 'university',
	};
	for (const dir of ['work', 'work-en']) {
		for (const [slug, level] of Object.entries(expected)) {
			const file = readFileSync(new URL(`../src/content/${dir}/${slug}.md`, import.meta.url), 'utf8');
			assert.equal(file.match(/^level: (\w+)\r?$/m)?.[1], level, `${dir}/${slug}`);
		}
	}
});
