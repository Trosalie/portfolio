import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chunk, page, pageCss } from './helpers.mjs';

const slugs = (html) => [...html.matchAll(/<a[^>]*class="tile[^>]*href="[^"]*\/([^"/]+)"/g)].map((m) => m[1]);
const group = (route, name) => chunk(page(route), `class="tiles tiles--${name}`, '</ul>');

for (const [route, title] of [
	['/work/', 'Projets de BUT'],
	['/en/work/', 'University projects'],
]) {
	test(`deux niveaux sur ${route}`, () => {
		assert.deepEqual(slugs(group(route, 'wide')), ['chronopotes', 'seenit', 'bluepoint-waste-identifier']);
		assert.deepEqual(slugs(group(route, 'three')), ['projet-chat', 'boardpxl', 'covoit-etud']);
		assert.match(page(route), new RegExp(`<h2[^>]*>\\s*${title}\\s*</h2>`));
		assert.equal((group(route, 'wide').match(/cartel-desc/g) ?? []).length, 3);
		assert.doesNotMatch(group(route, 'three'), /cartel-desc/);
	});
}

test('les rangées alignées demandent subgrid, sans quoi l’ancienne mise en page reste', () => {
	assert.match(pageCss('/work/'), /@supports\s*\(grid-template-rows:\s*subgrid\)/);
});
