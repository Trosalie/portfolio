# Affichage ChronoPotes jouable : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Jouer une manche de ChronoPotes (cible 5,00 s, à l'aveugle) dans le nuancier de sa page projet.

**Architecture:** Les règles, les formats et le plan de roulement sont des fonctions pures dans `src/data/chrono.ts`, chargées par le script et par les tests. `ChronoFlaps.astro` garde l'exemple statique ; son script ajoute le bouton et la manche. Les temps viennent de `event.timeStamp`.

**Tech Stack:** Astro 5 statique, TypeScript, CSS 3D, `node --test`, Puppeteer (`tests/browser.mjs`).

**Spec:** `docs/superpowers/specs/2026-11-25-chronopotes-jouable-design.md`

## Global Constraints

- Branche `chronopotes-jouable`. Ne jamais pousser (`release` déploie). Commits en français, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Le dépôt `C:\dev\chronopotes` se lit seulement.
- Aucune bibliothèque. Script absent des pages autres que ChronoPotes FR et EN.
- Parité FR/EN, libellés dans `src/i18n/ui.ts`. Pas de tiret long (U+2014), de point médian, de flèche.
- Entre le départ et l'arrêt : aucune mutation de la page, aucune animation.
- Textes à 4,5:1, cibles de 2,75rem au moins.
- Mémoire limitée : tests au premier plan, un fichier à la fois, pas de campagne en arrière-plan. Suite complète une fois par tâche (environ 165 s).

## Review Focus

