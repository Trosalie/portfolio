# Cadres, vignettes mobiles et fiche projet : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Donner un cadre d'identité aux six projets, une vignette recadrée lisible sur téléphone, et une page projet qui ouvre sur une fiche et se termine par « Projet suivant ».

**Architecture:** Le champ `identity` garde le cadre et rend le nuancier (palette, polices, pièce) facultatif mais entier ; `ProjectFrame.astro` reste le seul endroit qui sait dessiner un cadre et gagne une variante `band` pour le lien « Projet suivant ». Le recadrage mobile est un second fichier image par projet, servi par une `<source media>` dans la vignette. La fiche est un composant à part, posé par `ProjectHero.astro` dans une grille à deux colonnes à partir de 50em.

**Tech Stack:** Astro 5 (sortie statique, `astro:assets`), TypeScript, `@fontsource`, sharp (script de découpe), `node --test` sur `dist/`.

**Spec:** `docs/superpowers/specs/2026-11-21-vitrine-cadres-mobile-fiche-design.md`

## Global Constraints

- Branche `vitrine-cadres-mobile-fiche`. Ne jamais pousser (`release` déploie). Un commit par tâche, message en français, terminé par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Aucun JavaScript client ajouté.
- Parité FR/EN : codes couleur, style de titre et recadrage identiques dans `src/content/work/` et `src/content/work-en/` ; tout libellé dans `src/i18n/ui.ts`.
- Polices : `@fontsource`, sous-ensemble latin, une graisse par usage, importées par le seul composant qui s'en sert. Aucune requête vers `fonts.googleapis.com` (déjà vérifié par `tests/foundations.test.mjs`).
- Pas de tiret long (U+2014) dans un texte visible ; pas de flèche, de capitales espacées sur un libellé, d'ombre, de pastille ni de point médian.
- Le titre d'une vignette reste `aria-hidden="true"`, la capture d'une vignette garde `alt=""`.
- Vérification après chaque tâche : `npm run check`, puis `npm run build:fast && npm test` (Node 22.18+). Les tests lisent `dist/` : toujours reconstruire avant `npm test`.
- Revue visuelle : `npx astro preview --port 4399` après le build, captures Puppeteer à 1440×900 et 375×812 (`isMobile`, `deviceScaleFactor: 2`) avec le script de `scratchpad/shots.mjs` (à copier temporairement à la racine du dépôt pour résoudre `puppeteer`, puis supprimer).

## Review Focus

1. **Titre long dans le bandeau à 375 px** (« BluePoint WasteIdentifier », « Multi-Channel Chat Project » en capitales) : il passe à la ligne sans déborder du cadre. Test en tâche 5 (`overflow-wrap: anywhere` sur le titre du bandeau).
2. **Focus clavier sur un lien qui enveloppe des blocs** : un `<a>` en ligne autour d'un cadre dessine un contour en morceaux ; le lien « Projet suivant » doit être un bloc pour que l'anneau entoure libellé et cadre. Test en tâche 5 (`.next-project` en `display: block` ou `flex`).
3. **Largeurs entre 50em et 60em** : la fiche ne doit pas écraser le titre et la description. Colonne de gauche en `minmax(0, 1fr)`, fiche bornée ; test en tâche 4 et capture à 800 px.
4. **Page anglaise** : « Next project » mène vers `/en/work/…` avec le titre anglais (« Multi-Channel Chat Project », pas « Projet Chat Multi-Channels »). Test en tâche 5.
5. **Projet futur sans identité** : il garde le cadre encre et n'affiche pas « Identité visuelle » ; un cadre seul n'affiche pas de nuancier. Tests en tâches 1 et 2.

---

### Task 1: Un cadre sans nuancier

**Files:**
- Modify: `src/data/identity.ts`
- Modify: `src/content.config.ts:36-46` (`identitySchema`)
- Modify: `src/components/project/IdentitySpecimen.astro` (type de `identity`)
- Modify: `src/layouts/ProjectLayout.astro:59-65` (condition du nuancier)
- Test: `tests/identity.test.mjs`, `tests/project.test.mjs`

