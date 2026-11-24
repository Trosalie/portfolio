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

/**
 * Ce qui sort de sa place. `body` rogne ce qui depasse : la largeur du document ne
 * dit donc rien, on regarde les boites elles-memes.
 */
const strays = (page) =>
	page.evaluate(() => {
		const width = document.documentElement.clientWidth;
		const out = [];
		for (const el of document.querySelectorAll('main *')) {
			const { left, right } = el.getBoundingClientRect();
			if (left < -1 || right > width + 1) out.push(`${el.className || el.tagName} hors de l'écran (${Math.round(right)})`);
		}
		for (const item of document.querySelectorAll('.tiles > li')) {
			const place = item.getBoundingClientRect();
			for (const el of item.querySelectorAll('a.tile, .project-frame, .cartel, .frame-title, .cartel p')) {
				const box = el.getBoundingClientRect();
				if (box.right > place.right + 1 || el.scrollWidth > el.clientWidth + 1) {
					out.push(`${el.className || el.tagName} hors de sa place : ${el.textContent.trim().slice(0, 20)}`);
				}
			}
		}
		return out;
	});
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
				assert.deepEqual(await strays(page), []);

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

for (const path of ['/work/', '/en/work/', '/', '/en/']) {
	for (const width of [800, 820, 1024]) {
		for (const size of ['160%', '200%']) {
			test(`${path} à ${width} px, texte à ${size} : rien ne sort de sa place`, () =>
				at(path, width, async (page) => {
					await page.evaluate((value) => (document.documentElement.style.fontSize = value), size);
					assert.deepEqual(await strays(page), []);
				}));
		}
	}
}

// Ni floues, ni plus lourdes que necessaire, a chaque largeur et sur un ecran fin.
for (const path of ['/work/', '/']) {
	for (const width of [1440, 1180, 1100, 1024, 1023, 900, 820, 800]) {
		for (const density of [1, 2]) {
			test(`${path} à ${width} px, écran ${density}x : des images à la taille de leur place`, () =>
				at(path, width, async (page) => {
					await page.setViewport({ width, height: 900, deviceScaleFactor: density });
					await page.reload({ waitUntil: 'networkidle0' });
					const images = await page.$$eval('a.tile img', async (els) =>
						Promise.all(
							els.map(async (img) => {
								img.loading = 'eager';
								await img.decode();
								// `naturalWidth` tient compte de `sizes` : le fichier lui-meme dit sa largeur.
								const file = new Image();
								file.src = img.currentSrc;
								await file.decode();
								return [img.currentSrc, file.naturalWidth, img.getBoundingClientRect().width * devicePixelRatio];
							}),
						),
					);
					assert.ok(images.length >= 3);
					images.forEach(([src, natural, needed]) => {
						const ratio = natural / needed;
						assert.ok(ratio >= 0.99 && ratio <= 1.7, `${src} : ${natural} px pour ${Math.round(needed)}`);
					});
				}));
		}
	}
}

for (const path of ['/', '/en/']) {
	for (const width of WIDTHS) {
		test(`${path} à ${width} px`, () =>
			at(path, width, async (page) => {
				assert.deepEqual(await strays(page), []);
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

// Un projet de BUT de plus ou de moins : jamais un trou a cote d'une vignette seule.
for (const count of [1, 4, 7]) {
	test(`${count} projet(s) de BUT : le dernier occupe sa rangée`, () =>
		at('/work/', 1440, async (page) => {
			await page.$eval(
				'.tiles--three',
				(list, total) => {
					const items = [...list.children];
					while (list.children.length < total) list.append(items[list.children.length % items.length].cloneNode(true));
					while (list.children.length > total) list.lastElementChild.remove();
				},
				count,
			);
			assert.deepEqual(await strays(page), []);
			const three = await tiles(page, '.tiles--three');
			assert.equal(three.length, count);
			const last = three.at(-1);
			near(last.frame.width, 352, 'cadre de la largeur d’une colonne');
			near(last.image.bottom + last.inner, last.frame.bottom, 'cadre étiré');
			assertBeside(last, 'dernière');
			for (let i = 0; i + 2 < count - 1; i += 3) assertRow(three.slice(i, i + 3), `rangée ${i / 3 + 1}`);
		}));
}

test('deux projets de BUT : une rangée alignée', () =>
	at('/work/', 1440, async (page) => {
		await page.$eval('.tiles--three', (list) => list.lastElementChild.remove());
		assertRow(await tiles(page, '.tiles--three'), 'rangée');
	}));

/** Retire les regles qui demandent `subgrid`, comme un navigateur qui ne le connait pas. */
const withoutSubgrid = (page) =>
	page.evaluate(() => {
		let removed = 0;
		const prune = (group) => {
			for (let i = group.cssRules.length - 1; i >= 0; i--) {
				const rule = group.cssRules[i];
				if (rule instanceof CSSSupportsRule && rule.conditionText.includes('subgrid')) {
					group.deleteRule(i);
					removed++;
				} else if (rule.cssRules) prune(rule);
			}
		};
		for (const sheet of document.styleSheets) prune(sheet);
		return removed;
	});

for (const [path, list] of [
	['/work/', '.tiles--three'],
	['/', '.tiles--pair'],
]) {
	for (const width of [1440, 820]) {
		test(`${path} à ${width} px sans subgrid : rien ne se chevauche`, () =>
			at(path, width, async (page) => {
				const cartels = (await tiles(page, list)).map((t) => t.cartel.width);
				assert.ok((await withoutSubgrid(page)) > 0, 'aucune règle retirée');
				assert.deepEqual(await strays(page), []);
				const all = await tiles(page, list);
				const row = all.slice(0, list === '.tiles--three' ? 3 : 2);
				same(row.map((t) => t.frame.top), 'hauts des cadres');
				row.forEach((t) => assert.ok(t.cartel.top >= t.frame.bottom, `${t.slug}, cartel sous le cadre`));
				if (list === '.tiles--pair') {
					assertBeside(all[2], 'BluePoint');
					near(all[2].cartel.width, cartels[2], 'le cartel garde la largeur de son texte');
				}
			}));
	}
}

// En texte tres agrandi, un cartel a cote de son cadre ne doit pas le depasser.
for (const [path, list, widths] of [
	['/work/', '.tiles--wide', [1024, 1440]],
	['/en/work/', '.tiles--wide', [1024, 1440]],
	['/', '.tiles--pair', [800, 820, 1024, 1440]],
]) {
	for (const width of widths) {
		for (const size of ['150%', '200%']) {
			test(`${path} à ${width} px, texte à ${size} : aucun cartel plus haut que son cadre à côté`, () =>
				at(path, width, async (page) => {
					await page.evaluate((value) => (document.documentElement.style.fontSize = value), size);
					for (const t of await tiles(page, list)) {
						if (t.cartel.top >= t.frame.bottom) continue;
						assert.ok(t.cartel.height <= t.frame.height + 1, `${t.slug} : ${t.cartel.height} et ${t.frame.height}`);
					}
					assert.deepEqual(await strays(page), []);
				}));
		}
	}
}

test('à l’impression, une vignette ne se coupe pas et un titre reste avec la suite', () =>
	at('/work/', 1440, async (page) => {
		await page.emulateMediaType('print');
		const inside = await page.$$eval('.tiles > li', (els) => els.map((el) => getComputedStyle(el).breakInside));
		assert.deepEqual(inside, Array(6).fill('avoid'));
		assert.equal(await page.$eval('main h2', (el) => getComputedStyle(el).breakAfter), 'avoid');
	}));
