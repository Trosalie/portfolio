import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { openSite } from './browser.mjs';

let site;
before(async () => {
	site = await openSite();
});
after(() => site?.close());

const PHONE = { width: 375, height: 812, mobile: true };
const SMALL = { width: 375, height: 667, mobile: true };

/**
 * Ce que le navigateur fait vraiment d'un changement de page : les cadres nommes
 * sur la page quittee et sur la page ouverte, et les pseudo-elements animes.
 */
function watch() {
	const named = () =>
		[...document.querySelectorAll('.project-frame')]
			.filter((frame) => frame.style.viewTransitionName)
			.map((frame) => {
				const kind = ['tile', 'cover', 'band'].find((name) => frame.classList.contains(name));
				const link = kind === 'cover' ? location : frame.closest('a');
				return `${kind} ${new URL(link.href).pathname.split('/').at(-2)}`;
			});
	// Apres DOMContentLoaded : cet ecouteur passe alors apres celui du site.
	document.addEventListener('DOMContentLoaded', () => {
		addEventListener('pageswap', () => {
			try {
				sessionStorage.setItem('test-old', JSON.stringify(named()));
			} catch {}
		});
	});
	let kept = false;
	addEventListener('pageshow', (event) => {
		kept = event.persisted;
		if (window.seen) window.seen.kept = kept;
	});
	addEventListener('pagereveal', (event) => {
		// `cover` et `end` : ce qui est deja lu quand la page va s'afficher.
		const cover = Boolean(document.querySelector('#cover'));
		const end = Boolean(document.querySelector('#page-end'));
		window.seen = { old: [], named: [], groups: null, kept, cover, end, scroll: scrollY, time: performance.now() };
		try {
			window.seen.old = JSON.parse(sessionStorage.getItem('test-old') ?? '[]');
			sessionStorage.removeItem('test-old');
		} catch {}
		if (!event.viewTransition) window.seen.done = true;
		event.viewTransition?.ready.then(
			() => {
				const animations = document.getAnimations().filter((a) => a.effect?.pseudoElement?.startsWith('::view-transition'));
				window.seen.named = named();
				window.seen.groups = [...new Set(animations.map((a) => a.effect.pseudoElement))];
				window.seen.durations = [...new Set(animations.map((a) => a.effect.getTiming().duration))];
				window.seen.ground = document.documentElement.style.getPropertyValue('--frame-ground');
				window.seen.done = true;
			},
			() => (window.seen.done = true),
		);
	});
}

/** Le navigateur a le droit d'abandonner une transition : la page s'ouvre sans elle. */
class Abandoned extends Error {}

/**
 * Une page observee, sur `path` ; toute erreur de console fait echouer le test. Un
 * scenario que le navigateur abandonne recommence sur une page neuve.
 */
function onPage(name, path, options, run) {
	test(name, async (t) => {
		for (let left = 3; left > 0; left--) {
			try {
				return await attempt(path, options, run);
			} catch (error) {
				if (!(error instanceof Abandoned) || left === 1) throw error;
				t.diagnostic('transition abandonnée par le navigateur, nouvel essai');
			}
		}
	});
}

async function attempt(path, options, run) {
	const own = options.browser && (await openSite(options.browser));
	const at = own || site;
	const page = await at.visit('/404.html', options);
	const errors = [];
	page.on('pageerror', (error) => errors.push(String(error)));
	page.on('console', (message) => isError(message) && errors.push(message.text()));
	try {
		await page.evaluateOnNewDocument(watch);
		if (options.init) await page.evaluateOnNewDocument(options.init);
		await page.goto(at.url + path, { waitUntil: 'networkidle0' });
		await run(page);
		assert.deepEqual(errors, []);
	} catch (error) {
		// Un nouvel essai n'efface pas les erreurs de celui-ci.
		if (error instanceof Abandoned) assert.deepEqual(errors, []);
		throw error;
	} finally {
		await page.close();
		await own?.close();
	}
}

/** Une erreur de console, sans celle de l'icone que la page d'impression ne declare pas. */
const isError = (message) => message.type() === 'error' && !message.location().url?.endsWith('/favicon.ico');

const pathOf = (page) => new URL(page.url()).pathname;
const settle = (page) =>
	page.waitForFunction(() => !document.documentElement.matches(':active-view-transition'), { timeout: 5000 });

