import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { formatFlap, formatGap, rollPlan } from '../src/data/chrono.ts';
import { openSite } from './browser.mjs';

const FR = '/work/chronopotes/';
const EN = '/en/work/chronopotes/';
const NBSP = String.fromCharCode(0xa0);

let site;
before(async () => (site = await openSite()));
after(() => site?.close());

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Les instants des gestes, et `window.at` pour en choisir un soi-meme. */
function record() {
	const { get } = Object.getOwnPropertyDescriptor(Event.prototype, 'timeStamp');
	Object.defineProperty(Event.prototype, 'timeStamp', {
		get() {
			return window.at ?? get.call(this);
		},
	});
	window.gestures = [];
	window.said = [];
	for (const type of ['pointerdown', 'keydown', 'click']) {
		addEventListener(type, (event) => window.gestures.push({ type, time: event.timeStamp }), true);
	}
	addEventListener('DOMContentLoaded', () => {
		const live = document.querySelector('[data-chrono] [data-live]');
		if (!live) return;
		new MutationObserver(() => window.said.push(live.textContent)).observe(live, {
			childList: true,
			characterData: true,
			subtree: true,
		});
	});
}

/** Un test sur une page neuve, la piece a l'ecran, sans erreur a la fin. */
function onPiece(name, { path = FR, init, reduced = false, ...options }, run) {
	test(name, async () => {
		const page = await site.visit('/404.html', options);
		try {
			await page.evaluateOnNewDocument(record);
			if (init) await page.evaluateOnNewDocument(init);
			if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
			page.errors.length = 0;
			await page.goto(site.url + path, { waitUntil: 'load' });
			await page.evaluate(() =>
				document.querySelector('[data-chrono]')?.scrollIntoView({ block: 'center', behavior: 'instant' }),
			);
			await wait(150);
			await run(page);
			assert.deepEqual(page.errors, []);
		} finally {
			await page.close();
		}
	});
}

const read = (page) =>
	page.evaluate(() => {
		const root = document.querySelector('[data-chrono]');
		const at = (name) => root.querySelector(`[data-${name}]`);
		const flaps = [...root.querySelectorAll('[data-char]')];
		return {
			state: root.dataset.state,
			value: flaps.map((flap) => flap.dataset.char).join(''),
			texts: flaps.map((flap) => flap.textContent.trim()).join(''),
			spoken: at('flaps').getAttribute('aria-label'),
			tier: at('tier').textContent.trim().replace("'", '’'),
			color: getComputedStyle(at('tier')).color,
			praise: at('praise').textContent.trim(),
			gap: at('gap').textContent.trim(),
			button: at('button').textContent.trim(),
			name: at('button').getAttribute('aria-label'),
			target: at('target').textContent.trim(),
			link: Boolean(at('link')) && getComputedStyle(at('link')).visibility === 'visible',
			live: at('live').textContent,
			focused: document.activeElement === at('button'),
		};
	});

const until = (page, state) =>
	page.waitForFunction(
		(s) => document.querySelector('[data-chrono]').dataset.state === s,
		{ timeout: 4000, polling: 20 },
		state,
	);

const middle = (page, name) =>
	page.evaluate((n) => {
		const box = document.querySelector(`[data-chrono] [data-${n}]`).getBoundingClientRect();
		return [box.x + box.width / 2, box.y + box.height / 2];
	}, name);

const at = (page, time) => page.evaluate((t) => void (window.at = t), time);
const press = async (page, name = 'button', options) => page.mouse.click(...(await middle(page, name)), options);
const tap = async (page, name = 'button') => page.touchscreen.tap(...(await middle(page, name)));
const start = async (page) => {
	await press(page);
	await until(page, 'running');
};

/** Une manche dont l'ecart est choisi, jusqu'au resultat. */
async function round(page, gap, from = 10_000) {
	await at(page, from);
	await start(page);
	await at(page, from + 5000 + gap);
	await press(page);
	await until(page, 'result');
}

