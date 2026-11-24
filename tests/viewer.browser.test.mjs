import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { openSite } from './browser.mjs';

let site;
before(async () => {
	site = await openSite();
});
after(() => site?.close());

const PROJECTS = ['chronopotes', 'seenit', 'bluepoint-waste-identifier', 'boardpxl', 'covoit-etud', 'projet-chat'];
const PHONE = { width: 375, height: 812, mobile: true };

/** Un test sur une page neuve, refermee quoi qu'il arrive. */
function onPage(name, path, options, run) {
	test(name, async () => {
		const page = await site.visit(path, options);
		try {
			await run(page);
			assert.deepEqual(page.errors, []);
		} finally {
			await page.close();
		}
	});
}

/** Laisse passer deux images : l'observateur de taille a alors tourne. */
const settle = (page) =>
	page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

const state = async (page) => {
	await settle(page);
	return page.evaluate(() => {
		const dialog = document.querySelector('dialog');
		const image = dialog.querySelector('dialog [data-capture]:not([hidden]) img');
		const stage = dialog.querySelector('dialog [data-stage]');
		return {
			open: dialog.open,
			index: Number(dialog.dataset.index),
			size: dialog.dataset.size,
			width: Math.round(image.getBoundingClientRect().width),
			scrollLeft: stage.scrollLeft,
			scrollTop: stage.scrollTop,
			toggle: dialog.querySelector('dialog [data-toggle]').textContent.trim(),
		};
	});
};

const focus = (page) =>
	page.evaluate(() => {
		const el = document.activeElement;
		return el.className.split(' ')[0] || Object.keys(el.dataset)[0] || el.tagName;
	});

const focusedData = (page) => page.evaluate(() => Object.keys(document.activeElement.dataset));

/** Le clic ou le doigt, selon l'appareil. */
async function openCover(page) {
	await page.click('.cover-link');
	const s = await state(page);
	assert.equal(s.open, true, 'la visionneuse devrait être ouverte');
	return s;
}

const inScreen = (page, selector) =>
	page.evaluate((sel) => {
		const r = document.querySelector(sel).getBoundingClientRect();
		return r.width > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
	}, selector);

onPage('ouvre depuis la couverture, focus sur Fermer', '/work/seenit/', {}, async (page) => {
	const s = await openCover(page);
	assert.equal(s.index, 0);
	assert.equal(s.size, 'fit');
	assert.ok((await focusedData(page)).includes('close'));
});

onPage('rien n’est téléchargé en grand avant l’ouverture', '/work/seenit/', {}, async (page) => {
	const hrefs = await page.$$eval('a[data-viewer-open]', (links) => links.map((a) => new URL(a.href).pathname));
	const loaded = () => [...new Set(page.requested.filter((path) => hrefs.includes(path)))];
	assert.deepEqual(loaded(), []);
	await openCover(page);
	await page.waitForNetworkIdle();
	assert.deepEqual(loaded(), [hrefs[0]]);
});

for (const slug of PROJECTS) {
	onPage(`téléphone : la couverture de ${slug} s’ouvre lisible`, `/work/${slug}/`, PHONE, async (page) => {
		const s = await openCover(page);
		assert.equal(s.size, 'zoom');
		assert.ok(s.width >= 800, String(s.width));
		assert.equal(s.scrollLeft, 0);
	});
}

onPage('téléphone couché : au moins 800 px', '/work/boardpxl/', { width: 812, height: 375, mobile: true }, async (page) => {
	const s = await openCover(page);
	assert.ok(s.width >= 800, String(s.width));
});

onPage('téléphone : une capture de téléphone s’ouvre entière', '/work/chronopotes/', PHONE, async (page) => {
	await openCover(page);
	await page.click('dialog [data-next]');
	const s = await state(page);
	assert.equal(s.index, 1);
	assert.equal(s.size, 'fit');
	assert.ok(s.width <= 375, String(s.width));
});