1. **Au doigt, un seul geste compte une fois** (le navigateur envoie aussi un clic après l'appui) : arrêter ne relance pas, même en gardant le doigt posé plus de 400 ms. Test en tâche 2.
2. **Clic droit, bouton du milieu, touche maintenue, Maj+Espace** : ni départ ni arrêt hors des gestes prévus. Test en tâche 2.
3. **Appui commencé sur le bouton et relâché ailleurs** : l'arrêt compte, et le clic suivant, normal, relance bien. Test en tâche 2.
4. **Onglet masqué pendant le roulement, ou retour sur la page gardée en mémoire** : un résultat complet ou l'état de repos, jamais un état bloqué. Test en tâche 2.
5. **320 px et texte à 200 %** : palettes, mention et écart restent dans la pièce, sans chevauchement. Test en tâche 3.

---

### Task 1: Les règles et les formats

**Files:**
- Create: `src/data/chrono.ts`
- Modify: `src/components/CvPrintPage.astro` (icône)
- Test: `tests/chrono.test.mjs` (nouveau), `tests/cv.test.mjs`

**Interfaces:**
- Produces, dans `src/data/chrono.ts` (n'importe rien d'Astro) :
  - `TARGET_MS = 5000`, `GUARD_MS = 400`, `LIMIT_MS = 30000`, `ROLL_TICK_MS = 80`
  - `type Tier = 'masterclass' | 'good' | 'average' | 'missed'`, `tierFor(diffMs: number): Tier`
  - `formatFlap(ms: number, lang: Lang): string` (`05,12`, `05.12` ; au-delà de 99,99 s, plafonné)
  - `formatGap(signedMs: number, lang: Lang): string` (`+0,12 s`, `−0,04 s` avec U+2212 et espace insécable ; `0,00 s` sans signe)
  - `rollPlan(value: string): string[][]`, celui du jeu

- [ ] **Step 1: Écrire les tests qui échouent** (`tests/chrono.test.mjs`)

```js
test('les mentions changent aux bornes du jeu', () => {
	const expected = [[0, 'masterclass'], [149, 'masterclass'], [150, 'good'], [500, 'good'], [501, 'average'], [1000, 'average'], [1001, 'missed'], [30000, 'missed']];
	for (const [diff, tier] of expected) assert.equal(tierFor(diff), tier, String(diff));
});

test('le temps et l’écart, dans les deux langues', () => {
	assert.equal(formatFlap(5123, 'fr'), '05,12');
	assert.equal(formatFlap(5123, 'en'), '05.12');
	assert.equal(formatFlap(12304, 'fr'), '12,30');
	assert.equal(formatFlap(120000, 'fr'), '99,99');
	assert.equal(formatGap(123, 'fr'), '+0,12\u00a0s');
	assert.equal(formatGap(-40, 'en'), '\u22120.04\u00a0s');
	assert.equal(formatGap(4, 'fr'), '0,00\u00a0s');
});

test('le roulement est celui du jeu', () => {
	assert.deepEqual(rollPlan('05,12'), [
		['7', '8', '9', '0'],
		['1', '2', '3', '4', '5'],
		[','],
		['6', '7', '8', '9', '0', '1'],
		['6', '7', '8', '9', '0', '1', '2'],
	]);
});
```

`tests/cv.test.mjs` : `/cv-print/` et `/en/cv-print/` contiennent `<link rel="icon" … href="/favicon-32.png">`.

- [ ] **Step 2: Constater l'échec** : `node --test tests/chrono.test.mjs tests/cv.test.mjs`. Expected: FAIL, module absent et icône absente.
- [ ] **Step 3: Implémenter** `chrono.ts` d'après `src/engine/common.ts` et `src/ui/SplitFlap/roll.ts` du jeu, et l'icône.
- [ ] **Step 4: Vérifier** : `npm run check && npm run build:fast && npm test`, puis `npm run build` (PDF d'une page). Expected: tout passe.
- [ ] **Step 5: Commit** : « ChronoPotes : règles et formats de la manche ; CV : icône de la page d'impression »

---

### Task 2: La manche

**Files:**
- Modify: `src/components/project/specimens/ChronoFlaps.astro`, `src/components/project/specimens/SeenitTicket.astro` (prop ignorée), `src/components/project/IdentitySpecimen.astro`, `src/layouts/ProjectLayout.astro`, `src/i18n/ui.ts`
- Test: `tests/chrono.browser.test.mjs` (nouveau), `tests/chrono.test.mjs`, `tests/transitions.browser.test.mjs` (retirer l'exception de l'icône)

**Interfaces:**
- Consumes: `src/data/chrono.ts`.
- Produces :
  - `IdentitySpecimen` et les pièces reçoivent `demoUrl?: string`.
  - Balisage : `[data-chrono]` (groupe nommé, `data-state="rest" | "running" | "rolling" | "result"`), `[data-board]`, `[data-flaps]` (`role="img"`), `[data-tier]`, `[data-gap]`, `[data-play]` (`hidden` sans JavaScript), `[data-button]`, `[data-link]`, `[data-live]` (`aria-live="polite"`).
  - Clés `specimen.chrono.*` : `group`, `target`, `play`, `playLabel`, `stop`, `replay`, `replayLabel`, `started`, `interrupted`, `spoken` (`{value}`, `{gap}`, `{sense}`, `{tier}`), `early`, `late`, `exact`, `link`, `tier.masterclass`, `tier.good`, `tier.average`, `tier.missed`. `value` et `tier` existent déjà.

- [ ] **Step 1: Écrire les tests qui échouent.** `tests/chrono.test.mjs` (sur `dist/`) : l'exemple `04,96 Masterclass` et `04.96` inchangés ; `[data-play]` porte `hidden` ; aucune page hors ChronoPotes ne contient `data-chrono` ; mentions dans les deux langues.

`tests/chrono.browser.test.mjs`. Aide `record` : note `event.timeStamp` de chaque `pointerdown`, `keydown` et `click` ; `clock(ms)` : décale `Event.prototype.timeStamp` de `ms`, pour viser une mention sans attendre.

| Test | Attendu |
|---|---|
| souris, doigt, Espace, Entrée | départ, arrêt, valeur affichée = écart des deux `timeStamp` à 10 ms près, mention, « Rejouer » |
| arrêt à l'appui | `data-state` quitte `running` avant le relâchement |
| sur les palettes | un appui arrête aussi |
| les quatre mentions, FR et EN (`clock`) | texte, couleur calculée, écart et signe |
| règle d'or | `MutationObserver` sur `document` et `document.getAnimations()` entre 450 ms et l'arrêt : 0 et vide |
| double-clic sur « Jouer » | `running` 600 ms plus tard |
| relâchement long (800 ms) après l'arrêt, souris, doigt, Espace | `result`, pas `running` |
| départ dans les 400 ms après l'arrêt | ignoré ; ensuite accepté |
| clic droit, milieu, Entrée maintenue, touche autre | aucun départ ni arrêt de trop |
| appui sur le bouton, relâché ailleurs | arrêté ; le clic normal suivant relance |
| onglet masqué (`visibilitychange` simulé), page quittée puis retour, 30 s (`clock` sur le délai : horloge Puppeteer) | `rest`, 04,96, « Manche interrompue » annoncé |
| onglet masqué pendant le roulement | `result` complet au retour |
| mouvement réduit | `result` sans animation, dans les deux images suivantes |
| roulement | durée entre 400 et 900 ms, caractères finaux justes |
| annonces | « Chrono lancé », puis la phrase complète ; rien entre les deux |
| focus | sur le bouton avant, pendant et après, à la souris et au clavier |
| lien | invisible au repos, visible après la première manche, adresse de `demoUrl` |
| sans JavaScript | ni bouton ni cible |
| `/work/seenit/` | aucune erreur, pas de `[data-chrono]` |

- [ ] **Step 2: Constater l'échec** : `npm run build:fast && node --test tests/chrono.browser.test.mjs`. Expected: FAIL, `[data-button]` absent ; « sans JavaScript » et Seenit passent déjà.
- [ ] **Step 3: Balisage et styles.** L'exemple statique garde son rendu. Palettes en quatre moitiés (`clip-path`, `rotateX`), d'après `SplitFlap.module.css`. Place réservée pour la mention, l'écart et le lien (`visibility`). `touch-action: manipulation` et `user-select: none` sur la pièce.
- [ ] **Step 4: Script.** Décisions :
  - Départ sur `click` ; arrêt sur `pointerdown` (bouton principal) dans `[data-board]` ou `[data-button]`, ou `keydown` Espace/Entrée sans répétition sur `[data-button]`.
  - `swallow` : vrai après un arrêt, il absorbe le clic du même geste ; remis à faux au prochain `pointerdown` ou `keydown` hors manche.
  - Gardes `GUARD_MS` après départ et après arrêt ; pendant `rolling`, aucun départ.
  - `data-state` ne change qu'aux passages ; pendant `running`, seul un délai de `LIMIT_MS` est armé.
  - Interruption sur `visibilitychange` et `pagehide` si `running`.
- [ ] **Step 5: Vérifier** : `npm run check && npm run build:fast`, les tests de la tâche trois fois, puis `npm test`. Casser ensuite une à une six décisions, sur les seuls tests concernés : arrêt à l'appui, `swallow`, garde après départ, garde après arrêt, répétition de touche, interruption. Expected: un test au moins échoue à chaque fois.
- [ ] **Step 6: Commit** : « ChronoPotes : une manche jouable dans le nuancier »

---

### Task 3: Revue à l'œil et suivi

**Files:**
- Modify: `docs/AMELIORATIONS.md` (P6, point 7), et les styles que la revue corrige
- Test: `tests/chrono.browser.test.mjs`

- [ ] **Step 1: Test de mise en page** : à 1440, 375 et 320 px, et à 375 px en texte à 200 %, dans les quatre états, FR et EN : rien ne sort de la pièce, rien ne se chevauche, hauteur de la pièce identique d'un état à l'autre (1 px près), boutons et lien d'au moins 44 px de haut. Expected: PASS, ou FAIL à corriger.
- [ ] **Step 2: Captures** des trois états et des quatre mentions à 1440 et 375 px, FR et EN, une image au milieu du roulement, et le focus clavier. Juger : fidélité au jeu, équilibre avec la palette et les polices, lisibilité de la mention, retenue.
- [ ] **Step 3: Corriger** ce que la revue montre, un test d'abord quand le défaut se mesure.
- [ ] **Step 4: Cocher le point 7** dans `docs/AMELIORATIONS.md`, une phrase sur ce qui a été fait.
- [ ] **Step 5: Vérifier** : `npm run check && npm run build && npm test`. Expected: tout passe ; `git diff release -- src tests | LC_ALL=C.UTF-8 grep -cP '^\+.*\x{2014}'` vaut 0.
- [ ] **Step 6: Commit** : « ChronoPotes jouable : ajustements après revue, point 7 de P6 fait »