const PHONE = { width: 375, height: 800, mobile: true };

// Les gestes.

const GESTURES = {
	souris: [{}, press, press],
	doigt: [PHONE, tap, tap],
	Espace: [{ key: 'Space' }],
	Entrée: [{ key: 'Enter' }],
	'souris, sur les palettes': [{}, press, (page) => press(page, 'flaps')],
	'doigt, sur les palettes': [PHONE, tap, (page) => tap(page, 'flaps')],
};

for (const [name, [{ key, ...options }, go, stop]] of Object.entries(GESTURES)) {
	onPiece(`une manche : ${name}`, options, async (page) => {
		const act = key ? () => page.keyboard.press(key) : undefined;
		if (key) await page.focus('[data-chrono] [data-button]');
		await (act ?? (() => go(page)))();
		const running = await read(page);
		assert.equal(running.state, 'running');
		assert.equal(running.value, '??,??');
		assert.equal(running.texts, '??,??');
		assert.equal(running.button, 'Arrêter');
		await wait(700);
		const from = await page.evaluate(() => window.gestures.findLast((g) => g.type === 'click').time);
		await page.evaluate(() => void (window.gestures.length = 0));
		await (act ?? (() => stop(page)))();
		const to = await page.evaluate(() => window.gestures[0]);
		assert.equal(to.type, key ? 'keydown' : 'pointerdown');
		await until(page, 'result');
		const seen = await read(page);
		const shown = Number(seen.value.replace(',', '.')) * 1000;
		assert.ok(Math.abs(shown - (to.time - from)) <= 10, `${shown} affiché, ${to.time - from} mesuré`);
		assert.equal(seen.texts, seen.value);
		assert.equal(seen.tier, 'Supprimé');
		assert.equal(seen.button, 'Rejouer');
		await wait(500);
		assert.equal((await read(page)).state, 'result');
	});
}

onPiece('un clic sans appui (lecteur d’écran, commande vocale) joue aussi', {}, async (page) => {
	const click = () => page.evaluate(() => document.querySelector('[data-chrono] [data-button]').click());
	await click();
	assert.equal((await read(page)).state, 'running');
	await click();
	assert.equal((await read(page)).state, 'running', 'dans les 400 ms');
	await wait(500);
	await click();
	await until(page, 'result');
	await wait(500);
	await click();
	assert.equal((await read(page)).state, 'running');
});

for (const name of ['button', 'flaps']) {
	onPiece(`l’arrêt se prend à l’appui : ${name}`, {}, async (page) => {
		await start(page);
		await wait(500);
		await page.mouse.move(...(await middle(page, name)));
		await page.mouse.down();
		assert.notEqual((await read(page)).state, 'running');
		await page.mouse.up();
	});
}

onPiece('double-clic sur Jouer : la manche continue', {}, async (page) => {
	await press(page);
	await press(page);
	await wait(600);
	assert.equal((await read(page)).state, 'running');
});

// Le second appui d'un double-clic, garde longtemps : son relachement n'arrete rien.
onPiece('double-clic dont le second appui dure : la manche continue', {}, async (page) => {
	await press(page);
	await page.mouse.down();
	await wait(700);
	await page.mouse.up();
	await wait(100);
	assert.equal((await read(page)).state, 'running');
});

const HOLDS = {
	souris: [
		{},
		async (page) => {
			await page.mouse.move(...(await middle(page, 'button')));
			await page.mouse.down();
		},
		(page) => page.mouse.up(),
		press,
	],
	doigt: [
		PHONE,
		async (page) => page.touchscreen.touchStart(...(await middle(page, 'button'))),
		(page) => page.touchscreen.touchEnd(),
		tap,
	],
	Espace: [
		{ key: 'Space' },
		(page) => page.keyboard.down('Space'),
		(page) => page.keyboard.up('Space'),
		(page) => page.keyboard.press('Space'),
	],
	Entrée: [
		{ key: 'Enter' },
		(page) => page.keyboard.down('Enter'),
		(page) => page.keyboard.up('Enter'),
		(page) => page.keyboard.press('Enter'),
	],
};

