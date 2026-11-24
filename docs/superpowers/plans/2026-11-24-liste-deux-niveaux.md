# Liste des projets à deux niveaux : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Montrer ChronoPotes, Seenit et BluePoint en grand sur la liste et l'accueil, et les trois projets du BUT en une rangée compacte.

**Architecture:** Un champ de contenu obligatoire `level` sépare les projets ; une fonction pure les répartit sans changer leur ordre. `ProjectTile` et `ProjectFrame` reçoivent une taille (`card`, `wide`, `small`) à la place du booléen `featured`. Les rangées s'alignent par `subgrid`, dans `global.css`.

**Tech Stack:** Astro 5 statique, CSS (grid, subgrid), `node --test`, Puppeteer (`tests/browser.mjs`).

**Spec:** `docs/superpowers/specs/2026-11-24-liste-deux-niveaux-design.md`

## Global Constraints

- Branche `liste-deux-niveaux`. Ne jamais pousser (`release` déploie). Commits en français, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Aucun JavaScript client ajouté.
- Parité FR/EN ; libellés dans `src/i18n/ui.ts` : « Projets de BUT », « University projects ».
- Titre de vignette `aria-hidden`, capture `alt=""`, un seul lien par vignette.
- Pas de tiret long (U+2014), de capitales espacées, de point médian, de flèche, d'ombre, de pastille, d'alternance gauche/droite.
- Seuils : 50em (colonnes de l'accueil et de la rangée du BUT), 64em (cartel d'un phare à côté).
- Piège : `.project-frame` porte aussi la classe `tile` (sa variante). Viser le lien par `a.tile`.
- Après chaque tâche : `npm run check`, puis `npm run build:fast && npm test`.

## Review Focus

1. **Largeurs exactes des seuils** (799, 800, 1023, 1024 px) : pas de vignette seule, pas de débordement. Tests en tâche 2 et 3.
2. **Textes anglais et cartel de BluePoint** à 1024 px : le cartel à côté ne dépasse pas son cadre. Test en tâche 2 (FR et EN).
3. **Texte agrandi à 200 %** à 820 px : aucun titre ne déborde de son cadre dans la rangée du BUT. Test en tâche 2.
4. **Un quatrième phare** : l'accueil fait deux rangées de deux, sans vignette étalée. Test en tâche 3 (vignette clonée).
5. **Navigateur sans `subgrid`** : la page garde l'ancienne mise en page, sans superposition. Test en tâche 2 (règles sous `@supports`).

---

### Task 1: Le niveau d'un projet

**Files:**
- Create: `src/data/levels.ts`
- Modify: `src/content.config.ts` (`workSchema`), `src/data/work.ts` (`listStructuralGaps`), les douze fichiers de `src/content/work/` et `src/content/work-en/`
- Test: `tests/levels.test.mjs` (nouveau)

**Interfaces:**
- Produces, dans `src/data/levels.ts` (n'importe rien d'Astro) :
  - `projectLevels = ['featured', 'university'] as const`, `type ProjectLevel`
  - `byLevel<T extends { data: { level: ProjectLevel } }>(entries: T[]): Record<ProjectLevel, T[]>`, ordre conservé, les deux clés toujours présentes.
- Champ de contenu `level`, obligatoire, sous `title`.

- [ ] **Step 1: Écrire les tests qui échouent**

```js
const entry = (id, level) => ({ id, data: { level } });
const ids = (list) => list.map((e) => e.id);

test('les projets se répartissent sans changer d’ordre', () => {
	const groups = byLevel([entry('a', 'featured'), entry('b', 'university'), entry('c', 'featured')]);
	assert.deepEqual(ids(groups.featured), ['a', 'c']);
	assert.deepEqual(ids(groups.university), ['b']);
	assert.deepEqual(byLevel([]), { featured: [], university: [] });
});

// Le contenu : memes niveaux dans les deux langues, sur les fichiers eux-memes.
test('chaque projet a son niveau, identique en français et en anglais', () => {
	const expected = {
		chronopotes: 'featured',
		seenit: 'featured',
		'bluepoint-waste-identifier': 'featured',
		'projet-chat': 'university',
		boardpxl: 'university',
		'covoit-etud': 'university',
	};
	for (const dir of ['work', 'work-en']) {
		for (const [slug, level] of Object.entries(expected)) {
			const file = readFileSync(new URL(`../src/content/${dir}/${slug}.md`, import.meta.url), 'utf8');
			assert.equal(file.match(/^level: (\w+)\r?$/m)?.[1], level, `${dir}/${slug}`);
		}
	}
});
```

