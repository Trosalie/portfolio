import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { openSite } from './browser.mjs';

let site;
before(async () => {
	site = await openSite();
});
after(() => site?.close());

const WIDTHS = [1440, 1100, 1024, 1023, 900, 820, 800, 799, 375];
const near = (a, b, message, gap = 1) => assert.ok(Math.abs(a - b) <= gap, `${message} : ${a} et ${b}`);

/** Une page a une largeur donnee, refermee quoi qu'il arrive. */
async function at(path, width, run) {
	const page = await site.visit(path, { width, height: 900, mobile: width < 500 });
	try {
		await run(page);
	} finally {
		await page.close();
	}
}

/** Les boites des vignettes d'une liste : cadre, capture, cartel, et la marge sous la capture. */
const tiles = (page, list) =>
	page.$$eval(`${list} > li > a.tile`, (links) =>
		links.map((link) => {
			const box = (el) => {
				const { left, right, top, bottom, width, height } = el.getBoundingClientRect();
				return { left, right, top: top + scrollY, bottom: bottom + scrollY, width, height };
			};
			const frame = link.querySelector('.project-frame');
			const style = getComputedStyle(frame);
			return {
				slug: link.getAttribute('href').split('/').pop(),
				frame: box(frame),
				image: box(frame.querySelector('img')),
				cartel: box(link.querySelector('.cartel')),
				inner: parseFloat(style.paddingBottom) + parseFloat(style.borderBottomWidth),
			};
		}),
	);

const content = (page) =>
	page.$eval('main', (el) => {
		const style = getComputedStyle(el);
		return el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
	});

const overflows = (page) => page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
const same = (values, message) => values.forEach((value) => near(value, values[0], message));

/** Des vignettes sur une meme rangee : cadres egaux, captures et cartels alignes. */
function assertRow(row, message) {
	same(row.map((t) => t.frame.top), `${message}, hauts des cadres`);
	same(row.map((t) => t.frame.height), `${message}, hauteurs des cadres`);
	same(row.map((t) => t.image.bottom + t.inner), `${message}, bas des captures`);
	same(row.map((t) => t.cartel.top), `${message}, hauts des cartels`);
	row.forEach((t) => assert.ok(t.cartel.top >= t.frame.bottom, `${message}, cartel sous le cadre`));
}

function assertBeside(tile, message) {
	assert.ok(tile.cartel.left >= tile.frame.right, `${message}, cartel à droite`);
	near(tile.cartel.bottom, tile.frame.bottom, `${message}, bas alignés`);
	assert.ok(tile.cartel.height <= tile.frame.height, `${message}, cartel pas plus haut que le cadre`);
}

function assertColumn(list, message) {
	list.forEach((t, i) => {
		assert.ok(t.cartel.top >= t.frame.bottom, `${message}, cartel sous le cadre`);
		if (i) assert.ok(t.frame.top >= list[i - 1].cartel.bottom, `${message}, une colonne`);
	});
}

for (const path of ['/work/', '/en/work/']) {
	for (const width of WIDTHS) {
		test(`${path} à ${width} px`, () =>
			at(path, width, async (page) => {
				assert.equal(await overflows(page), false, 'défilement horizontal');

				const wide = await tiles(page, '.tiles--wide');
				assert.equal(wide.length, 3);
				same(wide.map((t) => t.frame.width), 'phares de même largeur');
				wide.forEach((t) => near(t.image.bottom + t.inner, t.frame.bottom, `${t.slug}, cadre étiré`));
				if (width >= 1024) wide.forEach((t) => assertBeside(t, t.slug));
				else {
					assertColumn(wide, 'phares');
					near(wide[0].frame.width, await content(page), 'phare sur toute la largeur');
				}

				const three = await tiles(page, '.tiles--three');
				assert.deepEqual(three.map((t) => t.slug), ['projet-chat', 'boardpxl', 'covoit-etud']);
				if (width >= 800) assertRow(three, 'rangée du BUT');
				else assertColumn(three, 'BUT');
			}));
	}
}

test('à 1440 px, un phare fait 648 px et le BUT est plus loin qu’un phare de l’autre', () =>
	at('/work/', 1440, async (page) => {
		const wide = await tiles(page, '.tiles--wide');
		near(wide[0].frame.width, 648, 'largeur d’un phare');
		const between = wide[1].frame.top - wide[0].frame.bottom;
		const heading = await page.$eval('h2', (el) => el.getBoundingClientRect().top + scrollY);
		assert.ok(heading - wide[2].frame.bottom > between, `${heading - wide[2].frame.bottom} et ${between}`);
	}));

test('texte à 200 % : aucun nom ne déborde de son cadre', () =>
	at('/work/', 820, async (page) => {
		await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
		const titles = await page.$$eval('.frame-title', (els) => els.map((el) => [el.textContent, el.scrollWidth, el.clientWidth]));
		assert.equal(titles.length, 6);
		titles.forEach(([name, scroll, client]) => assert.ok(scroll <= client, `${name} : ${scroll} dans ${client}`));
		assert.equal(await overflows(page), false);
	}));

for (const path of ['/work/', '/']) {
	test(`${path} à 1440 px : des images à la taille de leur place`, () =>
		at(path, 1440, async (page) => {
			const images = await page.$$eval('a.tile img', async (els) =>
				Promise.all(
					els.map(async (img) => {
						img.loading = 'eager';
						await img.decode();
						// `naturalWidth` tient compte de `sizes` : le fichier lui-meme dit sa largeur.
						const file = new Image();
						file.src = img.currentSrc;
						await file.decode();
						return [img.currentSrc, file.naturalWidth, img.getBoundingClientRect().width];
					}),
				),
			);
			assert.ok(images.length >= 3);
			images.forEach(([src, natural, shown]) => {
				const ratio = natural / shown;
				assert.ok(ratio >= 1 && ratio <= 1.7, `${src} : ${natural} px pour ${Math.round(shown)}`);
			});
		}));
}

for (const path of ['/', '/en/']) {
	for (const width of WIDTHS) {
		test(`${path} à ${width} px`, () =>
			at(path, width, async (page) => {
				assert.equal(await overflows(page), false, 'défilement horizontal');
				const pair = await tiles(page, '.tiles--pair');
				assert.deepEqual(pair.map((t) => t.slug), ['chronopotes', 'seenit', 'bluepoint-waste-identifier']);
				same(pair.map((t) => t.frame.width), 'cadres de même largeur');
				if (width < 800) return assertColumn(pair, 'accueil');
				assertRow(pair.slice(0, 2), 'première rangée');
				const last = pair[2];
				assert.ok(last.frame.top >= pair[0].cartel.bottom, 'BluePoint sur sa rangée');
				near(last.frame.left, pair[0].frame.left, 'cadre dans la première colonne');
				near(last.cartel.left, pair[1].frame.left, 'cartel dans la seconde colonne');
				near(last.image.bottom + last.inner, last.frame.bottom, 'cadre étiré');
				assertBeside(last, 'BluePoint');
			}));
	}
}

test('un quatrième phare : deux rangées de deux', () =>
	at('/', 1440, async (page) => {
		await page.$eval('.tiles--pair', (list) => list.append(list.firstElementChild.cloneNode(true)));
		const pair = await tiles(page, '.tiles--pair');
		assert.equal(pair.length, 4);
		same(pair.map((t) => t.frame.width), 'cadres de même largeur');
		assertRow(pair.slice(0, 2), 'première rangée');
		assertRow(pair.slice(2), 'seconde rangée');
	}));