for (const [name, [{ key, ...options }, down, up, again]] of Object.entries(HOLDS)) {
	onPiece(`un arrêt gardé appuyé ne relance rien : ${name}`, options, async (page) => {
		if (key) await page.focus('[data-chrono] [data-button]');
		await again(page);
		await until(page, 'running');
		await wait(500);
		await down(page);
		await wait(1100);
		assert.equal((await read(page)).state, 'result');
		await up(page);
		await wait(300);
		assert.equal((await read(page)).state, 'result');
		// Et le geste suivant, normal, relance.
		await again(page);
		await until(page, 'running');
	});
}

onPiece('un départ dans les 400 ms qui suivent l’arrêt est ignoré', { reduced: true }, async (page) => {
	await at(page, 10_000);
	await start(page);
	await at(page, 15_000);
	await press(page);
	assert.equal((await read(page)).state, 'result');
	await at(page, 15_390);
	await press(page);
	assert.equal((await read(page)).state, 'result');
	await at(page, 15_410);
	await press(page);
	assert.equal((await read(page)).state, 'running');
});

onPiece('un arrêt dans les 400 ms qui suivent le départ est ignoré', { reduced: true }, async (page) => {
	await at(page, 10_000);
	await start(page);
	await at(page, 10_390);
	await press(page);
	assert.equal((await read(page)).state, 'running');
	await at(page, 10_410);
	await press(page);
	assert.equal((await read(page)).state, 'result');
});

onPiece('les gestes qui ne comptent pas', {}, async (page) => {
	const state = async () => (await read(page)).state;
	await press(page, 'button', { button: 'right' });
	await press(page, 'button', { button: 'middle' });
	await press(page, 'flaps');
	await press(page, 'tier');
	assert.equal(await state(), 'rest');
	await page.focus('[data-chrono] [data-button]');
	for (const key of ['a', 'ArrowDown', 'Escape']) await page.keyboard.press(key);
	await page.keyboard.down('Shift');
	await page.keyboard.press('Space');
	await page.keyboard.up('Shift');
	assert.equal(await state(), 'rest');
	await page.evaluate(() =>
		document.querySelector('[data-chrono]').scrollIntoView({ block: 'center', behavior: 'instant' }),
	);
	await start(page);
	await wait(500);
	await press(page, 'button', { button: 'right' });
	await press(page, 'flaps', { button: 'middle' });
	for (const key of ['a', 'Escape']) await page.keyboard.press(key);
	await page.keyboard.down('Shift');
	await page.keyboard.press('Space');
	await page.keyboard.press('Enter');
	await page.keyboard.up('Shift');
	assert.equal(await state(), 'running');
	await press(page);
	await until(page, 'result');
});

for (const key of ['Enter', 'Space']) {
	onPiece(`touche maintenue : ${key}`, {}, async (page) => {
		const state = async () => (await read(page)).state;
		await page.focus('[data-chrono] [data-button]');
		// Chaque `down` sans relachement est une repetition.
		for (let i = 0; i < 12; i += 1) {
			await page.keyboard.down(key);
			await wait(60);
		}
		assert.equal(await state(), key === 'Enter' ? 'running' : 'rest');
		await page.keyboard.up(key);
		await wait(500);
		assert.equal(await state(), 'running');
		await page.keyboard.press(key);
		await until(page, 'result');
	});
}

onPiece('Entrée maintenue après une interruption ne relance rien', {}, async (page) => {
	await page.focus('[data-chrono] [data-button]');
	await page.keyboard.down('Enter');
	await wait(100);
	await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
	await wait(450);
	await page.keyboard.down('Enter');
	assert.equal((await read(page)).state, 'rest');
	await page.keyboard.up('Enter');
});

