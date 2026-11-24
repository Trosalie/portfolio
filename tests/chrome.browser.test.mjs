import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { openSite } from './browser.mjs';

let site;
before(async () => {
	site = await openSite();
});
after(() => site?.close());

const PHONE = { width: 375, height: 812, mobile: true };
const near = (a, b, message, gap = 1) => assert.ok(Math.abs(a - b) <= gap, `${message} : ${a} et ${b}`);

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

const box = (page, selector) =>
	page.$eval(selector, (el) => {
		const { left, right, top, bottom } = el.getBoundingClientRect();
		return { left, right, top: top + scrollY, bottom: bottom + scrollY };
	});

// Le menu mobile.

const menuOpen = (page) => page.$eval('#menu-content', (el) => !el.hidden);
const onButton = (page) => page.evaluate(() => document.activeElement.classList.contains('menu-button'));

onPage('menu : Échap le ferme et rend le focus au bouton', '/', PHONE, async (page) => {
	await page.tap('.menu-button');
	assert.equal(await menuOpen(page), true);
	await page.keyboard.press('Tab');
	assert.equal(await onButton(page), false);
	await page.keyboard.press('Escape');
	assert.equal(await menuOpen(page), false);
	assert.equal(await page.$eval('.menu-button', (el) => el.getAttribute('aria-expanded')), 'false');
	assert.equal(await onButton(page), true);
});

onPage('menu : fermé, Échap ne déplace pas le focus', '/', PHONE, async (page) => {
	await page.focus('.actions a');
	await page.keyboard.press('Escape');
	assert.equal(await onButton(page), false);
});

onPage('menu : un appui à l’extérieur le ferme, un appui dedans le garde', '/', PHONE, async (page) => {
	await page.tap('.menu-button');
	const menu = await box(page, '#menu-content');
	await page.touchscreen.tap(300, menu.top + 20);
	assert.equal(await menuOpen(page), true);
	await page.touchscreen.tap(188, menu.bottom + 60);
	assert.equal(await menuOpen(page), false);
	assert.equal(await page.$eval('.menu-button', (el) => el.getAttribute('aria-expanded')), 'false');
	await page.tap('.menu-button');
	assert.equal(await menuOpen(page), true);
	await page.tap('.menu-button');
	assert.equal(await menuOpen(page), false);
});

onPage('menu : sur grand écran, ni Échap ni un clic ne le masquent', '/', {}, async (page) => {
	await page.keyboard.press('Escape');
	await page.mouse.click(700, 600);
	assert.equal(await menuOpen(page), true);
	assert.equal(await page.$eval('.nav-items', (el) => el.getBoundingClientRect().width > 0), true);
});

// Les coupures de ligne.

onPage('le titre de l’accueil s’équilibre, les paragraphes évitent le mot seul', '/', {}, async (page) => {
	assert.equal(await page.$eval('h1', (el) => getComputedStyle(el).textWrap), 'balance');
	assert.equal(await page.$eval('.lede', (el) => getComputedStyle(el).textWrap), 'pretty');
	const lines = await page.$eval('h1', (el) => {
		const node = el.firstChild;
		const out = [];
		let top = null;
		for (let i = 0; i < node.length; i++) {
			const range = document.createRange();
			range.setStart(node, i);
			range.setEnd(node, i + 1);
			const y = Math.round(range.getBoundingClientRect().top);
			if (node.data[i].trim() && y !== top) {
				out.push('');
				top = y;
			}
			if (out.length) out[out.length - 1] += node.data[i];
		}
		return out.map((line) => line.trim());
	});
	assert.ok(lines.length <= 4, lines.join(' / '));
	lines.slice(0, -1).forEach((line) => assert.doesNotMatch(line, /\b(la|le|de|des|et|à)$/, lines.join(' / ')));
});

onPage('le CV garde ses coupures', '/cv/', {}, async (page) => {
	assert.equal(await page.$eval('.cv-profile-text', (el) => getComputedStyle(el).textWrap), 'wrap');
	assert.equal(await page.$eval('.cv li', (el) => getComputedStyle(el).textWrap), 'wrap');
});