**Interfaces:**
- Produces, dans `src/data/identity.ts` :
  - `interface FrameStyle { background: string; border?: string; titleColor: string; titleStyle: (typeof titleStyles)[number] }`
  - `interface ProjectSpecimen { palette: { name: string; hex: string }[]; fonts: { family: (typeof specimenFonts)[number]; role: string }[]; specimen: (typeof specimens)[number] }`
  - `interface ProjectIdentity extends Partial<ProjectSpecimen> { frame: FrameStyle }`
  - `hasSpecimen(identity: ProjectIdentity | undefined): identity is ProjectIdentity & ProjectSpecimen` (vrai si les trois champs sont présents)
  - `isPartialSpecimen(identity: Partial<ProjectSpecimen>): boolean` (vrai si un ou deux des trois champs seulement sont présents)
  - `identityGaps(fr, en)` garde sa signature ; nouveau message `'nuancier présent dans une seule langue'`.

- [ ] **Step 1: Écrire les tests qui échouent** dans `tests/identity.test.mjs` (importer aussi `hasSpecimen`, `isPartialSpecimen`) :

```js
const frameOnly = { frame: { background: '#1F1F1F', titleColor: '#338CD2', titleStyle: 'site' } };

test('un cadre seul, identique dans les deux langues : aucun écart', () => {
	assert.deepEqual(identityGaps(frameOnly, structuredClone(frameOnly)), []);
});

test('un cadre seul qui diffère entre les langues', () => {
	const en = structuredClone(frameOnly);
	en.frame.titleColor = '#338CD3';
	assert.deepEqual(identityGaps(frameOnly, en), ['cadre différent']);
});

test('un nuancier dans une seule langue', () => {
	const fr = { ...structuredClone(base), frame: structuredClone(frameOnly.frame) };
	assert.deepEqual(identityGaps(fr, frameOnly), ['nuancier présent dans une seule langue']);
	assert.deepEqual(identityGaps(frameOnly, fr), ['nuancier présent dans une seule langue']);
});

test('le nuancier est entier ou absent', () => {
	assert.equal(hasSpecimen(base), true);
	assert.equal(hasSpecimen(frameOnly), false);
	assert.equal(hasSpecimen(undefined), false);
	assert.equal(isPartialSpecimen(base), false);
	assert.equal(isPartialSpecimen(frameOnly), false);
	const { specimen, ...partial } = base;
	assert.equal(isPartialSpecimen(partial), true);
});
```

Et dans `tests/project.test.mjs`, à côté de « pas de nuancier pour un projet sans identité » :

```js
test('le nuancier dépend du nuancier, pas du cadre', () => {
	const layout = srcFiles(['.astro']).find((f) => f.path.endsWith('layouts/ProjectLayout.astro')).content;
	assert.match(layout, /hasSpecimen\(entry\.data\.identity\)/);
});
```

- [ ] **Step 2: Lancer les tests, constater l'échec**

Run: `node --test tests/identity.test.mjs`
Expected: FAIL, `hasSpecimen` n'est pas exporté.

