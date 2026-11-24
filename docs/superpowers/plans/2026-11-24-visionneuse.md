# Visionneuse des captures : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ouvrir chaque capture d'une page projet dans une visionneuse plein écran aux couleurs du projet, lisible sur téléphone.

**Architecture:** Le build dresse la suite des captures d'un projet (couverture, puis galerie, sans doublon) et rend un `<dialog>` statique ; chaque capture de la page devient un lien vers son image en grand. Un script ouvre le `<dialog>` à la place du lien et fixe la largeur de l'image, calculée par une fonction pure partagée avec les tests. La galerie garde son script ; les deux se parlent par `event.defaultPrevented` et un événement `gallery:show`.

**Tech Stack:** Astro 5 statique (`getImage`), TypeScript, `<dialog>` natif, `node --test`, Puppeteer pour les tests de comportement.

**Spec:** `docs/superpowers/specs/2026-11-24-visionneuse-design.md`

## Global Constraints

- Branche `visionneuse`. Ne jamais pousser (`release` déploie). Commits en français, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Aucune bibliothèque. Le script de la visionneuse n'est chargé que sur les pages projet et vise une centaine de lignes.
- Parité FR/EN ; tout libellé dans `src/i18n/ui.ts`, mots exacts de la spec.
- Pas de tiret long (U+2014), de capitales espacées, de point médian, d'ombre, de pastille, de flèche dans un libellé.
- Fond `--frame-bg`, textes, commandes et anneaux de focus `--frame-title`, sans transparence ; cibles d'au moins 2,75rem.
- La galerie garde tous ses comportements, y compris sans JavaScript.
- « Petit écran » : `(max-width: 49.99em), (max-height: 29.99em)`.
- Après chaque tâche : `npm run check`, puis `npm run build:fast && npm test`.

## Review Focus

1. **Double-clic sur une capture** (réflexe courant) : la visionneuse s'ouvre et reste ouverte, dans sa taille d'ouverture. Test en tâche 3.
2. **Rotation du téléphone, visionneuse ouverte** : même capture, tailles recalculées, « Fermer » à l'écran. Test en tâche 3.
3. **Très petit écran (320 × 568) avec une longue légende** : commandes à l'écran, au moins 150 px de haut pour la capture. Test en tâche 3.
4. **Ctrl+clic sur une capture** : le comportement du lien est gardé, rien ne s'ouvre, y compris sur une voisine. Test en tâche 4.
5. **Projet sans galerie ou sans capture** : pas de flèches, aucune erreur de script sur aucune page. Tests en tâches 1 et 3.

---

### Task 1: Suite des captures, tailles et couleurs

**Files:**
- Create: `src/data/captures.ts`
- Modify: `src/data/identity.ts`, `src/components/work/ProjectFrame.astro:32-37`
- Test: `tests/captures.test.mjs` (nouveau), `tests/identity.test.mjs`, `tests/tiles.test.mjs`

**Interfaces:**
- Produces, dans `src/data/captures.ts` (n'importe rien d'Astro ; chargé par le script client et par les tests) :
  - `interface Capture<T> { src: T; alt: string; caption?: string }`
  - `captureList<T extends { src: string }>(cover: Capture<T> | undefined, gallery: Capture<T>[] | undefined): Capture<T>[]` : couverture puis galerie, une seule entrée par `src.src`. Une couverture présente dans la galerie reste en tête avec le texte alternatif et la légende de la galerie.
  - `captureSizes(stage: { width: number; height: number }, image: { width: number; height: number }, small: boolean): { fit: number; zoom: number; canZoom: boolean; opensZoomed: boolean }` : largeurs en px CSS, arrondies vers le bas. `real` = largeur, divisée par 3 si l'image est plus haute que large. `fit = min(stage.width, real, stage.height × ratio)`. `zoom` = `real` sur grand écran ; sur petit écran `min(real, max(stage.width, stage.height × ratio, plancher))`, plancher 800 pour une capture de bureau, 0 sinon. `canZoom` si `zoom ≥ 1,1 × fit`, sinon `zoom = fit`. `opensZoomed` si petit écran, capture plus large que haute et `canZoom`.
