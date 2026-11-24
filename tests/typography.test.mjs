import assert from 'node:assert/strict';
import { test } from 'node:test';

import { frenchHtml, frenchSpaces } from '../src/typography.ts';
import { distFiles, page } from './helpers.mjs';

const FINE = '\u202f';
const NBSP = '\u00a0';

test('espace fine avant ? ! ; et espace insécable avant : et dans les guillemets', () => {
	assert.equal(frenchSpaces('Quoi ? Oui ! Bien ; vu'), `Quoi${FINE}? Oui${FINE}! Bien${FINE}; vu`);
	assert.equal(frenchSpaces('un projet : ce formulaire'), `un projet${NBSP}: ce formulaire`);
	assert.equal(frenchSpaces('dit « bonjour » ici'), `dit «${NBSP}bonjour${NBSP}» ici`);
});

test('ce qui n’a pas d’espace, ou l’a déjà, ne change pas', () => {
	for (const same of ['à 16:10', 'd&#39;une', 'https://exemple.fr', `Quoi${FINE}?`, 'une phrase, une autre.']) {
		assert.equal(frenchSpaces(same), same);
	}
});

test('seul le texte d’une page française change', () => {
	const body = '<a title="Quoi ?" href="/a?b">Quoi ?</a><script>a ? b : c</script><style>a : b</style><code>x ? y</code><!-- Quoi ? -->';
	const done = `<a title="Quoi ?" href="/a?b">Quoi${FINE}?</a><script>a ? b : c</script><style>a : b</style><code>x ? y</code><!-- Quoi ? -->`;
	assert.equal(frenchHtml(`<html lang="fr">${body}</html>`), `<html lang="fr">${done}</html>`);
	assert.equal(frenchHtml(`<html lang="en">${body}</html>`), `<html lang="en">${body}</html>`);
	// Un chevron dans un attribut ne fait pas passer la suite pour du texte.
	assert.equal(frenchHtml('<html lang="fr"><img alt="a > b ? c">d ?</html>'), `<html lang="fr"><img alt="a > b ? c">d${FINE}?</html>`);
});

/** Le texte visible d'une page, sans ses balises, scripts et styles, espaces intactes. */
const visible = (html) =>
	html
		.slice(html.indexOf('<body'))
		.replace(/<(script|style|code|pre)\b[\s\S]*?<\/\1>/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g, '\n');

test('plus aucune ponctuation haute précédée d’une espace ordinaire sur les pages françaises', () => {
	const files = distFiles(['.html']).filter((f) => !/^dist\/(en|cv|cv-print)\//.test(f.path));
	assert.ok(files.length >= 10, String(files.length));
	for (const { path, content } of files) {
		assert.equal(visible(content).match(/.{0,20} [?!;:»]|« .{0,20}/)?.[0], undefined, path);
	}
	assert.ok(visible(page('/')).includes(`full stack${FINE}?`));
	assert.ok(visible(page('/contact/')).includes(`un projet${NBSP}: ce formulaire`));
	assert.ok(visible(page('/work/seenit/')).includes(`journal de cinéma${NBSP}:`));
});

// Le CV vient d'un autre outil et tient sur une page : ses espaces ne bougent pas.
test('le CV et les pages anglaises ne changent pas', () => {
	for (const route of ['/cv/', '/cv-print/', '/en/', '/en/work/seenit/']) {
		assert.doesNotMatch(visible(page(route)), /[\u202f\u00a0][;!?:»]/, route);
	}
});
