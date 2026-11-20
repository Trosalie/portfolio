import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chunk, page, text } from './helpers.mjs';

test('le nom seul, sans icône, ouvre la navigation', () => {
	const nav = chunk(page('/'), '<nav', '</nav>');
	assert.match(nav, /class="site-title"[^>]*>\s*Thibault Rosalie\s*<\/a>/);
});

test('FR et EN sont deux liens, la langue courante est marquée', () => {
	const fr = chunk(page('/work/'), 'class="lang', '</div>');
	assert.match(fr, /<a[^>]*href="\/work\/"[^>]*aria-current="page"[^>]*>FR<\/a>/);
	assert.match(fr, /<a[^>]*href="\/en\/work\/"[^>]*hreflang="en"[^>]*>EN<\/a>/);
	assert.ok(!fr.includes('role="switch"'));

	const en = chunk(page('/en/work/'), 'class="lang', '</div>');
	assert.match(en, /<a[^>]*href="\/en\/work\/"[^>]*aria-current="page"[^>]*>EN<\/a>/);
	assert.match(en, /<a[^>]*href="\/work\/"[^>]*hreflang="fr"[^>]*>FR<\/a>/);
});

test('le pied de page ne cite plus Astro', () => {
	const year = new Date().getFullYear();
	for (const r of ['/', '/en/']) {
		const footer = text(chunk(page(r), '<footer', '</footer>'));
		assert.ok(footer.includes(`© ${year} Thibault Rosalie`), footer);
		assert.ok(!/Astro|Créé avec|Built with/.test(footer), footer);
	}
});