onPiece('appui sur le bouton, relâché ailleurs', {}, async (page) => {
	await start(page);
	await wait(500);
	await page.mouse.move(...(await middle(page, 'button')));
	await page.mouse.down();
	await page.mouse.move(5, 5);
	await page.mouse.up();
	await until(page, 'result');
	await wait(450);
	await start(page);
});

// Le resultat.

const TIERS = [
	[123, 'À l’heure', 'On time', 'Masterclass', 'rgb(111, 240, 169)'],
	[-320, 'Dans les temps', 'Good service', '', 'rgb(245, 197, 24)'],
	[-750, 'Trafic perturbé', 'Disrupted', '', 'rgb(251, 146, 60)'],
	[1400, 'Supprimé', 'Cancelled', '', 'rgb(255, 107, 87)'],
];

for (const [path, lang] of [[FR, 'fr'], [EN, 'en']]) {
	onPiece(`les quatre mentions, ${lang}`, { path }, async (page) => {
		for (const [i, [gap, fr, en, praise, color]] of TIERS.entries()) {
			await round(page, gap, 10_000 + i * 20_000);
			const seen = await read(page);
			const tier = lang === 'fr' ? fr : en;
			assert.equal(seen.tier, tier);
			assert.equal(seen.color, color, tier);
			assert.equal(seen.praise, praise, tier);
			assert.equal(seen.gap, formatGap(gap, lang));
			assert.equal(seen.value, formatFlap(5000 + gap, lang));
			assert.ok(seen.spoken.startsWith(seen.value), seen.spoken);
			assert.ok(seen.spoken.replace("'", '’').includes(tier), seen.spoken);
		}
	});
}

onPiece('le roulement : les crans du jeu, en moins d’une seconde', {}, async (page) => {
	await at(page, 10_000);
	await start(page);
	await page.evaluate(() => {
		const flaps = [...document.querySelectorAll('[data-chrono] [data-char]')];
		window.steps = flaps.map(() => []);
		flaps.forEach((flap, i) =>
			new MutationObserver(() => window.steps[i].push(flap.dataset.char)).observe(flap, {
				attributeFilter: ['data-char'],
			}),
		);
		const root = document.querySelector('[data-chrono]');
		new MutationObserver(() => (window.steps.times ??= []).push(performance.now())).observe(root, {
			attributeFilter: ['data-state'],
		});
	});
	await at(page, 15_123);
	await page.mouse.move(...(await middle(page, 'button')));
	await page.mouse.down();
	const rolling = await read(page);
	assert.equal(rolling.state, 'rolling');
	assert.equal(rolling.tier, '');
	assert.ok((await page.evaluate(() => document.getAnimations().length)) > 0);
	await page.mouse.up();
	await until(page, 'result');
	const [from, to] = await page.evaluate(() => window.steps.times);
	assert.ok(to - from > 400 && to - from < 900, `${to - from} ms`);
	const steps = await page.evaluate(() => [...window.steps]);
	for (const [i, frames] of rollPlan('05,12').entries()) {
		if (frames.length > 1) assert.deepEqual(steps[i], frames, String(i));
	}
	assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
});

onPiece('mouvement réduit : le résultat tout de suite', { reduced: true }, async (page) => {
	await at(page, 10_000);
	await start(page);
	await at(page, 15_123);
	await page.mouse.move(...(await middle(page, 'button')));
	await page.mouse.down();
	const seen = await read(page);
	assert.equal(seen.state, 'result');
	assert.equal(seen.texts, '05,12');
	assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
	await page.mouse.up();
});

// La regle d'or.

const frame = (page) =>
	page.evaluate(() => JSON.stringify(document.querySelector('[data-chrono]').getBoundingClientRect()));

