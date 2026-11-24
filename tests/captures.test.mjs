import assert from 'node:assert/strict';
import { test } from 'node:test';

import { captureList, captureSizes } from '../src/data/captures.ts';

const img = (src, width = 1440, height = 900) => ({ src, width, height });
const cover = { src: img('a'), alt: 'Couverture' };
const b = { src: img('b'), alt: 'B', caption: 'Légende B' };

test('la couverture, puis la galerie', () => {
	assert.deepEqual(captureList(cover, [b]), [cover, b]);
	assert.deepEqual(captureList(cover, undefined), [cover]);
	assert.deepEqual(captureList(undefined, [b]), [b]);
	assert.deepEqual(captureList(undefined, undefined), []);
});

test('une couverture reprise dans la galerie n’apparaît qu’une fois, avec sa légende', () => {
	const same = { src: img('a'), alt: 'A', caption: 'Légende A' };
	assert.deepEqual(captureList(cover, [b, same]), [same, b]);
});

const sizes = (w, h, image, small) => captureSizes({ width: w, height: h }, image, small);

test('une capture de bureau s’ouvre agrandie sur petit écran, entière sur grand écran', () => {
	assert.deepEqual(sizes(375, 600, img('a'), true), { fit: 375, zoom: 960, canZoom: true, opensZoomed: true });
	assert.deepEqual(sizes(1250, 780, img('a', 1920, 1200), false), {
		fit: 1248,
		zoom: 1920,
		canZoom: true,
		opensZoomed: false,
	});
});

test('téléphone couché ou très petit : au moins 800 px', () => {
	assert.equal(sizes(700, 290, img('a'), true).zoom, 800);
	assert.equal(sizes(320, 330, img('a'), true).zoom, 800);
});

test('une capture de téléphone s’ouvre entière et ne dépasse pas 430 px', () => {
	assert.deepEqual(sizes(343, 600, img('a', 1290, 2796), true), {
		fit: 276,
		zoom: 343,
		canZoom: true,
		opensZoomed: false,
	});
	assert.equal(sizes(1250, 780, img('a', 1290, 2796), false).zoom, 430);
});

test('pas de bascule quand les deux tailles se valent', () => {
	assert.deepEqual(sizes(1800, 1000, img('a'), false), { fit: 1440, zoom: 1440, canZoom: false, opensZoomed: false });
});
