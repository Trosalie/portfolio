# Transitions entre une vignette et sa page : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Le cadre d'un projet glisse entre sa vignette, sa couverture et le bandeau « Projet suivant », le reste de la page se fond.

**Architecture:** Les transitions entre documents sont celles du navigateur (`@view-transition`). Un script en ligne dans l'en-tête nomme un seul cadre à `pageswap` (page quittée) et le même projet à `pagereveal` (page ouverte) ; l'identifiant du projet passe par `sessionStorage`. Sans l'une de ces API, la navigation reste celle d'aujourd'hui.

**Tech Stack:** Astro 5 statique, CSS View Transitions, `node --test`, Puppeteer (`tests/browser.mjs`).

**Spec:** `docs/superpowers/specs/2026-11-24-transitions-design.md`

## Global Constraints

- Branche `transitions`. Ne jamais pousser (`release` déploie). Commits en français, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Aucune bibliothèque. Un seul script, d'une trentaine de lignes, en ligne dans l'en-tête (classique, non module : il doit être prêt avant le premier affichage).
- Le script n'est nécessaire à rien d'autre, et aucune erreur ne paraît dans la console, promesses rejetées comprises.
- 300 ms. `prefers-reduced-motion: reduce` : aucune transition.
- Parité FR/EN. Pas de tiret long (U+2014) dans un texte visible.
- Écrire les expressions régulières du script sans barre oblique inverse (`[/]`), ou vérifier le fichier écrit : un outil d'écriture en a déjà supprimé.
- Après chaque tâche : `npm run check`, puis `npm run build:fast && npm test` (environ 160 s).

## Review Focus

1. **Deux clics rapides, ou retour pendant la transition** : la bonne page s'affiche, aucun nom ne reste, aucune erreur. Test en tâche 2.
2. **Ctrl+clic sur une vignette** : le nouvel onglet et la page d'origine n'ont aucun cadre nommé, rien ne reste en mémoire pour la navigation suivante. Test en tâche 2.
3. **Stockage interdit** (`sessionStorage` qui lève une erreur) : navigation intacte, fondu simple. Test en tâche 2.
4. **Adresse avec requête ou ancre** (`/work/seenit/?a=1#x`) : reconnue comme la page de Seenit. Test en tâche 2.
5. **Retour sur une page gardée en mémoire** par le navigateur : aucun nom hérité, la transition suivante fonctionne encore. Test en tâche 2.

---

### Task 1: Les liens de projet et l'impression

**Files:**
- Modify: `src/data/work.ts`, `src/components/work/ProjectTile.astro:23`, `src/components/project/NextProject.astro:21`, `src/styles/global.css`
- Test: `tests/i18n.test.mjs` ou `tests/pages.test.mjs` (celui qui traite des liens), `tests/chrome.browser.test.mjs`, et les tests qui lisent ces liens : `tests/tiles.test.mjs`, `tests/project.test.mjs`, `tests/list.test.mjs`, `tests/list.browser.test.mjs`

**Interfaces:**
- Produces: `projectPath(lang: Lang, id: string): string` dans `src/data/work.ts`, `/work/<id>/` ou `/en/work/<id>/`.

- [ ] **Step 1: Écrire les tests qui échouent**

```js
test('aucun lien vers un projet ne passe par une redirection', () => {
	for (const { path, content } of distFiles(['.html'])) {
		for (const [, href] of content.matchAll(/href="(\/(?:en\/)?work\/[^"]+)"/g)) {
			assert.match(href, /\/$/, `${path} : ${href}`);
		}
	}
});
```

`tests/chrome.browser.test.mjs` : en média `print`, `getComputedStyle('.skip-link').display === 'none'` sur `/` et `/work/seenit/` ; à l'écran, le lien reste atteignable au premier Tab.