- Produces, dans `src/data/identity.ts` : `frameStyle(frame: FrameStyle | undefined): string`, la chaîne `--frame-bg:…;--frame-border:…;--frame-title:…` que `ProjectFrame.astro` compose aujourd'hui (liseré absent = fond ; sans cadre : `var(--ink)`, `var(--ink)`, `#FFFFFF`).

- [ ] **Step 1: Écrire les tests qui échouent**

`tests/captures.test.mjs` :

```js
const img = (src, width = 1440, height = 900) => ({ src, width, height });
const cover = { src: img('a'), alt: 'Couverture' };
const b = { src: img('b'), alt: 'B', caption: 'Légende B' };

test('la couverture, puis la galerie', () => {
	assert.deepEqual(captureList(cover, [b]), [cover, b]);
	assert.deepEqual(captureList(cover, undefined), [cover]);
	assert.deepEqual(captureList(undefined, [b]), [b]);
	assert.deepEqual(captureList(undefined, undefined), []);
});

test('une couverture reprise dans la galerie n’apparaît qu’une fois, avec sa légende', () => {
	const same = { src: img('a'), alt: 'A', caption: 'Légende A' };
	assert.deepEqual(captureList(cover, [b, same]), [same, b]);
});

const sizes = (w, h, image, small) => captureSizes({ width: w, height: h }, image, small);

test('une capture de bureau s’ouvre agrandie sur petit écran, entière sur grand écran', () => {
	assert.deepEqual(sizes(375, 600, img('a'), true), { fit: 375, zoom: 960, canZoom: true, opensZoomed: true });
	assert.deepEqual(sizes(1250, 780, img('a', 1920, 1200), false), { fit: 1248, zoom: 1920, canZoom: true, opensZoomed: false });
});

test('téléphone couché ou très petit : au moins 800 px', () => {
	assert.equal(sizes(700, 290, img('a'), true).zoom, 800);
	assert.equal(sizes(320, 330, img('a'), true).zoom, 800);
});

test('une capture de téléphone s’ouvre entière et ne dépasse pas 430 px', () => {
	assert.deepEqual(sizes(343, 600, img('a', 1290, 2796), true), { fit: 276, zoom: 343, canZoom: true, opensZoomed: false });
	assert.equal(sizes(1250, 780, img('a', 1290, 2796), false).zoom, 430);
});

test('pas de bascule quand les deux tailles se valent', () => {
	assert.deepEqual(sizes(1800, 1000, img('a'), false), { fit: 1440, zoom: 1440, canZoom: false, opensZoomed: false });
});
```

`tests/identity.test.mjs` :

```js
test('les couleurs du cadre, et le repli encre', () => {
	assert.equal(frameStyle({ ...frameOnly.frame, border: '#FFFFFF' }), '--frame-bg:#1F1F1F;--frame-border:#FFFFFF;--frame-title:#338CD2');
	assert.equal(frameStyle(frameOnly.frame), '--frame-bg:#1F1F1F;--frame-border:#1F1F1F;--frame-title:#338CD2');
	assert.equal(frameStyle(undefined), '--frame-bg:var(--ink);--frame-border:var(--ink);--frame-title:#FFFFFF');
});
```

Dans `tests/tiles.test.mjs`, « le cadre encre reste le repli » perd son assertion sur `'var(--ink)'` (couverte ci-dessus) et vérifie à la place `frameStyle(identity?.frame)` dans la source de `ProjectFrame.astro`.

- [ ] **Step 2: Constater l'échec** : `node --test tests/captures.test.mjs tests/identity.test.mjs`. Expected: FAIL, module et export absents.

- [ ] **Step 3: Implémenter** `captures.ts` et `frameStyle`, puis faire passer `ProjectFrame.astro` par `frameStyle` (classe `bordered` : liseré déclaré et différent du fond).

- [ ] **Step 4: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe, cadres inchangés.

- [ ] **Step 5: Commit** : « Visionneuse : suite des captures, tailles et couleurs du cadre »

---

### Task 2: Les liens et la visionneuse dans le HTML