- [ ] **Step 2: Constater l'échec** : `node --test tests/levels.test.mjs`. Expected: FAIL, module absent.
- [ ] **Step 3: Implémenter** `levels.ts`, le champ `level: z.enum(projectLevels)` dans le schéma, l'écart `'niveau différent'` dans `listStructuralGaps`, et `level:` dans les douze fichiers selon le tableau du test.
- [ ] **Step 4: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe.
- [ ] **Step 5: Vérifier les deux garde-fous du build** : retirer `level` de `work/seenit.md`, puis le mettre à `university` en français seulement, en lançant `npm run build:fast` à chaque fois. Expected: échec nommant `seenit` et `level`, puis échec nommant `seenit (niveau différent)`. Remettre le fichier, `git diff` vide hors ajouts prévus.
- [ ] **Step 6: Commit** : « Contenu : un niveau pour chaque projet »

---

### Task 2: La liste à deux niveaux

**Files:**
- Modify: `src/components/pages/WorkListPage.astro`, `src/components/work/ProjectTile.astro`, `src/components/work/ProjectFrame.astro`, `src/components/pages/HomePage.astro` (props), `src/styles/global.css`, `src/i18n/ui.ts`
- Test: `tests/list.test.mjs`, `tests/list.browser.test.mjs` (nouveaux), `tests/tiles.test.mjs`

**Interfaces:**
- Consumes: `byLevel`.
- Produces :
  - `ProjectTile` et `ProjectFrame` : prop `size?: 'card' | 'wide' | 'small'` (défaut `card`), à la place de `featured`. `ProjectTile` rend `<a class="tile wide">`, etc.
  - Classes `.tiles` (base), `.tiles--pair` (accueil), `.tiles--three` (BUT), `.tiles--wide` (phares) dans `global.css`.
  - Clé `work.group.university`.

- [ ] **Step 1: Écrire les tests qui échouent**

`tests/list.test.mjs` :

```js
const slugs = (html) => [...html.matchAll(/<a[^>]*class="tile[^>]*href="[^"]*\/([^"/]+)"/g)].map((m) => m[1]);
const group = (route, name) => chunk(page(route), `class="tiles tiles--${name}`, '</ul>');

for (const [route, title] of [['/work/', 'Projets de BUT'], ['/en/work/', 'University projects']]) {
	test(`deux niveaux sur ${route}`, () => {
		assert.deepEqual(slugs(group(route, 'wide')), ['chronopotes', 'seenit', 'bluepoint-waste-identifier']);
		assert.deepEqual(slugs(group(route, 'three')), ['projet-chat', 'boardpxl', 'covoit-etud']);
		assert.match(page(route), new RegExp(`<h2[^>]*>\\s*${title}\\s*</h2>`));
		assert.equal((group(route, 'wide').match(/cartel-desc/g) ?? []).length, 3);
		assert.doesNotMatch(group(route, 'three'), /cartel-desc/);
	});
}