- [ ] **Step 2: Constater l'échec** : `npm run build:fast && node --test` sur ces deux fichiers. Expected: FAIL, `/work/seenit` sans barre ; `display` différent de `none`.
- [ ] **Step 3: Implémenter** `projectPath`, l'employer dans `ProjectTile` et `NextProject`, masquer `.skip-link` dans le `@media print` de `global.css`. Adapter les quatre fichiers de tests à la barre finale, sans en affaiblir les assertions.
- [ ] **Step 4: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe.
- [ ] **Step 5: Commit** : « Liens de projet sans redirection, lien d'évitement masqué à l'impression »

---

### Task 2: La transition

**Files:**
- Create: `src/components/PageTransition.astro`, `tests/transitions.browser.test.mjs`, `tests/transitions.test.mjs`
- Modify: `src/components/MainHead.astro` (inclure le composant), `tests/browser.mjs`

**Interfaces:**
- Consumes: liens avec barre finale.
- Produces :
  - `PageTransition.astro` : `<style is:global>` et `<script is:inline>`.
  - `openSite({ args?: string[] } = {})` : drapeaux Chrome en plus.
  - Nom de transition `project`, variable `--frame-ground`, clé `sessionStorage` `project-frame`.

- [ ] **Step 1: Écrire les tests qui échouent**

`tests/transitions.test.mjs` (sur `dist/`) : sur `/`, `/work/`, `/work/seenit/`, `/en/work/`, `/contact/`, le CSS de la page contient `@view-transition` à l'intérieur d'un `@media (prefers-reduced-motion:no-preference)` et nulle part ailleurs ; le `<head>` contient un `<script>` sans `type="module"` où figure `pagereveal` ; ce script fait moins de 2500 caractères. `/cv-print/` n'en a pas.

`tests/transitions.browser.test.mjs`. Aide `observe(page)`, posée par `evaluateOnNewDocument` avant toute navigation :
- à `pageswap`, par un écouteur ajouté après `DOMContentLoaded` (donc après celui du script) : note dans `sessionStorage` la classe (`tile`, `cover`, `band`) et le projet de chaque cadre dont `style.viewTransitionName` n'est pas vide ;
- à `pagereveal`, `viewTransition?.ready` puis : note `window.seen` = `{ old, named, groups }`, avec `old` la note de la page quittée, `named` la même note pour la page ouverte, `groups` les `effect.pseudoElement` de `document.getAnimations()`.

`glides(page, from, to)` vérifie : `old` = `[from]`, `named` = `[to]` (un seul cadre de chaque côté), `groups` contient `::view-transition-old(project)` et `::view-transition-new(project)` ; puis, la transition finie, plus aucun `viewTransitionName` ni `--frame-ground`. `fades(page)` : `groups` contient `::view-transition-new(root)`, aucun `project`. Chaque test échoue si la console reçoit une erreur (`pageerror` et `console` de type `error`).