- [ ] **Step 3: Implémenter** les types et fonctions ci-dessus dans `src/data/identity.ts`. Dans `identityGaps`, après la comparaison du cadre : si `hasSpecimen` diffère entre les langues, pousser `'nuancier présent dans une seule langue'` et s'arrêter là ; si les deux en ont un, garder les comparaisons actuelles (palette, polices, pièce). Le module ne doit toujours rien importer d'Astro et rester lisible par la suppression de types de Node (pas d'`enum`).

- [ ] **Step 4: Adapter le schéma, le nuancier et la page.** `identitySchema` : `palette`, `fonts`, `specimen` deviennent `.optional()` avec les mêmes bornes, et l'objet reçoit un `.superRefine` qui ajoute une erreur (chemin `['specimen']`, message « Le nuancier (palette, fonts, specimen) se déclare en entier ou pas du tout. ») quand `isPartialSpecimen` est vrai. `IdentitySpecimen.astro` type sa prop `identity: ProjectSpecimen`. `ProjectLayout.astro` affiche la section si `hasSpecimen(entry.data.identity)` et passe `entry.data.identity` au nuancier.

- [ ] **Step 5: Vérifier**

Run: `npm run check && npm run build:fast && npm test`
Expected: 0 erreur, tous les tests passent (Seenit et ChronoPotes ont toujours leur nuancier).

- [ ] **Step 6: Commit**

```bash
git add src/data/identity.ts src/content.config.ts src/components/project/IdentitySpecimen.astro src/layouts/ProjectLayout.astro tests/identity.test.mjs tests/project.test.mjs
git commit -m "Identité : un cadre peut exister sans nuancier"
```

---

### Task 2: Les quatre nouveaux cadres

**Files:**
- Modify: `package.json`, `package-lock.json` (`npm install @fontsource/jost`)
- Modify: `src/data/identity.ts` (`titleStyles`)
- Modify: `src/components/work/ProjectFrame.astro` (imports de polices, classes de titre)
- Modify: `src/content/work/{boardpxl,covoit-etud,bluepoint-waste-identifier,projet-chat}.md` et les quatre mêmes dans `src/content/work-en/`
- Test: `tests/tiles.test.mjs`

**Interfaces:**
- Consumes: `FrameStyle`, `ProjectIdentity` (tâche 1).
- Produces: `titleStyles = ['oswald-caps', 'playfair-italic', 'site', 'jost-caps', 'dm-mono'] as const` ; classes `title--jost-caps` et `title--dm-mono` dans `ProjectFrame.astro`, utilisées aussi par la variante `band` (tâche 5).

- [ ] **Step 1: Écrire les tests qui échouent** dans `tests/tiles.test.mjs`. Remplacer « un projet sans identité prend le cadre encre » par :

```js
const frameOf = (slug) => {
	const html = tile('/work/', slug);
	const style = html.match(/style="([^"]*--frame-bg[^"]*)"/)[1];
	const value = (name) => style.match(new RegExp(`--${name}:\\s*([^;]+)`))[1].trim();
	return { html, bg: value('frame-bg'), border: value('frame-border'), title: value('frame-title') };
};

test('les six projets sont dans leur identité', () => {
	for (const slug of ['chronopotes', 'seenit', 'bluepoint-waste-identifier', 'projet-chat', 'boardpxl', 'covoit-etud']) {
		assert.match(tile('/work/', slug), /data-frame="identity"/, slug);
	}
	const sport = frameOf('boardpxl');
	assert.equal(sport.bg.toUpperCase(), '#E8EAF6');
	assert.equal(sport.border.toUpperCase(), '#FA8624');
	assert.match(sport.html, /title--jost-caps/);
	const covoit = frameOf('covoit-etud');
	assert.equal(covoit.bg.toUpperCase(), '#ABC4FF');
	assert.equal(covoit.title.toUpperCase(), '#31429A');
	assert.doesNotMatch(covoit.html, /\bbordered\b/);
	assert.match(covoit.html, /title--site/);
	const blue = frameOf('bluepoint-waste-identifier');
	assert.equal(blue.bg.toUpperCase(), '#1F1F1F');
	assert.equal(blue.title.toUpperCase(), '#338CD2');
	const chat = frameOf('projet-chat');
	assert.equal(chat.border.toUpperCase(), '#3C3F47');
	assert.match(chat.html, /title--dm-mono/);
});

test('le cadre encre reste le repli d’un projet sans identité', () => {
	const frame = srcFiles(['.astro']).find((f) => f.path.endsWith('work/ProjectFrame.astro')).content;
	assert.match(frame, /'var\(--ink\)'/);
	assert.match(frame, /'identity' : 'ink'/);
});

test('le titre de chaque cadre atteint 4,5:1 sur son fond', () => {
	assert.equal(contrast('#000000', '#FFFFFF').toFixed(1), '21.0');
	assert.ok(contrast('#4357BD', '#ABC4FF') < 4.5);
	for (const slug of ['chronopotes', 'seenit', 'bluepoint-waste-identifier', 'projet-chat', 'boardpxl', 'covoit-etud']) {
		const { bg, title } = frameOf(slug);
		assert.ok(contrast(title, bg) >= 4.5, `${slug} : ${contrast(title, bg).toFixed(2)}:1`);
	}
});

test('Jost est servie par le site, pas par Google Fonts', () => {
	assert.match(pageCss('/work/'), /font-family:\s*["']?Jost["']?[^}]*jost-latin-500-normal[^)]*\.woff2/);
});
```

`contrast(a, b)` est défini en tête du fichier de test : rapport de contraste WCAG 2 (luminance relative de chaque couleur, `(L1 + 0,05) / (L2 + 0,05)`).

- [ ] **Step 2: Lancer les tests, constater l'échec**

Run: `npm run build:fast && node --test tests/tiles.test.mjs`
Expected: FAIL sur « les six projets » (BluePoint a `data-frame="ink"`) et sur Jost.

- [ ] **Step 3: Installer Jost et étendre les styles.** `npm install @fontsource/jost` (5.x, OFL). Dans `ProjectFrame.astro`, importer `@fontsource/jost/latin-500.css` et `@fontsource/dm-mono/latin-500.css` à côté des deux imports existants, et ajouter :
  - `.title--jost-caps` : `'Jost', sans-serif`, 500, `text-transform: uppercase`, `letter-spacing: 0.04em` ;
  - `.title--dm-mono` : `'DM Mono', monospace`, 500.
  `site` existe déjà en CSS ; il suffit de l'ajouter à `titleStyles`.

- [ ] **Step 4: Déclarer les quatre cadres**, dans les deux langues, sous `team:` (ou `context:` pour Projet Chat), au format de Seenit :

| Fichier | `background` | `border` | `titleColor` | `titleStyle` |
|---|---|---|---|---|
| `boardpxl.md` | `"#E8EAF6"` | `"#FA8624"` | `"#0A2D44"` | `jost-caps` |
| `covoit-etud.md` | `"#ABC4FF"` | aucun | `"#31429A"` | `site` |
| `bluepoint-waste-identifier.md` | `"#1F1F1F"` | aucun | `"#338CD2"` | `site` |
| `projet-chat.md` | `"#17181C"` | `"#3C3F47"` | `"#81B07A"` | `dm-mono` |

- [ ] **Step 5: Vérifier les tests**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout passe ; le build échouerait si une langue différait (`identityGaps`).

- [ ] **Step 6: Revue visuelle** de `/work/` et `/` à 1440 et 375. Juger : le liseré orange de SportPXL (s'il crie, passer `border` à `"#0A2D44"` dans les deux langues et dans le test) ; le cadre pervenche de Covoit'Etud sur le mur sans liseré (s'il se perd, ajouter `border: "#31429A"` et adapter le test) ; la lisibilité du titre BluePoint (4,6:1). Noter les décisions dans le message de commit.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/data/identity.ts src/components/work/ProjectFrame.astro src/content tests/tiles.test.mjs
git commit -m "Cadres d'identité pour SportPXL, Covoit'Etud, BluePoint et Projet Chat"
```

---

### Task 3: Vignettes recadrées sur mobile et titre de l'accueil

**Files:**
- Create: `scripts/crop-mobile-tiles.mjs`
- Create: `src/assets/projets/{chronopotes,seenit,bluepoint,projet-chat,sportpxl,covoit-etud}/vignette-mobile.webp`
- Modify: `src/content.config.ts` (champ `img_mobile`)
- Modify: `src/data/work.ts` (`listStructuralGaps`)
- Modify: `src/components/work/ProjectFrame.astro` (`<picture>` pour `variant="tile"`)
- Modify: les douze fichiers de contenu (`img_mobile:` sous `img_alt:`)
- Modify: `src/components/pages/HomePage.astro` (taille du `h1`)
- Test: `tests/tiles.test.mjs`, `tests/home.test.mjs`

**Interfaces:**
- Produces: champ de contenu `img_mobile?: ImageMetadata` (`image().optional()`), même chemin dans les deux langues ; écart de parité `'recadrage mobile différent'` si `img_mobile?.src` diffère.

- [ ] **Step 1: Écrire les tests qui échouent.** Dans `tests/tiles.test.mjs` :

```js
test('chaque vignette sert un recadrage sous 50em', () => {
	for (const slug of ['chronopotes', 'seenit', 'bluepoint-waste-identifier', 'projet-chat', 'boardpxl', 'covoit-etud']) {
		const source = tile('/work/', slug).match(/<source[^>]*>/)?.[0] ?? '';
		assert.ok(source.includes('media="(max-width: 49.99em)"'), slug);
		assert.match(source, /srcset="[^"]*\.webp/, slug);
	}
	assert.ok(tile('/en/work/', 'seenit').includes('<source'));
});

test('la couverture d’une page projet n’est pas recadrée', () => {
	assert.ok(!page('/work/seenit/').includes('<source'));
});
```

Dans `tests/home.test.mjs` (ajouter `pageCss` à l'import de `./helpers.mjs`) :

```js
test('le titre de l’accueil se resserre sur téléphone', () => {
	assert.match(pageCss('/'), /h1[^{]*\{[^}]*font-size:\s*1\.75rem/);
});
```

- [ ] **Step 2: Lancer les tests, constater l'échec**

Run: `npm run build:fast && node --test tests/tiles.test.mjs tests/home.test.mjs`
Expected: FAIL, aucune `<source>` et pas de `1.75rem`.

- [ ] **Step 3: Écrire `scripts/crop-mobile-tiles.mjs`.** En tête, un commentaire à la manière de `generate-og-images.mjs` : ce que le script produit, que les images sont commitées, comment le relancer (`node scripts/crop-mobile-tiles.mjs`). Une table `CROPS` d'entrées `{ project, source, left, top, width }` ; la hauteur se déduit (`Math.round(width / 1.6)`). Le script refuse une entrée de moins de 640 px de large ou qui sort de l'image source, découpe avec `sharp().extract()`, ne redimensionne pas, et écrit `src/assets/projets/<project>/vignette-mobile.webp` (qualité 82).

- [ ] **Step 4: Choisir les six cadrages.** Sources et détails fixés par la spec (tableau « Recadrages ») ; dimensions des sources : ChronoPotes `accueil.webp` 1290×2796, Seenit 1920×1080, BluePoint 1920×1035, les trois autres 1440×900. Ouvrir chaque source, poser les coordonnées, lancer le script, regarder chaque sortie. Ne garder que les données fictives déjà présentes dans les captures.

- [ ] **Step 5: Brancher le recadrage.** Schéma : `img_mobile: image().optional()` à côté de `img`. `listStructuralGaps` : pousser `'recadrage mobile différent'` si `frEntry.data.img_mobile?.src !== enEntry.data.img_mobile?.src`. Contenu : `img_mobile: ../../assets/projets/<projet>/vignette-mobile.webp` dans les douze fichiers. `ProjectFrame.astro`, variante `tile` seulement : si `data.img_mobile`, obtenir l'image par `getImage({ src: data.img_mobile, widths: [640, 960].filter((w) => w <= data.img_mobile.width), format: 'webp' })` et envelopper l'`<Image>` existante dans un `<picture>` précédé de `<source media="(max-width: 49.99em)" srcset={…srcSet.attribute} sizes="100vw" width height type="image/webp">`. L'`<img>` garde `alt=""`, `loading="lazy"` et la règle `.tile img` (16:10).

- [ ] **Step 6: Resserrer le titre de l'accueil.** Dans `HomePage.astro`, `h1` passe à `font-size: 1.75rem` ; la valeur actuelle `clamp(var(--step-4), 4vw, var(--step-5))` passe dans le bloc `@media (min-width: 50em)`.

- [ ] **Step 7: Vérifier les tests**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout passe.

- [ ] **Step 8: Revue visuelle à 375×812**, FR et EN, sur `/` et `/work/` : chaque recadrage se lit (texte de l'interface déchiffrable) ; sur `/`, le titre du premier cadre et le haut de sa capture apparaissent dans le premier écran. À 1440, rien ne change par rapport à la tâche 2. Reprendre les coordonnées et relancer le script si un détail est coupé.

- [ ] **Step 9: Commit**

```bash
git add scripts/crop-mobile-tiles.mjs src/assets/projets src/content.config.ts src/data/work.ts src/components/work/ProjectFrame.astro src/components/pages/HomePage.astro src/content tests/tiles.test.mjs tests/home.test.mjs
git commit -m "Vignettes : un détail lisible sur téléphone, et un titre d'accueil plus court"
```

---

### Task 4: La fiche en tête de la page projet

**Files:**
- Create: `src/components/project/ProjectFacts.astro`
- Modify: `src/components/project/ProjectHero.astro` (retirer `meta` et `<ul class="meta">`, grille)
- Modify: `src/i18n/ui.ts`
- Test: `tests/project.test.mjs`

**Interfaces:**
- Produces: `ProjectFacts.astro`, props `{ entry: WorkEntry; lang: Lang }`, rend `<dl class="facts">` ; clés `work.fact.period`, `work.fact.context`, `work.fact.team`, `work.fact.tech`.

- [ ] **Step 1: Écrire les tests qui échouent** dans `tests/project.test.mjs` :

```js
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
	assert.ok(html.indexOf('class="facts') < html.indexOf('class="project-frame'));
	assert.ok(!html.includes('class="meta'));
});

test('à partir de 50em, la fiche se pose à droite sans écraser le titre', () => {
	assert.match(pageCss('/work/seenit/'), /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(15rem,\s*21rem\)/);
});
```

(Ajouter `pageCss` à l'import de `./helpers.mjs`.)

- [ ] **Step 2: Lancer les tests, constater l'échec**

Run: `npm run build:fast && node --test tests/project.test.mjs`
Expected: FAIL, `Fragment introuvable : class="facts`.

- [ ] **Step 3: Ajouter les libellés** dans `src/i18n/ui.ts`, bloc Projets : FR `Période`, `Cadre`, `Équipe`, `Technologies` ; EN `Date`, `Context`, `Team`, `Technologies`.

- [ ] **Step 4: Écrire `ProjectFacts.astro`.** Lignes dans l'ordre période, cadre, équipe, technologies (`data.tags.join(', ')`) ; une ligne sans valeur est omise. Fond `--paper`, `font-size: var(--step--1)`, `line-height: 1.5`, grille `max-content 1fr` pour aligner libellés et valeurs ; `dt` en 600, `dd` en `--ink-muted` sans marge. Pas d'icône, pas de filet.

- [ ] **Step 5: Mettre en page le héros.** `ProjectHero.astro` enveloppe titre, description et liens dans un bloc `.hero-main`, puis pose `<ProjectFacts>` après lui. Sous 50em, l'ordre du document suffit (flex en colonne, la fiche garde la largeur de son texte comme le cartel). À partir de 50em : grille `minmax(0, 1fr) minmax(15rem, 21rem)`, `column-gap: 3rem`, `align-items: start` ; le lien de retour en `grid-column: 1 / -1`. Supprimer la variable `meta`, son commentaire et la règle `.meta`.

- [ ] **Step 6: Vérifier**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout passe.

- [ ] **Step 7: Revue visuelle** de `/work/seenit/` et `/work/projet-chat/` (FR et EN) à 1440, 800 et 375 : la fiche s'aligne en haut sur le titre, ne passe pas sous la couverture, et à 800 px le titre garde une largeur lisible.

- [ ] **Step 8: Commit**

```bash
git add src/components/project/ProjectFacts.astro src/components/project/ProjectHero.astro src/i18n/ui.ts tests/project.test.mjs
git commit -m "Page projet : une fiche en tête (période, cadre, équipe, technologies)"
```

---

### Task 5: Projet suivant

**Files:**
- Create: `src/components/project/NextProject.astro`
- Modify: `src/data/work.ts` (`nextEntry`)
- Modify: `src/components/work/ProjectFrame.astro` (variante `band`)
- Modify: `src/layouts/ProjectLayout.astro`
- Modify: `src/i18n/ui.ts`
- Test: `tests/project.test.mjs`

**Interfaces:**
- Consumes: classes de titre de la tâche 2, `getWorkCollection(lang)`.
- Produces:
  - `nextEntry<T extends { id: string }>(entries: T[], id: string): T | undefined` dans `src/data/work.ts` : l'entrée qui suit `id`, la première après la dernière, `undefined` si la liste n'a qu'une entrée ;
  - `ProjectFrame` accepte `variant: 'tile' | 'cover' | 'band'` ; `band` rend le cadre sans capture, le titre en `.frame-title` sans `aria-hidden` ;
  - `NextProject.astro`, props `{ entry: WorkEntry; lang: Lang }` ;
  - clés `work.next` (« Projet suivant », « Next project ») et `work.next.label` (« Projet suivant : {title} », « Next project: {title} »).

- [ ] **Step 1: Écrire les tests qui échouent** dans `tests/project.test.mjs` :

```js
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
```

- [ ] **Step 2: Lancer les tests, constater l'échec**

Run: `npm run build:fast && node --test tests/project.test.mjs`
Expected: FAIL, `Fragment introuvable : class="next-project`.

- [ ] **Step 3: Implémenter `nextEntry`** dans `src/data/work.ts`.

- [ ] **Step 4: Ajouter la variante `band` à `ProjectFrame.astro`** : pas d'image, le titre en `.frame-title` (sans `aria-hidden`), poussé en bas du cadre ; règle `.band .frame-title` avec `font-size: var(--step-3)` et `overflow-wrap: anywhere` ; hauteur minimale d'environ la moitié d'une vignette (`min-height: 7rem` sous 50em, `10rem` au-delà, à ajuster à l'œil). Le reste (fond, liseré, classe de titre, `data-frame`) ne change pas.