**Files:**
- Create: `src/components/project/CaptureViewer.astro`
- Modify: `src/layouts/ProjectLayout.astro`, `src/components/project/ProjectCover.astro`, `src/components/project/ProjectGallery.astro`, `src/i18n/ui.ts`
- Test: `tests/viewer.test.mjs` (nouveau), `tests/project.test.mjs:73`

**Interfaces:**
- Consumes: `captureList`, `frameStyle`.
- Produces :
  - `ProjectLayout.astro` construit `captures: ViewerCapture[]`, où `interface ViewerCapture extends Capture<ImageMetadata> { full: string }` (exportée par `captures.ts` avec un import de type seul) et `full` est l'URL de `getImage({ src, format: 'webp', quality: 90 })`, sans largeur.
  - Props : `ProjectCover { entry; capture: ViewerCapture; lang }`, `ProjectGallery { gallery; captures; lang }`, `CaptureViewer { captures; identity; lang }`.
  - Liens : `<a href={full} data-viewer-open={index}>`, `index` dans `captures`.
  - Dialogue : `<dialog class="viewer" data-viewer>` ; dedans `[data-close]`, `[data-stage]`, un `[data-capture]` par capture (`data-width`, `data-height`, `data-live`), `[data-caption]`, `[data-position]`, `[data-prev]`, `[data-next]`, `[data-toggle]` (`data-zoom-label`, `data-fit-label`), `[data-live-region]`.
  - Clés : `work.viewer.open` Agrandir/Enlarge, `work.viewer.fit` Voir entière/Fit to screen, `work.viewer.close` Fermer/Close, `work.viewer.position` `{n} sur {total}`/`{n} of {total}`.

- [ ] **Step 1: Écrire les tests qui échouent** (`tests/viewer.test.mjs`)

```js
const COUNTS = { chronopotes: 6, seenit: 6, 'bluepoint-waste-identifier': 5, boardpxl: 4, 'covoit-etud': 4, 'projet-chat': 1 };
const dialog = (route) => chunk(page(route), '<dialog', '</dialog>');
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

for (const base of ['/work/', '/en/work/']) {
	for (const [slug, count] of Object.entries(COUNTS)) {
		test(`la visionneuse de ${base}${slug}`, () => {
			const html = page(`${base}${slug}/`);
			assert.equal(all(html, /(<dialog)/g).length, 1);
			const d = dialog(`${base}${slug}/`);
			const imgs = all(d, /(<img[^>]*>)/g);
			assert.equal(imgs.length, count);
			assert.match(d.match(/<[^>]*data-stage[^>]*>/)[0], /tabindex="0"/);
			for (const i of imgs) {
				assert.match(i, /loading="lazy"/);
				assert.match(i, /alt="[^"]{20,}"/);
			}
			// Chaque lien ouvre un fichier du site, le meme que la visionneuse.
			const links = all(html, /(<a[^>]*data-viewer-open="\d+"[^>]*>)/g);
			assert.ok(links.length >= count);
			for (const link of links) {
				const href = link.match(/href="([^"]+)"/)[1];
				assert.ok(existsSync(new URL(`../dist${href}`, import.meta.url)), href);
				assert.ok(imgs[Number(link.match(/data-viewer-open="(\d+)"/)[1])].includes(`src="${href}"`), href);
			}
			assert.equal(/data-prev|data-position/.test(d), count > 1);
		});
	}
}

test('la visionneuse prend les couleurs du cadre', () => {
	assert.match(dialog('/work/covoit-etud/'), /--frame-bg:#ABC4FF;[^"]*--frame-title:#31429A/i);
});

test('les libellés, dans les deux langues', () => {
	assert.ok(text(dialog('/work/seenit/')).includes('Fermer'));
	assert.ok(text(dialog('/work/seenit/')).includes('1 sur 6'));
	assert.match(dialog('/work/seenit/'), /data-zoom-label="Agrandir"[^>]*data-fit-label="Voir entière"/);
	assert.ok(text(dialog('/en/work/seenit/')).includes('1 of 6'));
	assert.match(dialog('/en/work/seenit/'), /data-zoom-label="Enlarge"[^>]*data-fit-label="Fit to screen"/);
	assert.ok(text(chunk(page('/work/seenit/'), 'class="cover-link')).endsWith('Agrandir'));
});

test('la couverture de BluePoint et sa première capture ouvrent la même vue', () => {
	assert.deepEqual(all(page('/work/bluepoint-waste-identifier/'), /<a[^>]*data-viewer-open="(\d+)"/g), ['0', '0', '1', '2', '3', '4']);
});

test('pas de visionneuse ailleurs', () => {
	for (const route of ['/', '/en/', '/work/', '/en/work/', '/contact/', '/cv/']) assert.ok(!page(route).includes('data-viewer'), route);
});
```