// Les alignements.

/** Les bords de la colonne de texte : ceux du titre du site a gauche, symetriques a droite. */
const column = async (page) => {
	const { left } = await box(page, '.site-title');
	const width = await page.evaluate(() => document.documentElement.clientWidth);
	return { left, right: width - left };
};

for (const width of [1440, 1100, 820, 799, 375]) {
	const options = { width, height: 900, mobile: width < 500 };

	onPage(`à ${width} px, les filets s’arrêtent à la colonne de texte`, '/', options, async (page) => {
		const text = await column(page);
		for (const selector of ['body aside', 'body footer']) {
			const line = await box(page, selector);
			near(line.left, text.left, `${selector}, gauche`);
			near(line.right, text.right, `${selector}, droite`);
			near((await box(page, `${selector} p`)).left, text.left, `${selector}, texte`);
		}
	});

	onPage(`à ${width} px, le formulaire ne touche pas le pied de page`, '/contact/', options, async (page) => {
		const main = await box(page, '.contact-layout');
		const footer = await box(page, 'footer');
		assert.ok(footer.top - main.bottom >= 64, String(footer.top - main.bottom));
	});

	onPage(`à ${width} px, le CV s’aligne sur le site`, '/cv/', options, async (page) => {
		const text = await column(page);
		near((await box(page, '.cv-actions .button')).left, text.left, 'bouton');
		const cv = await box(page, '.cv');
		near(cv.left, text.left, 'feuille');
		assert.ok(cv.right <= text.right + 1, `${cv.right} et ${text.right}`);
		const gap = (await box(page, '.cv-actions')).top - (await box(page, 'nav')).bottom;
		await page.goto(`${site.url}/work/`, { waitUntil: 'networkidle0' });
		near(gap, (await box(page, 'h1')).top - (await box(page, 'nav')).bottom, 'même écart sous le menu');
	});
}

// La piste de la galerie : d'un bord a l'autre, capture centree sur la colonne.
for (const width of [1600, 1440, 1250, 1180, 820, 375]) {
	onPage(`à ${width} px, la galerie va d’un bord à l’autre`, '/work/seenit/', { width, height: 900, mobile: width < 500 }, async (page) => {
		const track = await box(page, '.track');
		const screen = await page.evaluate(() => document.documentElement.clientWidth);
		assert.ok(track.left <= 1 && track.right >= screen - 1, JSON.stringify(track));
		for (let i = 1; i <= 3; i++) {
			await page.$eval('[data-gallery] [data-next]', (el) => el.click());
			await new Promise((resolve) => setTimeout(resolve, 900));
			const slide = await box(page, '.slide[data-active]');
			const text = await box(page, '.project');
			near((slide.left + slide.right) / 2, (text.left + text.right) / 2, `capture ${i} centrée sur la colonne`, 2);
		}
		await page.$eval('[data-gallery] [data-dot]', (el) => el.click());
		await new Promise((resolve) => setTimeout(resolve, 1200));
		const first = await box(page, '.slide:first-child');
		const text = await box(page, '.project');
		near((first.left + first.right) / 2, (text.left + text.right) / 2, 'première capture', 2);
	});
}

// Le lien d'evitement est fixe : il s'imprimait au bas de chaque page.
for (const path of ['/', '/work/seenit/']) {
	onPage(`${path} : le lien d’évitement ne s’imprime pas, et reste le premier au clavier`, path, {}, async (page) => {
		const shown = () => page.$eval('.skip-link', (el) => getComputedStyle(el).display);
		await page.emulateMediaType('print');
		assert.equal(await shown(), 'none');
		await page.emulateMediaType('screen');
		assert.notEqual(await shown(), 'none');
		await page.keyboard.press('Tab');
		assert.equal(await page.evaluate(() => document.activeElement.className), 'skip-link');
	});
}
