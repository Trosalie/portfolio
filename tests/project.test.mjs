import assert from 'node:assert/strict';
import { test } from 'node:test';

import { chunk, page, pageCss, srcFiles, text } from './helpers.mjs';

const order = (html, titles) => titles.map((t) => html.indexOf(`>${t}</h2>`));

test('les sections suivent l’ordre de la spec', () => {
	const idx = order(page('/work/seenit/'), [
		'Le projet',
		'Mon rôle',
		'Identité visuelle',
		'Fonctionnalités',
		'Stack technique',
		'En images',
	]);
	assert.ok(
		idx.every((i) => i > 0),
		JSON.stringify(idx),
	);
	assert.deepEqual([...idx].sort((a, b) => a - b), idx);
});

test('le nuancier de Seenit, en français et en anglais', () => {
	const fr = text(page('/work/seenit/'));
	for (const s of [
		'Bois',
		'#2C1C0F',
		'Laiton',
		'#C5A059',
		'Velours',
		'Ivoire',
		'Playfair Display',
		'DM Sans',
		'DM Mono',
		'Mulholland Drive',
		'Vu le 14 novembre',
	]) {
		assert.ok(fr.includes(s), s);
	}
	const en = text(page('/en/work/seenit/'));
	for (const s of ['Visual identity', 'Wood', 'Brass', 'Watched on 14 November']) assert.ok(en.includes(s), s);
});

test('le nuancier de ChronoPotes et ses palettes', () => {
	assert.ok(text(page('/work/chronopotes/')).includes('Cadran'));
	assert.match(page('/work/chronopotes/'), /role="img"[^>]*aria-label="04,96 Masterclass"/);
	assert.match(page('/en/work/chronopotes/'), /aria-label="04\.96 Masterclass"/);
	assert.ok(text(page('/en/work/chronopotes/')).includes('Dial'));
});

test('pas de nuancier pour un projet sans identité', () => {
	assert.ok(!page('/work/bluepoint-waste-identifier/').includes('Identité visuelle'));
});

test('le nuancier dépend du nuancier, pas du cadre', () => {
	const layout = srcFiles(['.astro']).find((f) => f.path.endsWith('layouts/ProjectLayout.astro')).content;
	assert.match(layout, /hasSpecimen\(entry\.data\.identity\)/);
});

test('ni pilules, ni points médians, ni icônes de fonctionnalité', () => {
	for (const slug of ['seenit', 'covoit-etud']) {
		const html = page(`/work/${slug}/`);
		assert.ok(!html.includes('class="pill"'), slug);
		assert.ok(!text(chunk(html, '<main', '</main>')).includes('·'), slug);
	}
});

// Plus aucun projet n'est sans capture : la regle est verifiee dans la mise en
// page, qui n'affiche la couverture que si le projet a une image.
test('pas de couverture vide pour un projet sans capture', () => {
	const layout = srcFiles(['.astro']).find((f) => f.path.endsWith('layouts/ProjectLayout.astro')).content;
	assert.match(layout, /\{entry\.data\.img && <ProjectCover entry=\{entry\} \/>\}/);
});

// Le fragment commence au milieu de la balise ouvrante : on retire ce reste avant d'en lire le texte.
const facts = (route) => text(chunk(page(route), 'class="facts', '</dl>').replace(/^[^>]*>/, ''));

test('la fiche du projet, en français et en anglais', () => {
	assert.equal(
		facts('/work/seenit/'),
		'Période Novembre 2026 Cadre Projet personnel Équipe Seul Technologies React, TypeScript, Node.js, SQLite, API TMDb',
	);
	assert.ok(facts('/en/work/seenit/').includes('Date November 2026 Context Personal project Team Solo Technologies React'));
});

test('une ligne sans valeur n’apparaît pas dans la fiche', () => {
	const chat = facts('/work/projet-chat/');
	assert.ok(chat.includes('Cadre Projet de cours en BUT Informatique'), chat);
	assert.ok(!chat.includes('Équipe'), chat);
});

test('la fiche est en tête, avant la couverture, et remplace la liste grise', () => {
	const html = page('/work/seenit/');
	const at = html.indexOf('class="facts');
	assert.ok(at > 0 && at < html.indexOf('class="project-frame'));
	assert.ok(!html.includes('class="meta'));
});

test('à partir de 50em, la fiche se pose à droite sans écraser le titre', () => {
	assert.match(pageCss('/work/seenit/'), /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(14rem,\s*18rem\)/);
});

/** Les slugs des projets, dans l'ordre de la liste d'une langue. */
const slugsOf = (base) => [...new Set([...page(base).matchAll(new RegExp(`href="${base}([^"/]+)"`, 'g'))].map((m) => m[1]))];

for (const [base, label] of [['/work/', 'Projet suivant : '], ['/en/work/', 'Next project: ']]) {
	test(`chaque projet mène au suivant, le dernier au premier (${base})`, () => {
		const slugs = slugsOf(base);
		assert.equal(slugs.length, 6, slugs.join(', '));
		slugs.forEach((slug, i) => {
			const next = slugs[(i + 1) % slugs.length];
			const link = chunk(page(`${base}${slug}/`), 'class="next-project', '</a>');
			assert.match(link, new RegExp(`href="${base}${next}"`), slug);
			const title = text(chunk(page(`${base}${next}/`), '<h1', '</h1>'));
			assert.equal(text(link.match(/aria-label="([^"]*)"/)[1]), `${label}${title}`, slug);
			assert.doesNotMatch(link, /aria-hidden/, slug);
			assert.ok(!text(link).includes('→'), slug);
		});
	});
}

test('le lien vient après la dernière section, avant le bloc de contact', () => {
	const html = page('/work/seenit/');
	const at = html.indexOf('class="next-project');
	assert.ok(html.indexOf('>En images</h2>') < at && at < html.indexOf('</main>'));
});

test('le bandeau reste un bloc et son titre passe à la ligne', () => {
	const css = pageCss('/work/seenit/');
	assert.match(css, /\.next-project[^{]*\{[^}]*display:\s*(block|flex)/);
	assert.match(css, /\.band[^{]*\.frame-title[^{]*\{[^}]*overflow-wrap:\s*anywhere/);
});
