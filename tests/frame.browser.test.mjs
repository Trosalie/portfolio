import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { frameStyle } from '../src/data/identity.ts';
import { openSite } from './browser.mjs';

let site;
before(async () => {
	site = await openSite();
});
after(() => site?.close());

// Aucun projet n'est sans identite : on donne a un cadre du site les variables du
// repli, et on regarde ce que sa feuille de style en fait.
for (const [what, selector, path] of [
	['une vignette', 'a.tile .project-frame', '/work/'],
	['le bandeau « Projet suivant »', '.next-project .project-frame', '/work/seenit/'],
]) {
	test(`sans identité, ${what} est encre, nom en blanc dans la police du site`, async () => {
		const page = await site.visit(path);
		const seen = await page.$eval(
			selector,
			(el, style) => {
				el.setAttribute('style', style);
				el.className = el.className.replace(/title--[\w-]+/, 'title--site').replace('bordered', '');
				const title = el.querySelector('.frame-title');
				return {
					ground: getComputedStyle(el).backgroundColor,
					color: getComputedStyle(title).color,
					font: getComputedStyle(title).fontFamily,
				};
			},
			frameStyle(undefined),
		);
		await page.close();
		assert.equal(seen.ground, 'rgb(28, 34, 48)');
		assert.equal(seen.color, 'rgb(255, 255, 255)');
		assert.match(seen.font, /Schibsted Grotesk/);
	});
}