/** Declenche une navigation vers `to` et attend que la page ouverte ait tout note. */
async function go(page, to, act) {
	await act();
	await page.waitForFunction((path) => location.pathname === path && document.readyState === 'complete', { timeout: 10000 }, to);
	await page.waitForFunction(() => window.seen?.done, { timeout: 5000 });
	const seen = await page.evaluate(() => window.seen);
	await settle(page);
	return seen;
}

/** Amene un lien au milieu de l'ecran, puis l'ouvre. */
async function follow(page, selector, to) {
	await page.$eval(selector, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
	return go(page, to, () => (page.viewport().hasTouch ? page.tap(selector) : page.click(selector)));
}

/** Suit un lien sans faire defiler la page. */
const followHere = (page, selector, to) => go(page, to, () => page.$eval(selector, (el) => el.click()));
const back = (page, to) => go(page, to, () => page.evaluate(() => history.back()));

const clean = (page) =>
	page.evaluate(() => ({
		named: [...document.querySelectorAll('*')].filter((el) => el.style?.viewTransitionName).length,
		ground: document.documentElement.style.getPropertyValue('--frame-ground'),
	}));

async function glides(page, seen, from, to) {
	if (!seen.groups) throw new Abandoned('transition abandonnée');
	assert.deepEqual(seen.old, [from]);
	assert.deepEqual(seen.named, [to]);
	assert.ok(seen.groups?.includes('::view-transition-old(project)'), String(seen.groups));
	assert.ok(seen.groups?.includes('::view-transition-new(project)'), String(seen.groups));
	assert.deepEqual(seen.groups.filter((g) => !/\((root|project)\)/.test(g)), []);
	assert.deepEqual(await clean(page), { named: 0, ground: '' });
}

/** Aucun glissement. `from` : le cadre que la page quittee avait nomme, s'il n'a pas trouve sa place. */
async function fades(page, seen, from) {
	if (!seen.groups) throw new Abandoned('transition abandonnée');
	assert.deepEqual(seen.old, from ? [from] : []);
	assert.deepEqual(seen.named, []);
	assert.equal(seen.groups.includes('::view-transition-old(project)'), Boolean(from), String(seen.groups));
	assert.ok(seen.groups?.includes('::view-transition-new(root)'), String(seen.groups));
	assert.ok(!seen.groups.includes('::view-transition-new(project)'), String(seen.groups));
	assert.deepEqual(await clean(page), { named: 0, ground: '' });
}

const tileTo = (path) => `a.tile[href="${path}"]`;

for (const [from, to, slug] of [
	['/work/', '/work/seenit/', 'seenit'],
	['/work/', '/work/covoit-etud/', 'covoit-etud'],
	['/', '/work/seenit/', 'seenit'],
	['/en/work/', '/en/work/seenit/', 'seenit'],
]) {
	onPage(`${from} vers ${to} : la vignette glisse vers la couverture`, from, {}, async (page) => {
		await glides(page, await follow(page, tileTo(to), to), `tile ${slug}`, `cover ${slug}`);
	});
}

onPage('projet suivant : le bandeau glisse vers la couverture, et revient', '/work/seenit/', {}, async (page) => {
	const next = '/work/bluepoint-waste-identifier/';
	const seen = await follow(page, '.next-project', next);
	await glides(page, seen, 'band bluepoint-waste-identifier', 'cover bluepoint-waste-identifier');
	const returned = await back(page, '/work/seenit/');
	await glides(page, returned, 'cover bluepoint-waste-identifier', 'band bluepoint-waste-identifier');
});

// Couverture et bandeau visibles ensemble : c'est le projet ou l'on va qui glisse.
onPage('projet suivant sur un très grand écran : le bandeau, pas la couverture', '/work/projet-chat/', { width: 1440, height: 4000 }, async (page) => {
	await glides(page, await followHere(page, '.next-project', '/work/boardpxl/'), 'band boardpxl', 'cover boardpxl');
});

// La liste gardee en memoire porte encore le nom pose a son depart.
onPage('retour avec la couverture hors de l’écran : aucun nom hérité', '/work/', {}, async (page) => {
	await follow(page, tileTo('/work/seenit/'), '/work/seenit/');
	await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
	const seen = await back(page, '/work/');
	assert.equal(seen.kept, true, 'la page devrait revenir de la mémoire du navigateur');
	await fades(page, seen);
});

onPage('retour du navigateur : la couverture revient à la vignette', '/work/', {}, async (page) => {
	await follow(page, tileTo('/work/covoit-etud/'), '/work/covoit-etud/');
	await glides(page, await back(page, '/work/'), 'cover covoit-etud', 'tile covoit-etud');
});

onPage('« Retour aux projets » : la vignette visible en haut de la liste', '/work/chronopotes/', {}, async (page) => {
	await glides(page, await followHere(page, '.back-link', '/work/'), 'cover chronopotes', 'tile chronopotes');
});

onPage('« Retour aux projets » : vignette hors de l’écran, simple fondu', '/work/covoit-etud/', {}, async (page) => {
	await fades(page, await followHere(page, '.back-link', '/work/'), 'cover covoit-etud');
});

onPage('changer de langue : la couverture reste à sa place', '/work/seenit/', {}, async (page) => {
	const seen = await followHere(page, 'header a[href="/en/work/seenit/"]', '/en/work/seenit/');
	await glides(page, seen, 'cover seenit', 'cover seenit');
});

onPage('entre deux pages sans projet : simple fondu', '/', {}, async (page) => {
	await fades(page, await followHere(page, 'header a[href="/contact/"]', '/contact/'));
});

onPage('petit téléphone : couverture hors de l’écran, simple fondu', '/work/', SMALL, async (page) => {
	await fades(page, await follow(page, tileTo('/work/chronopotes/'), '/work/chronopotes/'), 'tile chronopotes');
});

onPage('téléphone, au doigt : la vignette glisse', '/work/', PHONE, async (page) => {
	await glides(page, await follow(page, tileTo('/work/seenit/'), '/work/seenit/'), 'tile seenit', 'cover seenit');
});

onPage('vignette hors de l’écran au départ : simple fondu', '/work/', {}, async (page) => {
	const seen = await followHere(page, tileTo('/work/covoit-etud/'), '/work/covoit-etud/');
	await fades(page, seen);
});

onPage('au clavier : la vignette glisse', '/work/', {}, async (page) => {
	await page.focus(tileTo('/work/seenit/'));
	const seen = await go(page, '/work/seenit/', () => page.keyboard.press('Enter'));
	await glides(page, seen, 'tile seenit', 'cover seenit');
});

onPage('une adresse avec requête et ancre est reconnue', '/work/?a=1#x', {}, async (page) => {
	await glides(page, await follow(page, tileTo('/work/seenit/'), '/work/seenit/'), 'tile seenit', 'cover seenit');
	await page.goto(`${site.url}/work/chronopotes/?a=1#x`, { waitUntil: 'networkidle0' });
	await glides(page, await followHere(page, '.back-link', '/work/'), 'cover chronopotes', 'tile chronopotes');
});

onPage('le cadre garde sa couleur de fond pendant le glissement', '/work/', {}, async (page) => {
	const seen = await follow(page, tileTo('/work/covoit-etud/'), '/work/covoit-etud/');
	if (!seen.groups) throw new Abandoned('transition abandonnée');
	assert.equal(seen.ground, 'rgb(171, 196, 255)');
	assert.deepEqual(seen.durations, [300]);
});

onPage('mouvement réduit : aucune transition', '/work/', {}, async (page) => {
	await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
	const seen = await follow(page, tileTo('/work/seenit/'), '/work/seenit/');
	assert.equal(seen.groups, null);
	assert.deepEqual(await clean(page), { named: 0, ground: '' });
});

onPage(
	'stockage interdit : la page s’ouvre, simple fondu',
	'/work/',
	{
		init: () =>
			Object.defineProperty(window, 'sessionStorage', {
				get() {
					throw new DOMException('interdit', 'SecurityError');
				},
			}),
	},
	async (page) => {
		await fades(page, await follow(page, tileTo('/work/seenit/'), '/work/seenit/'));
	},
);

onPage('deux clics rapides : la page du dernier, rien ne reste', '/work/', {}, async (page) => {
	await page.evaluate(() => {
		document.querySelector('a.tile[href="/work/chronopotes/"]').click();
		document.querySelector('a.tile[href="/work/seenit/"]').click();
	});
	await page.waitForFunction(() => location.pathname === '/work/seenit/' && document.readyState === 'complete');
	await settle(page);
	assert.deepEqual(await clean(page), { named: 0, ground: '' });
});

onPage('retour pendant la transition : rien ne reste', '/work/', {}, async (page) => {
	await page.click(tileTo('/work/chronopotes/'));
	await page.waitForFunction(() => location.pathname === '/work/chronopotes/');
	await page.evaluate(() => history.back());
	await page.waitForFunction(() => location.pathname === '/work/' && document.readyState === 'complete');
	await settle(page);
	await new Promise((resolve) => setTimeout(resolve, 500));
	assert.deepEqual(await clean(page), { named: 0, ground: '' });
});

onPage('Ctrl+clic : rien n’est retenu pour la navigation suivante', '/work/', {}, async (page) => {
	await page.keyboard.down('Control');
	await page.click(tileTo('/work/chronopotes/'));
	await page.keyboard.up('Control');
	const target = await page.browser().waitForTarget((t) => t.url().endsWith('/work/chronopotes/'), { timeout: 5000 });
	const tab = await target.page();
	// Par delai : un onglet en arriere-plan n'a pas d'images a attendre.
	await tab.waitForFunction(() => document.readyState === 'complete', { polling: 100 });
	assert.deepEqual(await clean(tab), { named: 0, ground: '' });
	assert.equal(await tab.evaluate(() => sessionStorage.getItem('project-frame')), null);
	await tab.close();
	assert.equal(pathOf(page), '/work/');
	assert.deepEqual(await clean(page), { named: 0, ground: '' });
	assert.equal(await page.evaluate(() => sessionStorage.getItem('project-frame')), null);
	await page.bringToFront();
	await fades(page, await followHere(page, 'header a[href="/contact/"]', '/contact/'));
});

onPage('allers et retours de suite : la transition marche à chaque fois', '/work/', {}, async (page) => {
	for (let i = 0; i < 2; i++) {
		await glides(page, await follow(page, tileTo('/work/seenit/'), '/work/seenit/'), 'tile seenit', 'cover seenit');
		await glides(page, await back(page, '/work/'), 'cover seenit', 'tile seenit');
	}
});

onPage('rien ne reste en mémoire après une transition', '/work/', {}, async (page) => {
	await follow(page, tileTo('/work/seenit/'), '/work/seenit/');
	assert.equal(await page.evaluate(() => sessionStorage.getItem('project-frame')), null);
});

// Un navigateur plus ancien : les evenements n'arrivent jamais, la regle CSS non plus.
onPage(
	'sans les API du navigateur, la page s’ouvre',
	'/work/',
	{
		init: () => {
			const add = window.addEventListener;
			window.addEventListener = (type, ...rest) => {
				if (!['pageswap', 'pagereveal'].includes(type)) add.call(window, type, ...rest);
			};
		},
	},
	async (page) => {
		await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
		await page.click(tileTo('/work/seenit/'));
		await page.waitForFunction(() => location.pathname === '/work/seenit/' && document.readyState === 'complete');
		assert.deepEqual(await clean(page), { named: 0, ground: '' });
	},
);

// La couverture ne doit pas passer par-dessus la visionneuse.
onPage('visionneuse ouverte, retour du navigateur : simple fondu', '/work/', {}, async (page) => {
	await follow(page, tileTo('/work/seenit/'), '/work/seenit/');
	await page.click('.cover-link');
	assert.equal(await page.$eval('dialog', (el) => el.open), true);
	const seen = await back(page, '/work/');
	await fades(page, seen);
});

const NO_CACHE = ['--disable-features=BackForwardCache'];

onPage('retour sur une page non gardée en mémoire : la position et la vignette', '/work/', { browser: { args: NO_CACHE } }, async (page) => {
	await page.$eval(tileTo('/work/covoit-etud/'), (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
	const at = await page.evaluate(() => scrollY);
	await follow(page, tileTo('/work/covoit-etud/'), '/work/covoit-etud/');
	const seen = await back(page, '/work/');
	assert.equal(seen.kept, false);
	assert.equal(seen.end, true, 'la liste devrait être lue en entier');
	assert.equal(seen.scroll, at, 'la position devrait être retrouvée avant l’affichage');
	await glides(page, seen, 'cover covoit-etud', 'tile covoit-etud');
});

onPage('page qui arrive en deux fois : la couverture est attendue', '/work/', { browser: { split: 400 } }, async (page) => {
	assert.equal((await follow(page, tileTo('/work/seenit/'), '/work/seenit/')).cover, true);
});

onPage('liste qui arrive en deux fois : la vignette est attendue', '/work/chronopotes/', { browser: { split: 400 } }, async (page) => {
	assert.equal((await followHere(page, '.back-link', '/work/')).end, true);
});

// Ces pages ne montrent aucun cadre : rien a nommer, rien a attendre.
for (const [from, to] of [
	['/', '/contact/'],
	['/work/seenit/', '/contact/'],
	['/work/seenit/', '/cv/'],
	['/en/work/seenit/', '/en/contact/'],
]) {
	onPage(`de ${from} à ${to} : aucun cadre, rien ne retarde la page`, from, { browser: { split: 400 } }, async (page) => {
		const seen = await followHere(page, `header a[href="${to}"]`, to);
		assert.deepEqual([seen.old, seen.named], [[], []]);
		assert.equal(await page.evaluate(() => document.querySelectorAll('link[rel="expect"]').length), 0);
	});
}

onPage('très lente, la page n’attend pas plus d’une demi-seconde', '/work/', { browser: { split: 2500 } }, async (page) => {
	const seen = await follow(page, tileTo('/work/seenit/'), '/work/seenit/');
	assert.ok(seen.time < 1500, `${Math.round(seen.time)} ms`);
});

// La page quittee accepte les transitions, la page d'impression non : Chrome abandonne
// a chaque fois.
onPage('retour sur la page d’impression du CV : aucune erreur', '/cv-print/', {}, async (page) => {
	await page.click('.btn-back');
	await page.waitForFunction(() => location.pathname === '/cv/' && document.readyState === 'complete');
	await page.evaluate(() => history.back());
	await page.waitForFunction(() => location.pathname === '/cv-print/' && document.readyState === 'complete');
	await new Promise((resolve) => setTimeout(resolve, 600));
});

/** Les erreurs qu'une page laisse voir pendant `run`. */
async function errorsOf(path, run) {
	const page = await site.visit('/404.html');
	const errors = [];
	page.on('pageerror', (error) => errors.push(String(error)));
	page.on('console', (message) => isError(message) && errors.push(message.text()));
	try {
		await page.goto(site.url + path, { waitUntil: 'networkidle0' });
		await run(page);
		await new Promise((resolve) => setTimeout(resolve, 600));
		return errors;
	} finally {
		await page.close();
	}
}

/** Une promesse rejetee par la page elle-meme, et non par l'outil de test. */
const script = (page, content) => page.addScriptTag({ content });
const reject = (page, name, message) => script(page, `Promise.reject(new DOMException(${JSON.stringify(message)}, '${name}'))`);

test('seule une transition abandonnée est tue', async () => {
	for (const path of ['/', '/cv-print/']) {
		const quiet = await errorsOf(path, async (page) => {
			await reject(page, 'AbortError', 'Transition was skipped');
			await reject(page, 'InvalidStateError', 'Transition was aborted because of invalid state');
			await reject(page, 'TimeoutError', 'Transition was aborted because of timeout in DOM update');
		});
		assert.deepEqual(quiet, [], path);
		const loud = await errorsOf(path, async (page) => {
			await reject(page, 'AbortError', 'The user aborted a request.');
			await reject(page, 'TimeoutError', 'signal timed out');
			await reject(page, 'DataError', 'Transition was skipped');
			await script(page, "Promise.reject(new Error('une vraie erreur'))");
			await script(page, 'Promise.reject()');
		});
		assert.equal(loud.length, 5, `${path} : ${loud.join(' | ')}`);
	}
});

// Deux cadres du meme nom : un defaut du site, qui doit rester visible.
test('un nom en double reste visible dans la console', async () => {
	const errors = await errorsOf('/work/', async (page) => {
		await page.addStyleTag({ content: 'h1 { view-transition-name: project; }' });
		await page.click(tileTo('/work/chronopotes/'));
		await page.waitForFunction(() => location.pathname === '/work/chronopotes/' && document.readyState === 'complete');
	});
	assert.ok(errors.some((error) => /duplicate/i.test(error)), errors.join(' | ') || 'aucune erreur');
});

// Quitter une page pendant que sa propre transition dure encore.
onPage(
	'deux retours rapprochés : le second cadre glisse aussi',
	'/work/seenit/',
	{
		width: 1440,
		height: 1800,
		init: () =>
			document.addEventListener('DOMContentLoaded', () => {
				const style = document.createElement('style');
				style.textContent =
					'::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation-duration:1500ms!important}';
				document.head.append(style);
			}),
	},
	async (page) => {
		await followHere(page, '.back-link', '/work/');
		await followHere(page, tileTo('/work/chronopotes/'), '/work/chronopotes/');
		await page.evaluate(() => history.back());
		await page.waitForFunction(() => location.pathname === '/work/' && document.documentElement.matches(':active-view-transition'));
		await new Promise((resolve) => setTimeout(resolve, 150));
		assert.equal(await page.evaluate(() => document.documentElement.matches(':active-view-transition')), true);
		const seen = await back(page, '/work/seenit/');
		await glides(page, seen, 'tile seenit', 'cover seenit');
	},
);