| Test | Attendu |
|---|---|
| `/work/` vers Seenit, Covoit'Etud ; `/` vers Seenit ; `/en/work/` vers Seenit | glisse : `tile seenit` vers `cover seenit`, etc. |
| `/work/seenit/`, « Projet suivant » | `band bluepoint…` vers `cover bluepoint…` |
| projet ouvert depuis la liste, retour du navigateur | `cover` vers `tile` |
| « Projet suivant », retour du navigateur | `cover` vers `band` |
| `/work/chronopotes/`, « Retour aux projets » (vignette visible en haut) | `cover` vers `tile` |
| `/work/covoit-etud/`, « Retour aux projets » (vignette hors de l'écran) | fondu |
| sélecteur de langue sur `/work/seenit/` | `cover` vers `cover` |
| `/` vers `/contact/` | fondu |
| 375 × 667, `/work/` vers ChronoPotes | fondu (couverture hors de l'écran) |
| 375 × 812, `/work/` vers Seenit, au doigt | glisse |
| vignette ouverte au clavier (Entrée) | glisse |
| départ `/work/?a=1#x` vers Seenit ; `/work/seenit/?a=1`, « Retour aux projets » visible ou non | reconnus selon les mêmes règles |
| le fond du cadre | `--frame-ground` vaut la couleur de fond du cadre pendant la transition, vide ensuite |
| mouvement réduit | `pagereveal` sans `viewTransition`, page ouverte |
| durée | tous les `effect.getTiming().duration` valent 300 |
| API absentes (`openSite({ args: ['--disable-blink-features=ViewTransitionOnNavigation,PageSwapEvent,PageRevealEvent'] })`) | page ouverte, aucune erreur |
| `sessionStorage` qui lève une erreur | page ouverte, fondu, aucune erreur |
| deux clics rapides sur deux vignettes | la page de la dernière, aucun nom restant |
| retour pendant la transition | `/work/`, aucun nom restant |
| Ctrl+clic sur une vignette, puis clic vers `/contact/` | fondu, aucun nom, clé absente de `sessionStorage` |
| aller, retour, aller, retour (cache du navigateur) | glisse quatre fois, aucun nom restant |

- [ ] **Step 2: Constater l'échec** : `node --test tests/transitions.test.mjs tests/transitions.browser.test.mjs`. Expected: FAIL partout sauf « API absentes » et « mouvement réduit », garde-fous déjà verts.
- [ ] **Step 3: CSS.** `@view-transition { navigation: auto; }` sous `prefers-reduced-motion: no-preference` ; `animation-duration: 300ms` sur `::view-transition-group(*)`, `-old(*)`, `-new(*)` ; `::view-transition-group(project) { background: var(--frame-ground); overflow: clip; }`.
- [ ] **Step 4: Script.** Décisions :
  - `slug(url)` : projet d'une adresse par son chemin (`/work/x/` ou `/en/work/x/`, barre finale facultative).
  - `frameOf(x)` : sur la page de `x`, `.project-frame.cover` ; ailleurs, le cadre d'un `a.tile` ou `.next-project` qui mène à `x`. Rien s'il n'est pas au moins en partie dans l'écran.
  - `pageswap` : vider la clé ; sans `viewTransition` ou `activation`, ne rien faire ; sinon essayer la destination, puis la page quittée ; nommer le cadre, garder l'identifiant.
  - `pagereveal` : retirer d'abord tout nom et `--frame-ground` ; lire puis vider la clé ; nommer le cadre de ce projet et poser `--frame-ground` ; nettoyer quand `finished` se règle.
  - Aux deux événements, `catch` vide sur `ready`, `finished` et `updateCallbackDone`. Accès à `sessionStorage` sous `try`.
- [ ] **Step 5: Vérifier** : `npm run check && npm run build:fast && npm test`, deux fois. Expected: tout passe les deux fois. Casser ensuite une à une cinq décisions (visibilité, destination avant page quittée, nettoyage, vidage de la clé, média de mouvement réduit) : un test au moins doit échouer à chaque fois.
- [ ] **Step 6: Commit** : « Transitions : le cadre du projet glisse entre sa vignette et sa page »

---

### Task 3: Revue à l'œil et suivi

**Files:**
- Modify: `docs/AMELIORATIONS.md` (P6, point 6), et les styles que la revue corrige

- [ ] **Step 1: Images au ralenti** (durée portée à 3 s dans le navigateur seulement), à 1440 et 375 px, pour les cinq sens du tableau de la spec, sur un cadre sombre (Seenit), un cadre clair (SportPXL) et un cadre sans liseré (Covoit'Etud). Juger : bande transparente, éclat, cadre voisin qui bouge, saut en fin de course.
- [ ] **Step 2: Corriger** ce que la revue montre, un test d'abord quand le défaut se mesure.
- [ ] **Step 3: Cocher le point 6** dans `docs/AMELIORATIONS.md`, une phrase sur ce qui a été fait.
- [ ] **Step 4: Vérifier** : `npm run check && npm run build:fast && npm test`. Expected: tout passe ; `git diff release -- src tests | LC_ALL=C.UTF-8 grep -cP '^\+.*\x{2014}'` vaut 0.
- [ ] **Step 5: Commit** : « Transitions : ajustements après revue, point 6 de P6 fait »