onPage('bascule par l’image et par le bouton', '/work/seenit/', {}, async (page) => {
	await openCover(page);
	assert.equal((await state(page)).toggle, 'Agrandir');
	await page.click('dialog [data-capture]:not([hidden]) img');
	let s = await state(page);
	assert.deepEqual([s.size, s.width, s.toggle], ['zoom', 1920, 'Voir entière']);
	await page.click('dialog [data-toggle]');
	s = await state(page);
	assert.equal(s.size, 'fit');
	assert.equal(s.toggle, 'Agrandir');
	assert.ok(s.width < 1440, String(s.width));
});

onPage('l’endroit touché reste à l’écran', '/work/seenit/', {}, async (page) => {
	await openCover(page);
	const box = await (await page.$('dialog [data-capture]:not([hidden]) img')).boundingBox();
	await page.mouse.click(box.x + box.width * 0.8, box.y + box.height * 0.7);
	await settle(page);
	const visible = await page.evaluate(() => {
		const image = document.querySelector('dialog [data-capture]:not([hidden]) img').getBoundingClientRect();
		const stage = document.querySelector('dialog [data-stage]').getBoundingClientRect();
		const x = image.left + image.width * 0.8;
		const y = image.top + image.height * 0.7;
		return x > stage.left && x < stage.right && y > stage.top && y < stage.bottom;
	});
	assert.equal(visible, true);
});

onPage('flèches du clavier : changer de capture, ou défiler', '/work/seenit/', {}, async (page) => {
	await openCover(page);
	await page.keyboard.press('ArrowRight');
	assert.equal((await state(page)).index, 1);
	assert.equal(await page.$eval('dialog [data-live-region]', (el) => el.textContent), 'Capture 2 sur 6');
	assert.equal(await page.$eval('dialog [data-position]', (el) => el.textContent.trim()), '2 sur 6');
	await page.keyboard.down('Alt');
	await page.keyboard.press('ArrowRight');
	await page.keyboard.up('Alt');
	assert.equal((await state(page)).index, 1);
	await page.click('dialog [data-toggle]');
	await page.keyboard.press('ArrowRight');
	const s = await state(page);
	assert.equal(s.index, 1);
	assert.ok(s.scrollLeft > 0);
});

onPage('aux extrémités, le bouton est indisponible et garde le focus', '/work/seenit/', {}, async (page) => {
	await openCover(page);
	await page.focus('dialog [data-prev]');
	assert.equal(await page.$eval('dialog [data-prev]', (el) => el.getAttribute('aria-disabled')), 'true');
	await page.keyboard.press('Enter');
	assert.equal((await state(page)).index, 0);
	assert.ok((await focusedData(page)).includes('prev'));
	for (let i = 0; i < 8; i++) await page.click('dialog [data-next]');
	assert.equal((await state(page)).index, 5);
	assert.equal(await page.$eval('dialog [data-next]', (el) => el.getAttribute('aria-disabled')), 'true');
	assert.equal(await page.$eval('dialog [data-prev]', (el) => el.getAttribute('aria-disabled')), 'false');
});

onPage('changer de capture repart de la taille d’ouverture', '/work/seenit/', {}, async (page) => {
	await openCover(page);
	await page.click('dialog [data-toggle]');
	await page.$eval('dialog [data-stage]', (el) => el.scrollTo(200, 200));
	await page.click('dialog [data-next]');
	const s = await state(page);
	assert.deepEqual([s.index, s.size, s.scrollLeft, s.scrollTop], [1, 'fit', 0, 0]);
});

onPage('ferme par Échap, par le bouton et par le fond', '/work/seenit/', {}, async (page) => {
	const isOpen = async () => (await state(page)).open;
	await openCover(page);
	await page.keyboard.press('Escape');
	assert.equal(await isOpen(), false);
	await openCover(page);
	await page.click('dialog [data-close]');
	assert.equal(await isOpen(), false);
	await openCover(page);
	await page.click('dialog [data-next]');
	await page.click('dialog [data-caption]:not([hidden])');
	assert.equal(await isOpen(), true, 'un clic sur la légende ne ferme pas');
	await page.mouse.click(720, 4);
	assert.equal(await isOpen(), false);
});