onPiece('rien ne bouge entre le départ et l’arrêt', {}, async (page) => {
	const box = await frame(page);
	await start(page);
	await wait(450);
	await page.evaluate(() => {
		window.changes = 0;
		window.moves = 0;
		new MutationObserver((list) => (window.changes += list.length)).observe(document, {
			attributes: true,
			childList: true,
			characterData: true,
			subtree: true,
		});
		const look = () => {
			window.moves += document.getAnimations().length;
			requestAnimationFrame(look);
		};
		look();
	});
	const shoot = () => page.screenshot({ encoding: 'base64' });
	const first = await shoot();
	await wait(900);
	assert.ok((await shoot()) === first, 'l’image a changé');
	assert.deepEqual(await page.evaluate(() => [window.changes, window.moves]), [0, 0]);
	assert.equal(await frame(page), box);
});

// Les interruptions.

const hide = (page) =>
	page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
		Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
		document.dispatchEvent(new Event('visibilitychange'));
	});

const leave = (page) =>
	page.evaluate(() => void dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));

async function interrupted(page) {
	const seen = await read(page);
	assert.equal(seen.state, 'rest');
	assert.equal(seen.texts, '04,96');
	assert.equal(seen.spoken, '04,96 Masterclass');
	assert.equal(seen.tier, 'Masterclass');
	assert.equal(seen.gap, '');
	assert.equal(seen.target, 'Manche interrompue');
	assert.equal(seen.live, 'Manche interrompue');
	assert.equal(seen.button, 'Jouer');
}

onPiece('onglet masqué : la manche s’interrompt, la suivante se joue', {}, async (page) => {
	const target = (await read(page)).target;
	assert.equal(target, `Cible${NBSP}: 5,00${NBSP}s`);
	await start(page);
	await wait(500);
	await hide(page);
	await interrupted(page);
	await wait(450);
	await start(page);
	assert.equal((await read(page)).target, target);
});

onPiece('page quittée puis retrouvée : la manche s’est interrompue', {}, async (page) => {
	await start(page);
	await page.evaluate(() => addEventListener('pageshow', (event) => (window.kept = event.persisted)));
	await page.goto(`${site.url}/contact/`);
	await page.goBack();
	await page.waitForFunction(() => document.querySelector('[data-chrono]'));
	if (await page.evaluate(() => window.kept)) await interrupted(page);
	else assert.equal((await read(page)).state, 'rest');
});

onPiece('page quittée : l’interruption n’attend pas l’onglet masqué', {}, async (page) => {
	await start(page);
	await leave(page);
	await interrupted(page);
});

onPiece(
	'trente secondes sans arrêt : la manche s’interrompt',
	{
		init: () => {
			const real = window.setTimeout;
			window.setTimeout = (run, delay, ...args) => real(run, delay === 30_000 ? 900 : delay, ...args);
		},
	},
	async (page) => {
		await start(page);
		await wait(500);
		assert.equal((await read(page)).state, 'running');
		await until(page, 'rest');
		await interrupted(page);
		// Un geste parti trop tard ne lance pas une manche.
		await press(page);
		assert.equal((await read(page)).state, 'rest');
		// Le delai d'une manche arretee n'interrompt pas la suivante.
		await wait(450);
		await start(page);
		await wait(450);
		await press(page);
		await until(page, 'result');
		await press(page);
		await wait(450);
		const { state } = await read(page);
		assert.equal(state, 'running');
	},
);

for (const type of ['onglet masqué', 'page quittée']) {
	onPiece(`${type} pendant le roulement : le résultat est complet`, {}, async (page) => {
		await at(page, 10_000);
		await start(page);
		await at(page, 15_123);
		await page.mouse.move(...(await middle(page, 'button')));
		await page.mouse.down();
		assert.equal((await read(page)).state, 'rolling');
		await (type === 'onglet masqué' ? hide : leave)(page);
		const seen = await read(page);
		assert.equal(seen.state, 'result');
		assert.equal(seen.texts, '05,12');
		assert.equal(seen.tier, 'À l’heure');
		await wait(700);
		assert.equal((await read(page)).texts, '05,12');
		assert.equal((await page.evaluate(() => window.said)).length, 2);
		await page.mouse.up();
	});
}

