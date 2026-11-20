import assert from 'node:assert/strict';
import { test } from 'node:test';

import { srcFiles } from './helpers.mjs';

const GONE = [
	/var\(--gray-/,
	/var\(--accent-/,
	/--gradient-/,
	/var\(--shadow-/,
	/--font-brand/,
	/--font-body/,
	/var\(--text-(xs|sm|base|md|lg|xl|\dxl)\)/,
	/--theme-transition/,
	/theme-dark/,
];

test('plus aucun jeton de l’ancien thème dans src/', () => {
	for (const file of srcFiles()) {
		for (const re of GONE) assert.ok(!re.test(file.content), `${file.path} : ${re}`);
	}
});

// Les capitales restent propres au nom ChronoPotes dans son cadre et a sa
// piece d'interface, et au document CV, qui garde sa mise en page.
test('plus d’étiquette en capitales dans le site', () => {
	const allowed = /cv-(print|screen)\.css|ProjectFrame|ChronoFlaps/;
	for (const file of srcFiles().filter((f) => !allowed.test(f.path))) {
		assert.ok(!/text-transform:\s*uppercase/.test(file.content), file.path);
	}
});
