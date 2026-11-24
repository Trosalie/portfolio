import assert from 'node:assert/strict';
import { test } from 'node:test';

import { frameStyle, hasSpecimen, identityGaps, isPartialSpecimen } from '../src/data/identity.ts';

const base = {
	frame: { background: '#101216', titleColor: '#F5C518', titleStyle: 'oswald-caps' },
	palette: [
		{ name: 'Nuit', hex: '#101216' },
		{ name: 'Signal', hex: '#F5C518' },
		{ name: 'Palette', hex: '#20242C' },
		{ name: 'Cadran', hex: '#F4F1E8' },
	],
	fonts: [
		{ family: 'Oswald', role: 'Textes' },
		{ family: 'Space Mono', role: 'Chiffres' },
	],
	specimen: 'chronopotes-flaps',
};

test('deux identités identiques, ou deux absentes : aucun écart', () => {
	assert.deepEqual(identityGaps(base, structuredClone(base)), []);
	assert.deepEqual(identityGaps(undefined, undefined), []);
});

test('les noms et rôles traduits ne sont pas des écarts', () => {
	const en = structuredClone(base);
	en.palette[0].name = 'Night';
	en.fonts[0].role = 'Text';
	assert.deepEqual(identityGaps(base, en), []);
});

test('la casse des codes couleur est ignorée', () => {
	const en = structuredClone(base);
	en.palette[1].hex = '#f5c518';
	assert.deepEqual(identityGaps(base, en), []);
});

test('identité dans une seule langue', () => {
	assert.deepEqual(identityGaps(base, undefined), ['identité visuelle présente dans une seule langue']);
	assert.deepEqual(identityGaps(undefined, base), ['identité visuelle présente dans une seule langue']);
});

test('couleur différente', () => {
	const en = structuredClone(base);
	en.palette[1].hex = '#F5C519';
	assert.deepEqual(identityGaps(base, en), ['couleur 2 : #F5C518 en français contre #F5C519 en anglais']);
});

test('nombre de couleurs différent', () => {
	const en = structuredClone(base);
	en.palette.pop();
	assert.deepEqual(identityGaps(base, en), ['4 couleur(s) en français contre 3 en anglais']);
});

test('cadre, polices ou pièce différents', () => {
	const a = structuredClone(base);
	a.frame.titleColor = '#FFFFFF';
	assert.deepEqual(identityGaps(base, a), ['cadre différent']);
	const b = structuredClone(base);
	b.fonts[0].family = 'DM Sans';
	assert.deepEqual(identityGaps(base, b), ['polices différentes']);
	const c = structuredClone(base);
	c.specimen = 'seenit-ticket';
	assert.deepEqual(identityGaps(base, c), ["pièce d'interface différente"]);
});

const frameOnly = { frame: { background: '#1F1F1F', titleColor: '#338CD2', titleStyle: 'site' } };

test('un cadre seul, identique dans les deux langues : aucun écart', () => {
	assert.deepEqual(identityGaps(frameOnly, structuredClone(frameOnly)), []);
});

test('un cadre seul qui diffère entre les langues', () => {
	const en = structuredClone(frameOnly);
	en.frame.titleColor = '#338CD3';
	assert.deepEqual(identityGaps(frameOnly, en), ['cadre différent']);
});

test('un nuancier dans une seule langue', () => {
	const fr = { ...structuredClone(base), frame: structuredClone(frameOnly.frame) };
	assert.deepEqual(identityGaps(fr, frameOnly), ['nuancier présent dans une seule langue']);
	assert.deepEqual(identityGaps(frameOnly, fr), ['nuancier présent dans une seule langue']);
});

test('le nuancier est entier ou absent', () => {
	assert.equal(hasSpecimen(base), true);
	assert.equal(hasSpecimen(frameOnly), false);
	assert.equal(hasSpecimen(undefined), false);
	assert.equal(isPartialSpecimen(base), false);
	assert.equal(isPartialSpecimen(frameOnly), false);
	const { specimen, ...partial } = base;
	assert.equal(isPartialSpecimen(partial), true);
});

test('les couleurs du cadre, et le repli encre', () => {
	assert.equal(
		frameStyle({ ...frameOnly.frame, border: '#FFFFFF' }),
		'--frame-bg:#1F1F1F;--frame-border:#FFFFFF;--frame-title:#338CD2',
	);
	assert.equal(frameStyle(frameOnly.frame), '--frame-bg:#1F1F1F;--frame-border:#1F1F1F;--frame-title:#338CD2');
	assert.equal(frameStyle(undefined), '--frame-bg:var(--ink);--frame-border:var(--ink);--frame-title:#FFFFFF');
});