test('les rangées alignées demandent subgrid, sans quoi l’ancienne mise en page reste', () => {
	const css = pageCss('/work/');
	assert.match(css, /@supports\s*\(grid-template-rows:\s*subgrid\)/);
});
```

`tests/list.browser.test.mjs`, page `/work/` et `/en/work/` :

| Test | Assertions |
|---|---|
| à 1440, 1100, 1024, 1023, 900, 820, 800, 799, 375 px | pas de défilement horizontal (`scrollWidth <= innerWidth`) ; les trois cadres larges ont la même largeur |
| phares à 1440, 1100, 1024 | cartel à droite du cadre, bas alignés à 1 px près, cartel pas plus haut que son cadre ; cadre à 1440 : 648 px |
| phares à 1023, 820, 375 | cartel sous le cadre ; cadre sur toute la largeur du contenu |
| aucun cadre de phare étiré, à toutes ces largeurs | bas de la capture + marge intérieure + liseré = bas du cadre, à 1 px près |
| rangée du BUT à 1440, 1024, 820, 800 | trois vignettes sur une rangée ; cadres de même hauteur ; bas des captures alignés ; hauts des cartels alignés |
| rangée du BUT à 799, 375 | une colonne, même ordre |
| texte à 200 % à 820 px | `scrollWidth <= clientWidth` pour chaque `.frame-title` |
| images | à 1440 (1x), `currentSrc` de chaque capture : largeur naturelle entre 1 et 1,7 fois la largeur affichée |
| groupe du BUT plus loin | à 1440, distance entre les deux listes plus grande que celle entre deux phares |

Dans `tests/tiles.test.mjs`, le test « l'étiquette du projet mis en avant » vise `.wide` au lieu de `.featured`.

- [ ] **Step 2: Constater l'échec** : `npm run build:fast && node --test tests/list.test.mjs tests/list.browser.test.mjs`. Expected: FAIL, `tiles--wide` introuvable.
- [ ] **Step 3: Tailles.** Remplacer `featured` par `size`. `sizes` : `card` `(min-width: 50em) 31rem, 100vw` ; `wide` `(min-width: 64em) 38rem, (min-width: 50em) calc(100vw - 9rem), 100vw` ; `small` `(min-width: 50em) 19rem, 100vw`. `widths` des vignettes : `[320, 480, 640, 800, 1200]`.
- [ ] **Step 4: Page.** `WorkListPage` : `<ul class="tiles tiles--wide">` des phares (`size="wide"`, description), puis `<section>` avec `<h2>` et `<ul class="tiles tiles--three">` (`size="small"`, sans description). `h2` en `--step-3`.
- [ ] **Step 5: Styles.** La grille 3fr/2fr de `ProjectTile` passe à 64em, cadre et cartel en `align-self: end`. Dans `global.css`, `.tiles--three` a trois colonnes `minmax(0, 1fr)` à 50em ; sous `@supports (grid-template-rows: subgrid)`, chaque `li` et son `a.tile` prennent deux rangées en `subgrid` avec `row-gap: 1rem`. Dans `ProjectFrame`, `.tile > :is(picture, img) { margin-top: auto; }` colle la capture au bas du cadre ; `.frame-title` gagne `overflow-wrap: anywhere`.
- [ ] **Step 6: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe.
- [ ] **Step 7: Commit** : « Liste des projets : trois phares en grand, les projets de BUT en rangée »

---

### Task 3: L'accueil

**Files:**
- Modify: `src/components/pages/HomePage.astro`, `src/styles/global.css`
- Test: `tests/home.test.mjs`, `tests/list.browser.test.mjs`

**Interfaces:**
- Consumes: `byLevel`, `.tiles--pair`.

- [ ] **Step 1: Écrire les tests qui échouent.** `tests/home.test.mjs` : « quatre vignettes » devient :

```js
test('les trois phares puis un lien vers tous les projets', () => {
	for (const route of ['/', '/en/']) {
		const tiles = chunk(page(route), 'class="tiles tiles--pair', '</ul>');
		assert.equal(tiles.match(/<a[^>]*class="tile[" ]/g).length, 3);
		assert.doesNotMatch(tiles, /projet-chat|cartel-desc/);
	}
	assert.match(page('/'), /href="\/work\/"[^>]*>\s*Voir tous les projets\s*</);
});
```

`tests/list.browser.test.mjs`, page `/` :

| Test | Assertions |
|---|---|
| à 1440, 1024, 820, 800 | les trois cadres ont la même largeur ; ChronoPotes et Seenit sur une rangée, cadres de même hauteur, bas des captures alignés ; cartel de BluePoint à droite de son cadre, dans la seconde colonne, bas alignés |
| à 799, 375 | une colonne, cartels sous les cadres |
| quatrième phare (premier `li` cloné en fin de liste) à 1440 | deux rangées de deux, quatre cadres de même largeur, quatrième cartel sous son cadre |
| à toutes ces largeurs | pas de défilement horizontal |

- [ ] **Step 2: Constater l'échec** : `npm run build:fast && node --test tests/home.test.mjs tests/list.browser.test.mjs`. Expected: FAIL, quatre vignettes.
- [ ] **Step 3: Implémenter.** `HomePage` prend `byLevel(…).featured` dans `<ul class="tiles tiles--pair">`. Dans `global.css`, `.tiles--pair` a deux colonnes à 50em, les mêmes rangées en `subgrid` que la tâche 2 ; `.tiles--pair > li:last-child:nth-child(odd)` occupe la rangée et son `a.tile` passe en grille de deux colonnes égales (même écart que la liste), cadre et cartel au pied. La règle de base `.tiles` ne fixe plus de colonnes.
- [ ] **Step 4: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe.
- [ ] **Step 5: Commit** : « Accueil : les trois projets phares »

---

### Task 4: Revue à l'œil et suivi

**Files:**
- Modify: `docs/AMELIORATIONS.md` (P6, point 5), et les styles que la revue corrige

- [ ] **Step 1: Captures** de `/work/`, `/en/work/` et `/` à 1440, 1024, 820 et 375 px, plus le focus clavier sur une vignette de chaque taille. Juger : équilibre des deux niveaux, distance avant « Projets de BUT », lisibilité des petites captures, cartel de BluePoint.
- [ ] **Step 2: Corriger** ce que la revue montre, un test d'abord quand le défaut se mesure.
- [ ] **Step 3: Cocher le point 5** dans `docs/AMELIORATIONS.md`, une phrase sur ce qui a été fait.
- [ ] **Step 4: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe ; `git diff release -- src tests | LC_ALL=C.UTF-8 grep -cP '^\+.*\x{2014}'` vaut 0.
- [ ] **Step 5: Commit** : « Liste à deux niveaux : ajustements après revue, point 5 de P6 fait »
