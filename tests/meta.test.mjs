import assert from 'node:assert/strict';
import { test } from 'node:test';

import { page, text } from './helpers.mjs';

const title = (route) => text(page(route).match(/<title>([\s\S]*?)<\/title>/)[1]);
const meta = (route, attr, name) =>
	page(route).match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1] ?? '';

// Le titre d'onglet et de resultat de recherche : c'est souvent la premiere
// chose qu'une personne qui recrute lit du site.
test('chaque page a un titre propre et nommé', () => {
	const expected = {
		'/': 'Thibault Rosalie, développeur full stack',
		'/en/': 'Thibault Rosalie, full stack developer',
		'/work/': 'Projets | Thibault Rosalie',
		'/en/work/': 'Projects | Thibault Rosalie',
		'/work/seenit/': 'Seenit | Thibault Rosalie',
		'/en/work/chronopotes/': 'ChronoPotes | Thibault Rosalie',
		'/cv/': 'CV | Thibault Rosalie',
		'/en/cv/': 'Resume | Thibault Rosalie',
		'/contact/': 'Contact | Thibault Rosalie',
		'/en/contact/': 'Contact | Thibault Rosalie',
		'/404': 'Page introuvable | Thibault Rosalie',
		'/cv-print/': 'CV | Thibault Rosalie (impression)',
		'/en/cv-print/': 'Resume | Thibault Rosalie (print)',
	};
	for (const [route, value] of Object.entries(expected)) assert.equal(title(route), value, route);
});

// « ROSALIE » en capitales reste une convention du CV ; le site ecrit le nom
// normalement, et « FullStack » n'existe plus.
test('titres, descriptions et nom du site écrivent « Thibault Rosalie »', () => {
	const routes = ['/', '/en/', '/work/', '/en/work/', '/cv/', '/en/cv/', '/contact/', '/en/contact/', '/404'];
	for (const route of routes) {
		const fields = [title(route), meta(route, 'name', 'description'), meta(route, 'property', 'og:site_name')];
		for (const field of fields) {
			assert.ok(!/ROSALIE|FullStack|Rosalie-/.test(field), `${route} : ${field}`);
		}
		assert.equal(meta(route, 'property', 'og:site_name'), 'Thibault Rosalie', route);
	}
});

test('la page contact ne promet plus de réponse « dans les plus brefs délais »', () => {
	const fr = text(page('/contact/'));
	assert.ok(!/N'hésitez pas|brefs délais/.test(fr), fr);
	assert.ok(fr.includes("Un poste à pourvoir ou une question sur un projet : ce formulaire m'arrive directement par e-mail."));
	assert.ok(text(page('/en/contact/')).includes('A role to fill or a question about a project: this form goes straight to my inbox.'));
});