onPage('rend le focus à la couverture, sans faire défiler la page', '/work/seenit/', {}, async (page) => {
	await page.evaluate(() => scrollTo(0, 150));
	await openCover(page);
	const before = await page.evaluate(() => scrollY);
	await page.mouse.move(720, 450);
	await page.mouse.wheel({ deltaY: 600 });
	await settle(page);
	assert.equal(await page.evaluate(() => scrollY), before, 'la page derrière est figée');
	await page.keyboard.press('Escape');
	assert.equal(await focus(page), 'cover-link');
	assert.equal(await page.evaluate(() => scrollY), before);
});

onPage('un double-clic ouvre sans rien changer d’autre', '/work/seenit/', {}, async (page) => {
	await page.click('.cover-link', { count: 2 });
	const s = await state(page);
	assert.deepEqual([s.open, s.size], [true, 'fit']);
});

onPage('la rotation garde la capture et recalcule sa taille', '/work/seenit/', PHONE, async (page) => {
	await openCover(page);
	await page.click('dialog [data-next]');
	await page.click('dialog [data-next]');
	await page.setViewport({ width: 812, height: 375, isMobile: true, hasTouch: true });
	const s = await state(page);
	assert.deepEqual([s.open, s.index], [true, 2]);
	assert.ok(s.width >= 800, String(s.width));
	assert.equal(await inScreen(page, 'dialog [data-close]'), true);
});

onPage('très petit écran et légende : tout reste à l’écran', '/work/chronopotes/', { width: 320, height: 568, mobile: true }, async (page) => {
	await openCover(page);
	await page.click('dialog [data-next]');
	await settle(page);
	for (const selector of ['dialog [data-close]', 'dialog [data-prev]', 'dialog [data-next]', 'dialog [data-caption]:not([hidden])']) {
		assert.equal(await inScreen(page, selector), true, selector);
	}
	assert.ok((await page.$eval('dialog [data-stage]', (el) => el.clientHeight)) >= 150);
});

onPage('cibles d’au moins 44 px, textes dans la couleur du titre', '/work/covoit-etud/', PHONE, async (page) => {
	await openCover(page);
	const buttons = await page.$$eval('dialog button', (els) =>
		els.map((el) => [el.getBoundingClientRect().width, el.getBoundingClientRect().height, getComputedStyle(el).color]),
	);
	assert.equal(buttons.length, 4);
	for (const [width, height, color] of buttons) {
		assert.ok(width >= 44 && height >= 44, `${width} x ${height}`);
		assert.equal(color, 'rgb(49, 66, 154)');
	}
});

onPage('une seule capture : pas de suite', '/work/projet-chat/', {}, async (page) => {
	await openCover(page);
	await page.keyboard.press('ArrowRight');
	assert.equal((await state(page)).index, 0);
});

onPage('pas de bascule quand les deux tailles se valent', '/work/boardpxl/', { width: 1900, height: 1200 }, async (page) => {
	await openCover(page);
	assert.equal(await page.$eval('dialog [data-toggle]', (el) => el.hidden), true);
	await page.click('dialog [data-capture]:not([hidden]) img');
	const s = await state(page);
	assert.deepEqual([s.open, s.size, s.width], [true, 'fit', 1440]);
});

onPage('sans JavaScript, la capture mène à son image', '/work/seenit/', { js: false }, async (page) => {
	const href = await page.$eval('.cover-link', (a) => a.href);
	await Promise.all([page.waitForNavigation(), page.click('.cover-link')]);
	assert.equal(page.url(), href);
});

test('aucune erreur de script sur les pages', async () => {
	for (const path of ['/', '/work/', '/en/work/seenit/', ...PROJECTS.map((slug) => `/work/${slug}/`)]) {
		const page = await site.visit(path);
		assert.deepEqual(page.errors, [], path);
		await page.close();
	}
});