// Lecteur d'ecran, focus, lien.

onPiece('les annonces : le départ, puis le résultat d’un bloc', {}, async (page) => {
	assert.equal((await read(page)).name, 'Jouer, cible 5 secondes');
	const rounds = [
		[123, '5,12 secondes, 0,12 seconde en retard. À l’heure, Masterclass.'],
		[-750, '4,25 secondes, 0,75 seconde en avance. Trafic perturbé.'],
		[2, '5,00 secondes, pile sur la cible. À l’heure, Masterclass.'],
	];
	for (const [i, [gap, sentence]] of rounds.entries()) {
		await page.evaluate(() => void (window.said.length = 0));
		await round(page, gap, 10_000 + i * 20_000);
		const said = await page.evaluate(() => window.said);
		assert.deepEqual(said.map((s) => s.replace("'", '’')), ['Chrono lancé', sentence]);
	}
	assert.equal((await read(page)).name, 'Rejouer, cible 5 secondes');
});

onPiece('les annonces en anglais', { path: EN }, async (page) => {
	assert.equal((await read(page)).name, 'Play, target 5 seconds');
	await round(page, -320);
	const said = await page.evaluate(() => window.said);
	assert.deepEqual(said, ['Timer running', '4.68 seconds, 0.32 seconds early. Good service.']);
});

onPiece('le focus reste sur le bouton', {}, async (page) => {
	await start(page);
	assert.equal((await read(page)).focused, true);
	await wait(500);
	await press(page, 'flaps');
	assert.equal((await read(page)).focused, true, 'arrêt sur les palettes');
	await until(page, 'result');
	assert.equal((await read(page)).focused, true);
	await page.keyboard.press('Enter');
	await until(page, 'running');
	await wait(500);
	await page.keyboard.press('Space');
	await until(page, 'result');
	assert.equal((await read(page)).focused, true);
});

onPiece('la pièce ne fait rien toute seule', {}, async (page) => {
	assert.equal((await read(page)).focused, false);
	assert.deepEqual(await page.evaluate(() => window.said), []);
	assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
});

onPiece('le lien vers le jeu paraît après la première manche, et reste', {}, async (page) => {
	assert.equal((await read(page)).link, false);
	await start(page);
	assert.equal((await read(page)).link, false);
	await wait(500);
	await press(page);
	await until(page, 'result');
	assert.equal((await read(page)).link, true);
	const link = await page.$eval('[data-chrono] [data-link]', (a) => [a.href, a.textContent.trim()]);
	assert.deepEqual(link, ['https://www.chronopotes.fr/', 'Jouer sur chronopotes.fr']);
	await start(page);
	assert.equal((await read(page)).link, true);
});

onPiece('sans JavaScript : l’exemple seul', { js: false }, async (page) => {
	const shown = await page.evaluate(() =>
		['play', 'target', 'button', 'link'].filter((name) =>
			document.querySelector(`[data-${name}]`)?.checkVisibility({ visibilityProperty: true }),
		),
	);
	assert.deepEqual(shown, []);
	assert.equal(
		await page.evaluate(() => document.querySelector('[data-play]')?.getBoundingClientRect().height ?? 0),
		0,
	);
	assert.equal(
		await page.evaluate(() => document.querySelector('.specimen [role="img"]').getAttribute('aria-label')),
		'04,96 Masterclass',
	);
});

// La mise en page : tout tient, et rien ne saute d'un etat a l'autre.

const LAYOUTS = [
	[1440, 100],
	[375, 100],
	[320, 100],
	[375, 200],
];