- [ ] **Step 5: Écrire `NextProject.astro`** : un seul `<a class="next-project" href={`${workBasePath(lang)}${entry.id}`} aria-label={t('work.next.label').replace('{title}', entry.data.title)}>` contenant le libellé `t('work.next')` dans la police du site (600, couleur `--ink`, au-dessus du cadre, hors du cadre) puis `<ProjectFrame entry={entry} variant="band" />`. `.next-project` en `display: flex; flex-direction: column; gap: 0.75rem`, sans soulignement ; au survol, le `.frame-title` se souligne (`text-underline-offset: 0.2em`, comme `ProjectTile`). Le focus utilise la règle globale `:focus-visible`.

- [ ] **Step 6: Brancher dans `ProjectLayout.astro`** : `const next = nextEntry(await getWorkCollection(lang), entry.id);` puis `{next && <NextProject entry={next} lang={lang} />}` en dernier enfant de `.project`.

- [ ] **Step 7: Vérifier**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout passe.

- [ ] **Step 8: Revue visuelle et clavier.** À 1440 et 375, FR et EN, sur `/work/seenit/` (bandeau Projet Chat ou BluePoint selon l'ordre) et `/work/covoit-etud/` (bandeau ChronoPotes) : bandeau sans flèche, titre lisible, pas de débordement à 375. Au clavier (Tab depuis le dernier lien de la galerie), l'anneau de focus entoure libellé et cadre.

- [ ] **Step 9: Commit**

```bash
git add src/components/project/NextProject.astro src/data/work.ts src/components/work/ProjectFrame.astro src/layouts/ProjectLayout.astro src/i18n/ui.ts tests/project.test.mjs
git commit -m "Page projet : un lien vers le projet suivant, dans son cadre"
```

---

### Task 6: Vérification d'ensemble et suivi

**Files:**
- Modify: `docs/AMELIORATIONS.md` (section P6, points 1, 2 et 4)

- [ ] **Step 1: Tout reconstruire et tester**

Run: `npm run check && npm run build:fast && npm test`
Expected: 0 erreur, tous les tests passent.

- [ ] **Step 2: Contrôles de la spec qui ne sont pas des tests.** Aucune occurrence de `fonts.googleapis.com` dans `dist/` (`tests/foundations.test.mjs`). Le fichier `jost-latin-500-normal*.woff2` existe dans `dist/_astro/`. Pas de tiret long ajouté : `git diff release -- src | grep -P '^\+.*\x{2014}'` ne renvoie rien.

- [ ] **Step 3: Revue visuelle finale** à 1440 et 375, FR et EN : `/`, `/work/`, `/work/seenit/` (avec nuancier), `/work/projet-chat/` (sans nuancier). Montrer les captures à Thibault avec les choix faits à l'œil (liseré SportPXL, cadre Covoit'Etud, cadrages).

- [ ] **Step 4: Cocher les points 1, 2 et 4 de P6** dans `docs/AMELIORATIONS.md`, avec une ligne sur ce qui a été fait.

- [ ] **Step 5: Commit**

```bash
git add docs/AMELIORATIONS.md
git commit -m "Suivi : points 1, 2 et 4 de l'audit d'interface faits"
```