Dans `tests/project.test.mjs`, « pas de couverture vide » accepte les nouvelles props : `/\{entry\.data\.img && <ProjectCover entry=\{entry\}/`.

- [ ] **Step 2: Constater l'échec** : `npm run build:fast && node --test tests/viewer.test.mjs`. Expected: FAIL, `<dialog` introuvable.

- [ ] **Step 3: Couverture.** `ProjectCover.astro` enveloppe le cadre dans `<a class="cover-link">`, suivi du libellé « Agrandir » souligné (600, `--step--1`), sous le cadre, aligné à droite. Curseur `zoom-in`.

- [ ] **Step 4: Galerie.** Le `<div class="frame">` de chaque diapositive devient le lien, mêmes styles. Curseur `zoom-in` sur la diapositive active. `.track` reçoit assez de `padding-block` pour que l'anneau de focus ne soit pas coupé.

- [ ] **Step 5: Dialogue.** `CaptureViewer.astro`, rendu après `</main>` si `captures.length > 0`, nom `work.gallery.label`, couleurs par `frameStyle(identity?.frame)`. Première capture visible, les autres `hidden` ; images `src={full}` avec `width` et `height`. « Fermer » dans un `<form method="dialog">`, avec `autofocus`. Zone : `tabindex="0"`, `role="group"`, même nom que la boîte, `overflow: auto`, `overscroll-behavior: contain`, image centrée par `margin: auto` (un centrage de grille couperait le bord gauche d'une image agrandie), `max-width: none`. `display: grid` seulement sous `[open]`. Grilles de la spec, flèches en bas sous 50em, hauteur `100dvh`. Page figée par `html:has(dialog.viewer[open]) { overflow: hidden; }`. Bouton `aria-disabled="true"` : bord retiré, curseur par défaut.

- [ ] **Step 6: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe.

- [ ] **Step 7: Commit** : « Visionneuse : chaque capture mène à son image, dialogue aux couleurs du projet »

---

### Task 3: Le comportement de la visionneuse

**Files:**
- Create: `tests/browser.mjs`, `tests/viewer.browser.test.mjs`
- Modify: `src/components/project/CaptureViewer.astro` (script), `.github/workflows/deploy.yml` (étape « Tests »), `tests/ci.test.mjs`

**Interfaces:**
- Consumes: attributs de la tâche 2, `captureSizes`.
- Produces :
  - `tests/browser.mjs` : `openSite(): Promise<{ url: string; visit(path, options?: { width?, height?, mobile?, js? }): Promise<Page>; close(): Promise<void> }>`. Sert `dist/` par `node:http` sur un port libre, lance Puppeteer (`--no-sandbox` si `process.env.CI`). `visit` attend `networkidle0` ; défaut 1440 × 900.
  - Le dialogue porte `data-size="fit" | "zoom"` et `data-index`.
  - Un clic sur `[data-viewer-open]` ouvre, sauf `event.defaultPrevented`, touche Ctrl/Maj/Alt/Meta, bouton autre que le principal.

- [ ] **Step 1: Écrire les tests qui échouent** (`tests/viewer.browser.test.mjs`). Chaque ligne est un test ; `state()` lit `{ open, index, size, width }` (largeur affichée de l'image visible) et `focus()` l'attribut `data-*` de l'élément actif.

| Test | Assertions |
|---|---|
| ouvre depuis la couverture | clic sur `.cover-link` de `/work/seenit/` : `open`, `index 0`, `size fit`, focus sur `data-close` |
| rien n'est téléchargé avant l'ouverture | aucune requête vers le `href` d'un lien avant le clic ; une seule après, celle de la capture 0 |
| téléphone, capture de bureau | 375 × 812, couverture des six projets : `size zoom`, `width ≥ 800` ; 812 × 375 sur `/work/boardpxl/` : `width ≥ 800` |
| téléphone, capture portrait | ChronoPotes 375 × 812, capture 1 : `size fit`, `width ≤ 375` |
| bascule par l'image et par le bouton | 1440 × 900, Seenit : clic image, `zoom` et 1920 px ; clic bouton, `fit` ; texte « Voir entière » puis « Agrandir » |
| l'endroit touché reste à l'écran | clic à 80 % de la largeur : après agrandissement, ce point de l'image est dans la zone visible |
| flèches du clavier | Droite : `index 1` et annonce « Capture 2 sur 6 » ; agrandie, Droite : `index` inchangé, `scrollLeft > 0` ; Alt+Gauche ne change rien |
| extrémités | à `index 0`, `data-prev` a `aria-disabled="true"`, Entrée dessus : `index 0`, focus conservé ; fin de suite : pas de retour à 0 |
| changer de capture repart de l'ouverture | agrandie puis suivante : `size fit`, défilement à 0 |
| fermer | Échap, « Fermer », clic sur le fond : `open` faux ; clic sur la légende : reste ouverte |
| focus rendu à la couverture | après fermeture, focus sur `.cover-link`, `scrollY` inchangé |
| page figée | ouverte, la molette ne change pas `scrollY` |
| double-clic | sur `.cover-link` : `open` vrai, `size fit` |
| rotation | 375 × 812 à `index 2`, puis 812 × 375 : `index 2`, `width ≥ 800`, « Fermer » dans l'écran |
| très petit écran | 320 × 568, ChronoPotes `index 1` : fermer, flèches et légende dans l'écran, zone d'au moins 150 px de haut |
| cibles et contraste | chaque bouton mesure au moins 44 × 44 px ; couleur calculée des textes = `--frame-title` |
| une seule capture | `/work/projet-chat/` : s'ouvre, Droite sans effet, aucune erreur |
| sans JavaScript | `js: false`, clic sur `.cover-link` : on arrive sur l'image |
| aucune erreur de script | `pageerror` vide sur `/`, `/work/`, les six pages FR et `/en/work/seenit/` |

`tests/ci.test.mjs` : l'étape « Tests » contient `PUPPETEER_EXECUTABLE_PATH: ${{ steps.chrome.outputs.chrome-path }}`.

- [ ] **Step 2: Constater l'échec** : `node --test tests/viewer.browser.test.mjs tests/ci.test.mjs`. Expected: FAIL sur l'ouverture (le lien quitte la page) ; « sans JavaScript » passe déjà, c'est un garde-fou.

- [ ] **Step 3: Écrire le script** dans `CaptureViewer.astro`. Décisions : écoute sur `document` ; `show(index)` affiche une capture, sa légende, sa position, l'annonce et `aria-disabled` ; `resize()` applique `captureSizes` en fixant `style.width` de l'image et masque `[data-toggle]` si `!canZoom` ; zone mesurée par `getBoundingClientRect` (barres de défilement comprises) et suivie par un `ResizeObserver` ; `event.detail > 1` ignoré dans la boîte (double-clic) ; clic sur le fond = cible `dialog` ou `[data-stage]`, hors barres de défilement ; en `zoom`, gauche et droite appellent `stage.scrollBy({ left: ±120 })` ; `aria-haspopup="dialog"` posé sur les liens par le script.

- [ ] **Step 4: CI.** Ajouter l'`env` à l'étape « Tests » de `deploy.yml`.

- [ ] **Step 5: Vérifier** : `npm run check && npm run build:fast && npm test`, trois fois de suite pour la stabilité. Expected: tout passe les trois fois.

- [ ] **Step 6: Commit** : « Visionneuse : ouverture, deux tailles, clavier et tests dans un navigateur »

---

### Task 4: La galerie et la visionneuse

**Files:**
- Modify: `src/components/project/ProjectGallery.astro`, `src/components/project/CaptureViewer.astro` (retour)
- Test: `tests/viewer.browser.test.mjs`, `tests/viewer.test.mjs`

**Interfaces:**
- Consumes: tâche 3.
- Produces: événement `gallery:show`, émis par la visionneuse à la fermeture sur le lien de la dernière capture vue (`bubbles: true`) ; la galerie centre cette diapositive sans animation. Bouton `<button data-enlarge data-viewer-open>` dans `[data-controls]`, dont `data-viewer-open` suit la diapositive active.

- [ ] **Step 1: Écrire les tests qui échouent**

| Test | Assertions |
|---|---|
| clic sur la capture centrale | Seenit : ouvre à l'index de son lien |
| clic sur une voisine | `open` faux, la voisine devient active |
| Ctrl+clic | sur la centrale et sur une voisine : `open` faux, diapositive active inchangée |
| clavier | Tab jusqu'au lien d'une voisine : elle devient active ; Entrée : ouvre à son index |
| bouton « Agrandir » | après la flèche suivante de la galerie : ouvre la diapositive active ; à la fermeture, focus sur le bouton |
| retour dans la galerie | ouverte depuis la diapositive 0, deux fois suivante, Échap : diapositive 2 active, focus sur son lien, `scrollY` inchangé |
| dernière vue hors galerie | Seenit, depuis la diapositive 0, précédente (couverture), Échap : focus sur le lien de départ |
| BluePoint | depuis la couverture, Échap : focus sur `.cover-link` |
| sans JavaScript | commandes masquées, les cinq captures de Seenit sont des liens |

`tests/viewer.test.mjs` : « Agrandir » et « Enlarge » présents dans la barre de commandes de la galerie FR et EN.

- [ ] **Step 2: Constater l'échec** : `npm run build:fast && node --test tests/viewer.browser.test.mjs`. Expected: FAIL (une voisine ouvre la visionneuse, pas de bouton, pas de retour).

- [ ] **Step 3: Galerie.** Au clic sur une diapositive non active : `preventDefault()` et centrage, sauf touche de modification ou `event.detail === 0` (Entrée, lecteur d'écran). Au `focusin` d'un lien `:focus-visible` d'une diapositive non active : centrer (le test `:focus-visible` évite qu'un clic de souris centre puis ouvre). Bouton « Agrandir » en texte souligné, à la ligne si la place manque.

- [ ] **Step 4: Retour.** À la fermeture, si l'ouverture vient de la galerie (`opener.closest('[data-gallery]')`) : chercher `a[data-viewer-open="<index>"]` dans cette galerie, y émettre `gallery:show` ; focus sur ce lien si l'ouverture vient d'une capture, sur le bouton sinon, sur `opener` par défaut. Toujours `focus({ preventScroll: true })`.

- [ ] **Step 5: Vérifier** : `npm run check && npm run build:fast && npm test`, trois fois. Expected: tout passe les trois fois.

- [ ] **Step 6: Commit** : « Galerie : ouvrir la capture centrale, et retrouver sa place en fermant »

---

### Task 5: Revue à l'œil et suivi

**Files:**
- Modify: `docs/AMELIORATIONS.md` (P6, point 3), et les styles que la revue corrige

- [ ] **Step 1: Captures** des six projets à 375 × 812, 812 × 375, 768 × 1024, 1280 × 720 et 1440 × 900, visionneuse ouverte (couverture et une capture de galerie), page au repos avec ses « Agrandir », et focus clavier. Juger : lisibilité du texte sur téléphone, bord des captures claires sur lavande et pervenche (sinon filet de 1 px `--frame-title` sur l'image), longues légendes, alignement des commandes, anneaux de focus sur la galerie.
- [ ] **Step 2: Corriger** ce que la revue montre, un test d'abord quand le défaut se mesure.
- [ ] **Step 3: Cocher le point 3** dans `docs/AMELIORATIONS.md`, une phrase sur ce qui a été fait.
- [ ] **Step 4: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe ; `git diff release -- src scripts tests | LC_ALL=C.UTF-8 grep -cP '^\+.*\x{2014}'` vaut 0 ; la somme des octets du script de la visionneuse reste sous 6 Ko non compressés.
- [ ] **Step 5: Commit** : « Visionneuse : ajustements après revue, point 3 de P6 fait »