const measure = (page) =>
	page.evaluate(() => {
		const root = document.querySelector('[data-chrono]');
		const box = (el) => el.getBoundingClientRect();
		const board = box(root.querySelector('[data-board]'));
		const textBox = (el) => {
			const range = document.createRange();
			range.selectNodeContents(el);
			return range.getBoundingClientRect();
		};
		const inside = ['tier', 'praise', 'gap']
			.map((name) => textBox(root.querySelector(`[data-${name}]`)))
			.concat([...root.querySelectorAll('[data-char]')].map(box))
			.filter((b) => b.width > 0);
		const overlaps = inside.filter((a, i) =>
			inside.some(
				(b, j) => j > i && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1,
			),
		).length;
		return {
			height: box(root).height,
			board: [board.width, board.height],
			out: inside.filter((b) => b.left < board.left || b.right > board.right + 0.5 || b.top < board.top - 0.5 || b.bottom > board.bottom + 0.5).length,
			overlaps,
			// Le bord gauche de la mention et du premier texte sous elle.
			indent: ['tier', root.querySelector('[data-praise]').textContent ? 'praise' : 'gap']
				.map((name) => textBox(root.querySelector(`[data-${name}]`)))
				.reduce((left, b) => Math.max(left, b.width > 0 ? b.left - board.left : 0), 0),
			wide: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			button: [box(root.querySelector('[data-button]')).width, box(root.querySelector('[data-button]')).height],
			link: box(root.querySelector('[data-link]')).height,
			clipped: [...root.querySelectorAll('[data-button], [data-link], [data-target]')].filter(
				(el) => el.scrollWidth > el.clientWidth + 1 || box(el).right > document.documentElement.clientWidth,
			).length,
		};
	});

for (const [width, zoom] of LAYOUTS) {
	for (const path of [FR, EN]) {
		onPiece(`mise en page ${width} px, texte à ${zoom} %, ${path}`, { path, width, height: 1000 }, async (page) => {
			await page.evaluate((z) => void (document.documentElement.style.fontSize = `${z}%`), zoom);
			await page.evaluate(() => document.fonts.ready.then(() => {}));
			await page.evaluate(() =>
				document.querySelector('[data-chrono]').scrollIntoView({ block: 'center', behavior: 'instant' }),
			);
			const rest = await measure(page);
			const check = async (state) => {
				const seen = await measure(page);
				assert.deepEqual([seen.out, seen.overlaps, seen.wide, seen.clipped], [0, 0, 0, 0], state);
				assert.ok(Math.abs(seen.height - rest.height) <= 1, `${state} : ${rest.height} puis ${seen.height}`);
				for (const i of [0, 1]) {
					assert.ok(Math.abs(seen.board[i] - rest.board[i]) <= 1, `${state} : ${rest.board} puis ${seen.board}`);
					assert.ok(Math.abs(seen.button[i] - rest.button[i]) <= 1, `${state} : ${rest.button} puis ${seen.button}`);
				}
				assert.ok(seen.button[1] >= 44 && seen.link >= 44, state);
			};
			await check('rest');
			await at(page, 10_000);
			await start(page);
			await check('running');
			for (const [i, gap] of [123, -320, -750, 1400, 24_900].entries()) {
				const from = 10_000 + i * 60_000;
				if (i > 0) {
					await at(page, from);
					await start(page);
				}
				await at(page, from + 5000 + gap);
				await press(page);
				if ((await read(page)).state === 'rolling') await check('rolling');
				await until(page, 'result');
				await check(`result ${gap}`);
				assert.ok(Math.abs((await measure(page)).indent - rest.indent) <= 1, `${gap} : la mention et l’écart s’alignent`);
			}
			await at(page, 900_000);
			await start(page);
			await leave(page);
			await check('interrompue');
		});
	}
}

test('Seenit garde sa pièce, sans jeu', async () => {
	const page = await site.visit('/work/seenit/');
	assert.deepEqual(page.errors, []);
	assert.equal(await page.$('[data-chrono]'), null);
	assert.ok(await page.$('.ticket'));
	await page.close();
});
