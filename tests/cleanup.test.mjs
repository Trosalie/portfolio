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

// Une variable lue sans valeur de repli et declaree nulle part rend la regle
// inoperante sans aucune erreur : la liste noire ci-dessus ne voit que les
// jetons qu'elle connait.
test('chaque var() sans repli est déclarée quelque part dans src/', () => {
	const files = srcFiles();
	const declared = new Set();
	for (const { content } of files) {
		for (const m of content.matchAll(/(--[a-z0-9-]+)\s*:/gi)) declared.add(m[1]);
		for (const m of content.matchAll(/['"](--[a-z0-9-]+)['"]\s*:/gi)) declared.add(m[1]);
	}
	for (const { path, content } of files) {
		for (const m of content.matchAll(/var\((--[a-z0-9-]+)\s*\)/gi)) {
			assert.ok(declared.has(m[1]), `${path} : ${m[1]} n'est déclarée nulle part`);
		}
	}
});

test('le bouton encre est défini une seule fois', () => {
	const owners = srcFiles(['.astro', '.css'])
		.filter((f) => /(^|\n)\s*\.button\s*{/.test(f.content))
		.map((f) => f.path);
	assert.deepEqual(owners, ['src/styles/global.css']);
});

test('les pastilles du nuancier restent visibles en contraste élevé', () => {
	const specimen = srcFiles(['.astro']).find((f) => f.path.endsWith('IdentitySpecimen.astro'));
	assert.match(specimen.content, /\.swatch\s*{[^}]*forced-color-adjust:\s*none/);
});
