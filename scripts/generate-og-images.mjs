/**
 * Genere les cartes de partage du site : public/og-fr.jpg et public/og-en.jpg.
 *
 * C'est l'image qu'affichent LinkedIn et les messageries quand on partage un
 * lien du site. Elle reprend la vitrine : le mur gris, la phrase d'accueil et
 * les deux projets dans leur identite, ChronoPotes et Seenit.
 *
 * Les images sont commitees : le build ne les regenere pas. Relancer ce script
 * apres un changement de la phrase d'accueil, d'une couverture ou du cadre d'un
 * de ces deux projets :
 *
 *     node scripts/generate-og-images.mjs
 *
 * Les textes viennent de src/i18n/ui.ts et des fichiers de contenu, les couleurs
 * des projets de leur champ `identity` : la carte ne peut pas dire autre chose
 * que le site.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';
import sharp from 'sharp';

import { ui } from '../src/i18n/ui.ts';

const root = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const read = (path) => readFileSync(root(path), 'utf8');

const WIDTH = 1200;
const HEIGHT = 630;

const font = (path) => `data:font/woff2;base64,${readFileSync(root(path)).toString('base64')}`;
const FONTS = {
	sans: font('node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2'),
	oswald: font('node_modules/@fontsource/oswald/files/oswald-latin-600-normal.woff2'),
	playfair: font('node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-italic.woff2'),
};

/** L'adresse du site, lue dans astro.config.mjs, sans protocole. */
const site = read('astro.config.mjs').match(/site:\s*'https?:\/\/([^']+)'/)[1];

/** Ce qu'il faut d'un projet pour sa vignette, lu dans son fichier de contenu. */
async function project(slug, lang) {
	const file = read(`src/content/${lang === 'en' ? 'work-en' : 'work'}/${slug}.md`);
	const field = (name) => file.match(new RegExp(`^${name}: (.*)$`, 'm'))?.[1].replace(/^"|"$/g, '');
	const frameField = (name) => file.match(new RegExp(`^    ${name}: "?(#[0-9A-Fa-f]{6})"?`, 'm'))?.[1];
	const cover = file.match(/^img: \.\.\/\.\.\/(.*)$/m)[1];
	const image = await sharp(root(`src/${cover}`)).resize({ width: 640 }).jpeg({ quality: 85 }).toBuffer();
	return {
		title: field('title'),
		year: field('publishDate').slice(0, 4),
		context: field('context'),
		background: frameField('background'),
		border: frameField('border') ?? frameField('background'),
		titleColor: frameField('titleColor'),
		image: `data:image/jpeg;base64,${image.toString('base64')}`,
	};
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function tile(p, titleClass) {
	return `
		<div class="tile">
			<div class="frame ${titleClass}" style="background:${p.background};border-color:${p.border};color:${p.titleColor}">
				<span class="frame-title">${escape(p.title)}</span>
				<img src="${p.image}" alt="" />
			</div>
			<p class="cartel"><strong>${escape(p.title)}</strong>, ${p.year}<span>${escape(p.context)}</span></p>
		</div>`;
}

async function card(lang) {
	const [chrono, seenit] = await Promise.all([project('chronopotes', lang), project('seenit', lang)]);
	return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><style>
	@font-face { font-family: 'Sans'; src: url(${FONTS.sans}) format('woff2'); font-weight: 400 700; }
	@font-face { font-family: 'Oswald'; src: url(${FONTS.oswald}) format('woff2'); font-weight: 600; }
	@font-face { font-family: 'Playfair'; src: url(${FONTS.playfair}) format('woff2'); font-weight: 600; font-style: italic; }
	* { margin: 0; box-sizing: border-box; }
	body { width: ${WIDTH}px; height: ${HEIGHT}px; background: #E6E6E2; color: #1C2230; font-family: 'Sans', sans-serif; -webkit-font-smoothing: antialiased; }
	.card { display: grid; grid-template-columns: 470px 1fr; gap: 52px; height: 100%; padding: 60px 64px; }
	.text { display: flex; flex-direction: column; justify-content: space-between; }
	.name { font-size: 26px; font-weight: 600; }
	h1 { font-size: 40px; line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; }
	.site { font-size: 20px; color: #555C6B; }
	.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; align-self: center; }
	.frame { padding: 14px; border: 5px solid; }
	.frame-title { display: block; height: 24px; margin-bottom: 10px; font-size: 18px; line-height: 24px; }
	.oswald .frame-title { font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
	.playfair .frame-title { font-family: 'Playfair', serif; font-style: italic; font-weight: 600; font-size: 20px; }
	img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; border-radius: 2px; }
	.cartel { display: inline-block; margin-top: 12px; padding: 9px 12px 10px; background: #fff; font-size: 15px; line-height: 1.4; }
	.cartel strong { font-weight: 600; }
	.cartel span { display: block; color: #555C6B; font-size: 14px; }
</style></head><body>
	<div class="card">
		<div class="text">
			<p class="name">Thibault Rosalie</p>
			<h1>${escape(ui[lang]['index.hero.title'])}</h1>
			<p class="site">${escape(site)}</p>
		</div>
		<div class="tiles">${tile(chrono, 'oswald')}${tile(seenit, 'playfair')}</div>
	</div>
</body></html>`;
}

const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
try {
	const page = await browser.newPage();
	await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
	for (const lang of ['fr', 'en']) {
		await page.setContent(await card(lang), { waitUntil: 'load' });
		await page.evaluate(() => document.fonts.ready);
		const out = root(`public/og-${lang}.jpg`);
		await page.screenshot({ path: out, type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
		console.log(`Carte ${lang.toUpperCase()} : ${out}`);
	}
} finally {
	await browser.close();
}
