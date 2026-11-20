# Direction visuelle « La vitrine » : plan de réalisation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer l'habillage du thème Astro Portfolio par la direction « La vitrine » : un cadre sobre (mur gris, encre bleu nuit, Schibsted Grotesk), des projets présentés dans leur propre identité, un nuancier sur les pages projet, un seul thème clair et un CV recoloré.

**Architecture:** Les jetons de `src/styles/global.css` sont remplacés en une fois, puis chaque groupe de composants est réécrit sur ces jetons. L'identité d'un projet devient une donnée facultative de la collection de contenu (`identity`), lue par trois nouveaux composants (cadre, étiquette, vignette) et par le nuancier. Les pages dupliquées par langue (accueil, liste des projets, à propos) deviennent des composants uniques. Les tests sont des scripts `node:test` sans dépendance qui lisent la sortie `dist/` et quelques modules TypeScript purs.

**Tech Stack:** Astro 5 (statique), TypeScript strict, `@fontsource`, Node 26 (`node --test`, exécution native du TypeScript effaçable), Puppeteer pour les PDF du CV ; Vite + Vitest dans l'outil `C:\dev\candidatures`.

**Spec:** `docs/superpowers/specs/2026-11-20-direction-visuelle-design.md`

## Global Constraints

- Branche `direction-visuelle` du dépôt `C:\dev\portfolio`. Ne jamais pousser `release` (un push y déploie le site).
- Jetons : `--wall: #E6E6E2`, `--ink: #1C2230`, `--ink-muted: #555C6B`, `--rule: #C8C9C3`, `--paper: #FFFFFF`. Aucune couleur d'accent propre au portfolio.
- `--rule` ne délimite jamais un élément interactif ; les champs de formulaire ont une bordure `--ink-muted`.
- Police unique du site : Schibsted Grotesk (`@fontsource-variable/schibsted-grotesk`, famille CSS `'Schibsted Grotesk Variable'`), graisses 400 à 700. Aucune requête vers `fonts.googleapis.com` ni `fonts.gstatic.com`.
- Échelle (rem) : 0,8125 · 0,875 · 1 · 1,125 · 1,3125 · 1,5 · 2,25 · 3. Texte courant 1 rem, interligne 1,5, 65 caractères au plus par ligne ; titres interligne 1,1.
- Casse de phrase partout : aucune `text-transform: uppercase` ni capitale espacée hors du nom ChronoPotes dans son cadre et hors du document CV ; aucune étiquette au-dessus des titres ; aucun point médian « · » comme séparateur ; aucune flèche ajoutée au texte d'un lien ou d'un bouton.
- Le nom s'écrit « Thibault Rosalie » sur le site ; « ROSALIE » reste propre au CV.
- Rayon 3 px pour boutons et champs, 2 px ou 0 pour les images ; aucune ombre portée ; pas de pilules.
- Pas d'animation d'entrée ni d'effet de survol qui soulève ou agrandit ; le survol souligne. Focus : `outline: 2px solid var(--ink); outline-offset: 3px` sur `:focus-visible`.
- Parité FR/EN : tout texte vit dans `src/i18n/ui.ts` ou dans les deux collections `work`/`work-en`.
- Le CV garde Rubik et Public Sans et doit tenir sur une page A4 en FR et en EN (`npm run build` échoue sinon).
- Chaque message de commit se termine par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Messages en français, comme l'historique du dépôt.
- L'outil `C:\dev\candidatures` est un dépôt privé distinct : y commiter seulement les fichiers CSS touchés (des fichiers de données y sont déjà modifiés par Thibault et ne doivent pas être commités), ne jamais le pousser.

## Review Focus

1. Titre long sans capture (« Projet Chat Multi-Channels ») dans une vignette à 375 px : le titre en grand passe à la ligne sans déborder du cadre. Vérifié à la tâche 10, étape 2.
2. Accueil et pages projet à 375 px : menu replié utilisable, liens FR/EN atteignables, titre de l'accueil à 2,25 rem sans débordement horizontal. Vérifié à la tâche 10, étape 2.
3. Navigation au clavier : focus visible sur chaque vignette (lien entier), sur le bouton de démo `--ink`, sur les flèches du carrousel et sur les champs du formulaire. Vérifié à la tâche 10, étape 3.
4. Chaîne de traduction manquante en anglais : `useTranslations` retombe silencieusement sur le français. Testé par `tests/i18n.test.mjs` (tâche 2).
5. Identité saisie dans une seule langue ou avec des codes couleur différents entre FR et EN : le build doit échouer en nommant le projet. Testé par `tests/identity.test.mjs` (tâche 3).

## Fichiers

| Fichier | Responsabilité |
|---|---|
| `tests/helpers.mjs` | lecture de `dist/`, extraction de texte, découpe de fragments HTML |
| `tests/*.test.mjs` | un fichier par tâche, lancés par `npm test` |
| `src/styles/global.css` | jetons, base typographique, utilitaires |
| `src/data/identity.ts` | type `ProjectIdentity`, listes fermées, contrôle de parité `identityGaps` (sans import Astro, testable par Node) |
| `src/components/work/ProjectFrame.astro` | le cadre d'un projet (vignette ou couverture) |
| `src/components/work/ProjectCartel.astro` | l'étiquette d'un projet |
| `src/components/work/ProjectTile.astro` | la vignette : lien, cadre, étiquette |
| `src/components/pages/HomePage.astro`, `WorkListPage.astro`, `AboutPage.astro` | pages communes aux deux langues |
| `src/components/project/IdentitySpecimen.astro` | le nuancier |
| `src/components/project/specimens/SeenitTicket.astro`, `ChronoFlaps.astro` | les pièces d'interface |

Supprimés au fil des tâches : `ThemeToggle.astro`, `PortfolioPreview.astro`, `Grid.astro`, `Skills.astro`, `CallToAction.astro`, `Pill.astro`, `Hero.astro`, `WorkInProgress.astro`, `public/assets/backgrounds/`, `public/assets/stock-*.jpg`, `public/assets/at-work.jpg`.

---

### Task 1: Fondations : jetons, police, thème unique

**Files:**
- Create: `tests/helpers.mjs`, `tests/foundations.test.mjs`
- Modify: `package.json` (script `test`, dépendance de police), `src/styles/global.css`, `src/components/MainHead.astro`, `src/layouts/BaseLayout.astro`, `src/components/Nav.astro` (retrait du bouton de thème seulement), `src/styles/cv-screen.css` (suppression des seules règles `:root.theme-dark`)
- Delete: `src/components/ThemeToggle.astro`, `public/assets/backgrounds/`, `public/assets/stock-1.jpg` à `stock-4.jpg`, `public/assets/at-work.jpg`

**Interfaces:**
- Produces (tests) : dans `tests/helpers.mjs`
  - `page(route: string): string` : HTML de `dist/<route>/index.html` (`'/'` → `dist/index.html`, `'/404'` → `dist/404.html`) ; lève une erreur si le fichier manque.
  - `text(html: string): string` : retire `<script>`, `<style>`, les balises, décode `&amp; &lt; &gt; &quot; &#39; &#x27; &nbsp; &copy;` et resserre les espaces.
  - `chunk(html: string, start: string, end = '</a>'): string` : de la première occurrence de `start` jusqu'à la fin de la première occurrence de `end` qui suit ; lève une erreur si `start` est absent.
  - `distFiles(exts = ['.html', '.css']): { path: string, content: string }[]` : tous les fichiers de `dist/` ayant ces extensions.
  - `pageCss(route: string): string` : le contenu des `<style>` de la page et des feuilles `/_astro/*.css` qu'elle lie.
  - `srcFiles(exts = ['.astro', '.css', '.ts']): { path: string, content: string }[]` : tous les fichiers de `src/` ayant ces extensions.
- Produces (CSS) : jetons `--wall`, `--ink`, `--ink-muted`, `--rule`, `--paper`, `--font-sans: 'Schibsted Grotesk Variable', system-ui, sans-serif`, `--step--2: 0.8125rem`, `--step--1: 0.875rem`, `--step-0: 1rem`, `--step-1: 1.125rem`, `--step-2: 1.3125rem`, `--step-3: 1.5rem`, `--step-4: 2.25rem`, `--step-5: 3rem`, `--radius: 3px`, `--measure: 65ch`. Les utilitaires `.sr-only`, `.skip-link`, `.wrapper`, `.stack`, `.gap-*` et `.lg:gap-*` restent.

- [ ] **Step 1: Écrire les tests**

`package.json` : `"test": "node --test \"tests/**/*.test.mjs\""`.

`tests/foundations.test.mjs` (routes à couvrir : `['/', '/en/', '/work/', '/cv/', '/contact/']`) :

```js
test('aucune police chargée depuis Google', () => {
  for (const f of distFiles(['.html'])) {
    assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(f.content), f.path);
  }
});
test('un seul thème clair', () => {
  for (const f of distFiles()) {
    assert.ok(!f.content.includes('theme-dark'), f.path);
    assert.ok(!f.content.includes('<theme-toggle'), f.path);
  }
  for (const r of ROUTES) assert.match(page(r), /<meta name="color-scheme" content="light"/);
});
test('Schibsted Grotesk est la police du site', () => {
  assert.match(pageCss('/'), /@font-face\s*{[^}]*Schibsted Grotesk Variable/);
});
test('les jetons de couleur existent', () => {
  const all = distFiles().map((f) => f.content).join('\n');
  for (const [name, hex] of [['wall', 'e6e6e2'], ['ink', '1c2230'], ['ink-muted', '555c6b'], ['rule', 'c8c9c3'], ['paper', 'fff']]) {
    assert.match(all, new RegExp(`--${name}:\\s*#${hex}`, 'i'));
  }
});
test('les fonds et images du modèle ont disparu', () => {
  for (const p of ['assets/backgrounds', 'assets/stock-1.jpg', 'assets/at-work.jpg']) {
    assert.ok(!existsSync(new URL(`../dist/${p}`, import.meta.url)), p);
  }
});
```

(`--paper` peut sortir minifié en `#fff` : le motif `#fff` accepte aussi `#ffffff`.)

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npm run build:fast && npm test`
Expected: FAIL sur les cinq tests (Google Fonts présent, `theme-dark` présent, police absente, jetons absents, fonds présents).

- [ ] **Step 3: Installer la police et réécrire les fondations**

- `npm install @fontsource-variable/schibsted-grotesk`, importé dans le frontmatter de `MainHead.astro` (`import '@fontsource-variable/schibsted-grotesk';`). Les paquets `@fontsource/public-sans` et `@fontsource/rubik` restent : le CV en dépend.
- `MainHead.astro` : retirer les `preconnect`, le lien Google Fonts et le script de thème ; ajouter `<meta name="color-scheme" content="light" />`.
- `global.css` : remplacer tout le bloc `:root` et le bloc `:root.theme-dark` par les jetons de l'interface ci-dessus. Base : `body { background: var(--wall); color: var(--ink); font-family: var(--font-sans); font-size: var(--step-0); line-height: 1.5; }`, titres 600 interligne 1,1 en `--ink`, liens soulignés `text-underline-offset: 0.2em` en `currentColor`, règle globale `:focus-visible` du Global Constraints. `.skip-link` restylé sur `--paper` et `--ink`, rayon `--radius`.
- `BaseLayout.astro` : retirer le `<style>` des fonds, la classe `backgrounds` et le script `loaded`. Garder le `div.stack` qui structure la page.
- `cv-screen.css` : supprimer les règles `:root.theme-dark …` et rien d'autre (sa réécriture est la tâche 7).
- `Nav.astro` : retirer l'import et l'usage de `ThemeToggle` (la refonte de la navigation est la tâche 2).
- Supprimer les fichiers listés en tête de tâche.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `npm run check && npm run build:fast && npm test`
Expected: `astro check` sans erreur, 5 tests PASS. Les pages paraissent dépouillées : les composants sont restylés par les tâches suivantes.

- [ ] **Step 5: Commit**

```bash
git add -A package.json package-lock.json tests src public
git commit -m "Fondations de la vitrine : jetons, Schibsted Grotesk, thème clair unique"
```

---

### Task 2: Navigation, sélecteur de langue, pied de page

**Files:**
- Create: `tests/i18n.test.mjs`, `tests/chrome.test.mjs`
- Modify: `src/components/Nav.astro`, `src/components/LangToggle.astro`, `src/components/Footer.astro`, `src/i18n/ui.ts` (retrait de `footer.madeWith`)

**Interfaces:**
- Consumes: jetons et helpers de la tâche 1.
- Produces: la navigation garde son élément `menu-button` et son repli sous 50em ; `LangToggle` rend deux liens `<a hreflang lang>` ; la langue courante porte `aria-current="page"`.

- [ ] **Step 1: Écrire les tests**

`tests/i18n.test.mjs` :

```js
import { ui } from '../src/i18n/ui.ts';
test('chaque clé existe dans les deux langues', () => {
  assert.deepEqual(Object.keys(ui.en).sort(), Object.keys(ui.fr).sort());
});
```

`tests/chrome.test.mjs` :

```js
test('le nom seul, sans icône, ouvre la navigation', () => {
  const nav = chunk(page('/'), '<nav', '</nav>');
  assert.match(nav, /class="site-title"[^>]*>\s*Thibault Rosalie\s*<\/a>/);
});
test('FR et EN sont deux liens, la langue courante est marquée', () => {
  const fr = chunk(page('/work/'), 'class="lang', '</div>');
  assert.match(fr, /<a[^>]*href="\/work\/"[^>]*aria-current="page"[^>]*>FR<\/a>/);
  assert.match(fr, /<a[^>]*href="\/en\/work\/"[^>]*hreflang="en"[^>]*>EN<\/a>/);
  assert.ok(!fr.includes('role="switch"'));
});
test('le pied de page ne cite plus Astro', () => {
  const year = new Date().getFullYear();
  for (const r of ['/', '/en/']) {
    const footer = text(chunk(page(r), '<footer', '</footer>'));
    assert.ok(footer.includes(`© ${year} Thibault Rosalie`));
    assert.ok(!/Astro|Créé avec|Built with/.test(footer));
  }
});
```

(L'ordre des attributs dans les motifs suit l'ordre d'écriture de `LangToggle.astro` : `href`, `hreflang`, `lang`, `aria-current`. Adapter le motif si le composant les écrit dans un autre ordre, sans affaiblir l'assertion.)

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npm run build:fast && npm test`
Expected: `i18n` PASS (déjà vrai, il protège la suite), les trois tests de `chrome` FAIL.

- [ ] **Step 3: Réécrire les trois composants**

- `Nav.astro` : lien `site-title` contenant seulement « Thibault Rosalie », 600, sans icône. Liens texte en `--step--1`, `--ink`, page courante soulignée (2 px, décalage 0,35em), pas de fond ni de pilule ni de `::before` en dégradé. Icônes GitHub et LinkedIn conservées avec leur libellé `sr-only`. Sous 50em, le menu replié garde son comportement ; panneau sur `--wall` séparé par un filet `--rule`, sans ombre.
- `LangToggle.astro` : `<div class="lang">` contenant deux liens `FR` et `EN`. Le lien de la langue courante pointe vers la page courante (`Astro.url.pathname`) avec `aria-current="page"` et souligné ; l'autre vers `getAlternateLangPath(Astro.url)`. Chaque lien porte `hreflang` et `lang` (`fr`, `en`). Retirer `role="switch"`, `aria-checked` et la glissière.
- `Footer.astro` : une ligne, « © {année} Thibault Rosalie » à gauche, liens texte GitHub et LinkedIn à droite, en `--ink-muted`, `--step--1`. Retirer l'icône fusée et la clé `footer.madeWith` des deux langues.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `npm run check && npm run build:fast && npm test`
Expected: tous les tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A tests src
git commit -m "Navigation, langues et pied de page dans le cadre de la vitrine"
```

---

### Task 3: L'identité des projets, en données

**Files:**
- Create: `src/data/identity.ts`, `tests/identity.test.mjs`
- Modify: `src/content.config.ts`, `src/data/work.ts`, `src/components/project/FeatureGrid.astro`, `src/components/PortfolioPreview.astro`, `src/components/project/ProjectCover.astro`, les 12 fichiers de `src/content/work/` et `src/content/work-en/`

**Interfaces:**
- Produces, dans `src/data/identity.ts` (aucun import autre que `import type`, pour rester exécutable par Node) :
  - `export const titleStyles = ['oswald-caps', 'playfair-italic'] as const;`
  - `export const specimenFonts = ['Playfair Display', 'DM Sans', 'DM Mono', 'Oswald', 'Space Mono'] as const;`
  - `export const specimens = ['seenit-ticket', 'chronopotes-flaps'] as const;`
  - `export interface ProjectIdentity { frame: { background: string; border?: string; titleColor: string; titleStyle: (typeof titleStyles)[number] }; palette: { name: string; hex: string }[]; fonts: { family: (typeof specimenFonts)[number]; role: string }[]; specimen: (typeof specimens)[number] }`
  - `export function identityGaps(fr: ProjectIdentity | undefined, en: ProjectIdentity | undefined): string[]`
- Produces, dans la collection : champ `identity` facultatif ; `gradient` et `features[].icon` disparaissent. `ProjectFeature` perd `icon`.

- [ ] **Step 1: Écrire les tests de `identityGaps`**

`tests/identity.test.mjs`, avec une identité de référence `base` (celle de ChronoPotes ci-dessous) et des copies modifiées :

```js
test('deux identités identiques, ou deux absentes : aucun écart', () => {
  assert.deepEqual(identityGaps(base, structuredClone(base)), []);
  assert.deepEqual(identityGaps(undefined, undefined), []);
});
test('les noms et rôles traduits ne sont pas des écarts', () => {
  const en = structuredClone(base); en.palette[0].name = 'Night'; en.fonts[0].role = 'Text';
  assert.deepEqual(identityGaps(base, en), []);
});
test('la casse des codes couleur est ignorée', () => {
  const en = structuredClone(base); en.palette[0].hex = '#101216'.toLowerCase();
  assert.deepEqual(identityGaps(base, en), []);
});
test('identité dans une seule langue', () => {
  assert.deepEqual(identityGaps(base, undefined), ['identité visuelle présente dans une seule langue']);
});
test('couleur différente', () => {
  const en = structuredClone(base); en.palette[1].hex = '#F5C519';
  assert.deepEqual(identityGaps(base, en), ['couleur 2 : #F5C518 en français contre #F5C519 en anglais']);
});
test('nombre de couleurs différent', () => {
  const en = structuredClone(base); en.palette.pop();
  assert.deepEqual(identityGaps(base, en), ['4 couleur(s) en français contre 3 en anglais']);
});
test('cadre, polices ou pièce différents', () => {
  const a = structuredClone(base); a.frame.titleColor = '#FFFFFF';
  assert.deepEqual(identityGaps(base, a), ['cadre différent']);
  const b = structuredClone(base); b.fonts[0].family = 'DM Sans';
  assert.deepEqual(identityGaps(base, b), ['polices différentes']);
  const c = structuredClone(base); c.specimen = 'seenit-ticket';
  assert.deepEqual(identityGaps(base, c), ["pièce d'interface différente"]);
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npm test`
Expected: FAIL, module `src/data/identity.ts` introuvable.

- [ ] **Step 3: Écrire `src/data/identity.ts`**

Comparaisons dans l'ordre des messages ci-dessus, codes couleur comparés en majuscules, écarts de palette élément par élément quand les longueurs sont égales. Les messages sont exactement ceux des tests.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `npm test`
Expected: les tests d'`identity` PASS.

- [ ] **Step 5: Brancher le schéma, le contrôle de parité et le contenu**

- `content.config.ts` : `const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/)` ; `identity: z.object({ frame: z.object({ background: hex, border: hex.optional(), titleColor: hex, titleStyle: z.enum(titleStyles) }), palette: z.array(z.object({ name: z.string(), hex })).min(2).max(6), fonts: z.array(z.object({ family: z.enum(specimenFonts), role: z.string() })).min(1), specimen: z.enum(specimens) }).optional()`. Retirer `gradient` et le champ `icon` du schéma des fonctionnalités, ainsi que l'import d'`iconPaths`.
- `work.ts` : `listStructuralGaps` ajoute `identityGaps(frEntry.data.identity, enEntry.data.identity)` à ses écarts ; `ProjectFeature` perd `icon` et l'import d'`IconPaths`.
- Garder le build vert sans anticiper les tâches suivantes : `FeatureGrid.astro` n'affiche plus d'icône (le losange de repli devient le seul marqueur) ; `PortfolioPreview.astro` et `ProjectCover.astro` remplacent `data.gradient` par `var(--ink)`.
- Contenu : retirer les lignes `gradient:` et `icon:` des 12 fichiers. Ajouter `identity` à `seenit.md` et `chronopotes.md` dans les deux langues :

| | Seenit | ChronoPotes |
|---|---|---|
| `frame` | `background: "#2C1C0F"`, `border: "#4D331E"`, `titleColor: "#C5A059"`, `titleStyle: playfair-italic` | `background: "#101216"`, `titleColor: "#F5C518"`, `titleStyle: oswald-caps` |
| `palette` FR | Bois `#2C1C0F`, Laiton `#C5A059`, Velours `#3A1214`, Ivoire `#EFEBD9` | Nuit `#101216`, Signal `#F5C518`, Palette `#20242C`, Cadran `#F4F1E8` |
| `palette` EN | Wood, Brass, Velvet, Ivory (mêmes codes) | Night, Signal, Flap, Dial (mêmes codes) |
| `fonts` FR | Playfair Display « Titres », DM Sans « Texte », DM Mono « Chiffres » | Oswald « Textes », Space Mono « Chiffres » |
| `fonts` EN | Headings, Body text, Figures | Text, Figures |
| `specimen` | `seenit-ticket` | `chronopotes-flaps` |

- [ ] **Step 6: Vérifier le build et le contrôle de parité**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout PASS. Puis changer temporairement `#C5A059` en `#C5A05A` dans `src/content/work-en/seenit.md`, relancer `npm run build:fast` : le build échoue avec un message qui contient `seenit` et `couleur 2 : #C5A059 en français contre #C5A05A en anglais`. Annuler la modification.

- [ ] **Step 7: Commit**

```bash
git add -A src tests
git commit -m "Identité visuelle des projets en données, contrôlée entre les deux langues"
```

---

### Task 4: La vignette et la liste des projets

**Files:**
- Create: `src/components/work/ProjectFrame.astro`, `src/components/work/ProjectCartel.astro`, `src/components/work/ProjectTile.astro`, `src/components/pages/WorkListPage.astro`, `tests/tiles.test.mjs`
- Modify: `src/pages/work.astro`, `src/pages/en/work.astro`, `src/components/project/ProjectCover.astro`, `src/i18n/ui.ts`

**Interfaces:**
- Consumes: `ProjectIdentity` et `titleStyles` (tâche 3), `workBasePath`, `projectYear` (`src/data/work.ts`).
- Produces:
  - `ProjectFrame.astro`, props `{ entry: WorkEntry; variant: 'tile' | 'cover'; featured?: boolean }`. Racine `<div class="project-frame" data-frame="identity|ink" style="--frame-bg:…;--frame-border:…;--frame-title:…">`. Sans identité : `--ink`, `--ink`, `#FFFFFF` et la classe de titre `title--site`. En `tile` : le nom du projet en `<span class="frame-title title--<titleStyle>" aria-hidden="true">`, image `alt=""`, `loading="lazy"`. En `cover` : pas de nom, `alt={img_alt}`, `loading="eager"`. Sans image : `<span class="frame-name">` avec le titre en grand, et pas de `frame-title` en double.
  - `ProjectCartel.astro`, props `{ entry: WorkEntry; withDescription?: boolean }` : ligne 1 `<strong>{title}</strong>, {année}`, ligne 2 `context` s'il existe, puis la description si demandée, puis `tags.join(', ')`. Fond `--paper`.
  - `ProjectTile.astro`, props `{ entry: WorkEntry; lang: Lang; featured?: boolean; withDescription?: boolean }` : `<a class="tile" href="{workBasePath(lang)}{entry.id}">` contenant cadre et étiquette.
  - `WorkListPage.astro`, sans props (langue lue dans l'URL) ; les deux routes ne font plus que l'inclure.
  - Clé i18n `work.title` : « Projets » / « Projects ». Clés retirées : `work.tagline`, `work.card.featured`.

- [ ] **Step 1: Écrire les tests**

`tests/tiles.test.mjs` (fragment d'une vignette : `chunk(html, 'href="/work/<slug>"')`) :

```js
test('la liste a un titre court et pas de phrase d’introduction', () => {
  assert.match(page('/work/'), /<h1[^>]*>\s*Projets\s*<\/h1>/);
  assert.match(page('/en/work/'), /<h1[^>]*>\s*Projects\s*<\/h1>/);
  assert.ok(!text(page('/work/')).includes('Découvrez'));
});
test('ChronoPotes et Seenit dans leur identité', () => {
  const c = chunk(page('/work/'), 'href="/work/chronopotes"');
  assert.match(c, /data-frame="identity"/);
  assert.match(c, /--frame-bg:\s*#101216/i);
  assert.match(c, /title--oswald-caps/);
  const s = chunk(page('/work/'), 'href="/work/seenit"');
  assert.match(s, /--frame-border:\s*#4D331E/i);
  assert.match(s, /title--playfair-italic/);
});
test('un projet sans identité prend le cadre encre', () => {
  assert.match(chunk(page('/work/'), 'href="/work/bluepoint-waste-identifier"'), /data-frame="ink"/);
});
test('un projet sans capture montre son titre en grand, sans image', () => {
  const t = chunk(page('/work/'), 'href="/work/projet-chat"');
  assert.ok(!t.includes('<img'));
  assert.match(t, /class="frame-name"[^>]*>\s*Projet Chat Multi-Channels/);
});
test('l’étiquette suit la convention du cartel', () => {
  const t = text(chunk(page('/work/'), 'href="/work/chronopotes"'));
  assert.ok(t.includes('ChronoPotes, 2026'));
  assert.ok(t.includes('Projet personnel, en ligne'));
  assert.ok(t.includes('React, TypeScript, Supabase, PostgreSQL, PWA'));
  assert.ok(!t.includes('·'));
});
test('le nom dans le cadre est caché aux lecteurs d’écran', () => {
  assert.match(chunk(page('/work/'), 'href="/work/seenit"'), /class="frame-title[^"]*"[^>]*aria-hidden="true"/);
});
test('les liens anglais restent en anglais', () => {
  assert.ok(page('/en/work/').includes('href="/en/work/seenit"'));
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npm run build:fast && npm test`
Expected: les tests de `tiles` FAIL (titre « Mes Projets », pas de `data-frame`).

- [ ] **Step 3: Écrire les trois composants et la page**

- Polices des titres de produit dans `ProjectFrame.astro` : `npm install @fontsource/oswald @fontsource/playfair-display`, imports `@fontsource/oswald/latin-600.css` et `@fontsource/playfair-display/latin-600-italic.css`. `.title--oswald-caps` : Oswald 600, capitales, interlettrage 0,05em ; `.title--playfair-italic` : Playfair Display 600 italique ; `.title--site` : `--font-sans` 600.
- Cadre : fond `--frame-bg`, liseré intérieur de 0,35em en `--frame-border` quand il diffère du fond, marge intérieure 1,4em, image en rayon 2 px. `.frame-name` : `--step-4`, 600, `overflow-wrap: anywhere`, couleur `--frame-title`.
- Vignette : aucun soulèvement ni zoom ; au survol, le titre de l'étiquette se souligne.
- `WorkListPage.astro` : `h1` `work.title`, le projet le plus récent en `featured` sur toute la largeur (cadre et étiquette côte à côte au-delà de 50em), les autres en grille de deux colonnes, `withDescription` sur toutes les vignettes, puis `ContactCTA`.
- `ProjectCover.astro` devient un appel à `ProjectFrame` en variante `cover`.
- `PortfolioPreview.astro` et `Grid.astro` restent : l'accueil les importe jusqu'à la tâche 5, qui les supprime.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src tests package.json package-lock.json
git commit -m "Vignettes de projet dans leur identité et liste des projets"
```

---

### Task 5: L'accueil

**Files:**
- Create: `src/components/pages/HomePage.astro`, `tests/home.test.mjs`
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro`, `src/components/ContactCTA.astro`, `src/i18n/ui.ts`
- Delete: `src/components/Skills.astro`, `src/components/CallToAction.astro`, `src/components/PortfolioPreview.astro`, `src/components/Grid.astro`

**Interfaces:**
- Consumes: `ProjectTile` (tâche 4), `getWorkCollection`.
- Produces: clés i18n partagées `cta.cv` (« Lire le CV » / « Read my resume ») et `cta.contact` (« M'écrire » / « Get in touch »), réutilisées par la page À propos (tâche 8).

Textes exacts :

| Clé | Français | Anglais |
|---|---|---|
| `index.hero.title` | Je conçois et je développe des applications web, de la base de données jusqu'au dernier détail de l'interface. | I design and build web applications, from the database to the last detail of the interface. |
| `index.hero.tagline` | Diplômé du BUT Informatique à Bayonne, je cherche un premier poste de développeur full stack. | I hold a Computer Science degree (BUT) from Bayonne and I'm looking for my first full stack developer role. |
| `index.projects.cta` | Voir tous les projets | View all projects |
| `contactcta.title` | Vous recrutez un développeur full stack ? | Hiring a full stack developer? |

Clés retirées : `index.hero.cta`, `index.hero.role.dev`, `index.hero.role.fullstack`, `index.projects.title`, `index.projects.desc`, `index.skills.*`, `skills.*`, `contactcta.cta` (remplacée par `cta.contact`). `index.hero.portrait.alt` reste (Open Graph et page À propos).

- [ ] **Step 1: Écrire les tests**

`tests/home.test.mjs` :

```js
test('l’en-tête dit ce que fait Thibault', () => {
  assert.match(text(chunk(page('/'), '<h1', '</h1>')), /^Je conçois et je développe des applications web, de la base de données jusqu'au dernier détail de l'interface\.$/);
  assert.match(text(chunk(page('/en/'), '<h1', '</h1>')), /^I design and build web applications, from the database to the last detail of the interface\.$/);
});
test('le bouton mène au CV, le lien au contact', () => {
  const hero = chunk(page('/'), '<h1', 'class="tiles"');
  assert.match(hero, /href="\/cv\/"[^>]*>\s*Lire le CV\s*</);
  assert.match(hero, /href="\/contact\/"/);
  assert.match(page('/en/'), /href="\/en\/cv\/"[^>]*>\s*Read my resume\s*</);
});
test('quatre vignettes puis un lien vers tous les projets', () => {
  assert.equal(page('/').match(/class="tile[" ]/g).length, 4);
  assert.match(page('/'), /href="\/work\/"[^>]*>\s*Voir tous les projets\s*</);
});
test('ni compétences, ni portrait, ni salutation', () => {
  const t = text(page('/'));
  for (const gone of ['Compétences', 'Bonjour', 'Back-end', 'Photo de profil']) assert.ok(!t.includes(gone), gone);
  assert.ok(!page('/').includes('alt="Photo de profil'));
});
test('le bloc de contact est une phrase et un lien', () => {
  assert.ok(text(page('/')).includes('Vous recrutez un développeur full stack ? M\'écrire'));
  assert.ok(text(page('/en/')).includes('Hiring a full stack developer? Get in touch'));
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npm run build:fast && npm test`
Expected: les tests de `home` FAIL (« Bonjour, je m'appelle… »).

- [ ] **Step 3: Écrire l'accueil et le bloc de contact**

- `HomePage.astro` : `main#main-content` ; en-tête aligné à gauche, `h1` en `clamp(var(--step-4), 4vw, var(--step-5))`, 600, interlettrage -0,02em, largeur max 22ch ; phrase en `--ink-muted`, largeur max `--measure` ; bouton `cta.cv` (fond `--ink`, texte blanc, rayon `--radius`, 0,7em 1,2em) et lien souligné `cta.contact`. Puis `<ul class="tiles">` des quatre projets (deux colonnes au-delà de 50em), le lien `index.projects.cta`, puis `ContactCTA`.
- Les deux routes `index.astro` deviennent `<HomePage />` en quelques lignes.
- `ContactCTA.astro` : un `<aside>` séparé du contenu par un filet `--rule`, contenant `<p>{contactcta.title} <a href="{prefix}/contact/">{cta.contact}</a></p>` en `--step-3`, sans icône ni bouton.
- Supprimer les composants listés en tête de tâche.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src tests
git commit -m "Accueil : ce que je fais, puis les projets en vitrine"
```

---

### Task 6: La page d'un projet et le nuancier

**Files:**
- Create: `src/components/project/IdentitySpecimen.astro`, `src/components/project/specimens/SeenitTicket.astro`, `src/components/project/specimens/ChronoFlaps.astro`, `tests/project.test.mjs`
- Modify: `src/layouts/ProjectLayout.astro`, `src/components/project/ProjectHero.astro`, `ProjectSection.astro`, `FeatureGrid.astro`, `StackTable.astro`, `ProjectGallery.astro`, `src/i18n/ui.ts`
- Delete: `src/components/Pill.astro`

**Interfaces:**
- Consumes: `ProjectFrame` en variante `cover` (tâche 4), `ProjectIdentity` (tâche 3).
- Produces: `IdentitySpecimen.astro`, props `{ identity: ProjectIdentity; lang: Lang }`.

Clés i18n à ajouter :

| Clé | Français | Anglais |
|---|---|---|
| `work.section.identity` | Identité visuelle | Visual identity |
| `work.identity.palette` | Palette | Palette |
| `work.identity.fonts` | Polices | Typefaces |
| `work.identity.piece` | Pièce d'interface | Interface piece |
| `specimen.seenit.film` | Mulholland Drive | Mulholland Drive |
| `specimen.seenit.seen` | Vu le 14 novembre | Watched on 14 November |
| `specimen.seenit.rating` | Note : 4,5 sur 5 | Rating: 4.5 out of 5 |
| `specimen.chrono.value` | 04,96 | 04.96 |
| `specimen.chrono.tier` | Masterclass | Masterclass |

- [ ] **Step 1: Écrire les tests**

`tests/project.test.mjs` :

```js
const order = (html, titles) => titles.map((t) => html.indexOf(`>${t}</h2>`));
test('les sections suivent l’ordre de la spec', () => {
  const idx = order(page('/work/seenit/'), ['Le projet', 'Mon rôle', 'Identité visuelle', 'Fonctionnalités', 'Stack technique', 'En images']);
  assert.ok(idx.every((i) => i > 0), JSON.stringify(idx));
  assert.deepEqual([...idx].sort((a, b) => a - b), idx);
});
test('le nuancier de Seenit, en français et en anglais', () => {
  const fr = text(page('/work/seenit/'));
  for (const s of ['Bois', '#2C1C0F', 'Laiton', '#C5A059', 'Velours', 'Ivoire', 'Playfair Display', 'DM Sans', 'DM Mono', 'Mulholland Drive', 'Vu le 14 novembre']) assert.ok(fr.includes(s), s);
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
test('ni pilules, ni points médians, ni icônes de fonctionnalité', () => {
  for (const slug of ['seenit', 'covoit-etud']) {
    const html = page(`/work/${slug}/`);
    assert.ok(!html.includes('class="pill"'), slug);
    assert.ok(!text(chunk(html, '<main', '</main>')).includes('·'), slug);
  }
});
test('pas de couverture vide pour un projet sans capture', () => {
  assert.ok(!page('/work/covoit-etud/').includes('data-frame='));
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npm run build:fast && npm test`
Expected: les tests de `project` FAIL (pas de section « Identité visuelle », ordre différent, pilules présentes).

- [ ] **Step 3: Réécrire la page projet**

- `ProjectLayout.astro` : ordre retour, en-tête, liens, couverture (seulement si `img` existe), Le projet, Mon rôle, Identité visuelle (si `identity`), Fonctionnalités, Stack technique, En images (si galerie), Pour aller plus loin.
- `ProjectHero.astro` : lien de retour en texte souligné ; `h1` ; description en `--step-1` ; période, cadre et équipe sur des lignes séparées en `--ink-muted` (pas de phrase recomposée : mettre en minuscule « SAÉ de BUT » casserait le sigle) ; plus de `Pill` ni de tags ; GitHub en lien souligné, démo en bouton `--ink`. Les icônes GitHub et démo sont retirées : le texte suffit.
- `ProjectSection.astro` : `h2` en `--step-3`, 600, `--ink`, casse de phrase, sans filet ni capitales.
- `FeatureGrid.astro` : liste en deux colonnes au-delà de 50em, titre 600 et description `--ink-muted`, sans bordure, fond, ombre ni marqueur.
- `StackTable.astro` : `dl` sur deux colonnes, couche en 600 à gauche, technologies en texte séparé par des virgules à droite, filets `--rule` entre les lignes.
- `ProjectGallery.astro` : remplacer les jetons supprimés par les nouveaux ; flèches sur `--paper`, bordure `--ink-muted`, rayon `--radius` ; pastilles carrées de 0,5em.
- `IdentitySpecimen.astro` : trois blocs titrés en `h3` (`work.identity.*`). Palette : grille de pastilles de 3,6em de haut, nom en 600 puis code en `font-variant-numeric: tabular-nums`, pastille claire cernée d'un filet `--rule`. Polices : « Aa » en `--step-5` dans la police, puis nom et rôle. Pièce : `SeenitTicket` ou `ChronoFlaps` selon `identity.specimen`. Polices importées ici : `@fontsource/playfair-display/latin-600.css`, `@fontsource/dm-sans/latin-400.css`, `@fontsource/dm-mono/latin-400.css`, `@fontsource/oswald/latin-600.css`, `@fontsource/space-mono/latin-700.css` (`npm install @fontsource/dm-sans @fontsource/dm-mono @fontsource/space-mono`).
- `SeenitTicket.astro` : fond `#3A2815`, texte `#EFEBD9` en DM Sans, bord gauche pointillé `#1D1209`, titre du film en Playfair Display `#D9B872`, étoiles `#C5A059` en `aria-hidden`, note lisible par `specimen.seenit.rating` en `sr-only`.
- `ChronoFlaps.astro` : racine `role="img"` avec `aria-label="{specimen.chrono.value} {specimen.chrono.tier}"`, enfants en `aria-hidden` ; chiffres de `specimen.chrono.value` en Space Mono 700 blanc sur `#20242C`, rayon 3 px, trait horizontal `#101216` à mi-hauteur, séparateur décimal en `#F5C518`, mention `specimen.chrono.tier` en Oswald capitales `#F5C518` sur `#101216`.
- Supprimer `Pill.astro`.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src tests package.json package-lock.json
git commit -m "Pages projet : rôle en tête et nuancier de l'identité visuelle"
```

---

### Task 7: Le CV du portfolio

**Files:**
- Create: `tests/cv.test.mjs`
- Modify: `src/components/CvScreenPage.astro`, `src/styles/cv-screen.css`, `src/styles/cv-print.css`, `src/components/PrintToolbar.astro` (icônes retirées)

**Interfaces:**
- Produces: la table de correspondance des couleurs, réutilisée telle quelle par la tâche 9.

| Ancienne couleur | Nouvelle | Où |
|---|---|---|
| `#1c0056`, dégradés `#c561f6`/`#7611a6`/`#1c0056` | `#1C2230` | bandeau d'en-tête, colonne latérale, barre d'impression, bouton d'impression, bandeau de la lettre |
| `#c561f6` | `#C8C9C3` | titres et compétences de la colonne latérale |
| `rgba(197, 97, 246, 0.4)` (filet) | `rgba(200, 201, 195, 0.35)` | sous les titres latéraux |
| `rgba(197, 97, 246, 0.15)` et `0.18` (fonds) | `rgba(255, 255, 255, 0.08)` | compétences, niveaux de langue |
| `rgba(197, 97, 246, 0.45)` (bordure) | `rgba(255, 255, 255, 0.25)` | compétences |
| `rgba(197, 97, 246, 0.7)` | `rgba(200, 201, 195, 0.7)` | puces des loisirs |
| `#7611a6` | `#1C2230` | titres de la colonne principale, sous-titres, dates |
| fond des dates (violet transparent) | `#E6E6E2` | dates |
| `#6474a2` | `#555C6B` | lieux |
| `#090b11` | `#1C2230` | titres d'entrée, texte |
| `#e8e8e8` | `#E6E6E2` | fond autour de la feuille A4 |

Aucune police, taille, marge ni interligne ne change.

- [ ] **Step 1: Écrire les tests**

`tests/cv.test.mjs` :

```js
const VIOLETS = /7611a6|c561f6|1c0056|197,\s*97,\s*246|118,\s*17,\s*166/i;
test('plus de violet dans le CV, à l’écran comme à l’impression', () => {
  for (const f of distFiles()) assert.ok(!VIOLETS.test(f.content), f.path);
});
test('le CV à l’écran garde Rubik et Public Sans, installées avec le site', () => {
  for (const r of ['/cv/', '/en/cv/']) {
    assert.match(pageCss(r), /@font-face\s*{[^}]*font-family:\s*["']?Rubik/, r);
    assert.match(pageCss(r), /@font-face\s*{[^}]*font-family:\s*["']?Public Sans/, r);
  }
});
test('les deux boutons du CV existent toujours', () => {
  assert.ok(page('/cv/').includes('href="/assets/pdf/CV_Thibault_Rosalie_FR.pdf"'));
  assert.ok(page('/en/cv/').includes('href="/en/cv-print/"'));
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npm run build:fast && npm test`
Expected: `plus de violet` FAIL (en particulier `cv-print`).

- [ ] **Step 3: Recolorer le CV**

- `CvScreenPage.astro` : importer les mêmes fichiers que `CvPrintPage.astro` (`@fontsource/public-sans/400.css`, `700.css`, `@fontsource/rubik/300.css`, `500.css`, `700.css`). Boutons : « Télécharger le PDF » en bouton `--ink`, « Sauvegarder en PDF » en lien souligné ; icônes SVG retirées.
- `cv-screen.css` : réécrit sans les jetons supprimés ni les règles `:root.theme-dark`. Le document `.cv` est une feuille `--paper` sans rayon ni ombre posée sur le mur ; `font-family` explicites `'Rubik'` (titres) et `'Public Sans'` (texte) ; couleurs selon la table.
- `cv-print.css` : couleurs selon la table, rien d'autre.
- `PrintToolbar.astro` : icônes SVG retirées, libellés inchangés.

- [ ] **Step 4: Vérifier les tests et la tenue sur une page**

Run: `npm run check && npm run build && npm test`
Expected: `npm run build` génère les deux PDF et ne signale aucun CV de plus d'une page ; tous les tests PASS. Ouvrir `dist/assets/pdf/CV_Thibault_Rosalie_FR.pdf` : bandeau et colonne latérale bleu nuit, aucune trace de violet.

- [ ] **Step 5: Commit**

```bash
git add -A src tests
git commit -m "CV recoloré dans la palette de la vitrine, polices et mise en page inchangées"
```

---

### Task 8: À propos, contact, 404 et nettoyage

**Files:**
- Create: `src/components/pages/AboutPage.astro`, `tests/pages.test.mjs`, `tests/cleanup.test.mjs`
- Modify: `src/pages/about.astro`, `src/pages/en/about.astro`, `src/components/ContactPage.astro`, `src/pages/404.astro`, `src/components/Icon.astro`, `src/components/IconPaths.ts`, `src/i18n/ui.ts`, `docs/AMELIORATIONS.md`
- Delete: `src/components/WorkInProgress.astro`, `src/components/Hero.astro`

**Interfaces:**
- Consumes: `cta.cv`, `cta.contact` (tâche 5), `index.hero.portrait.alt`, `contact.availability.text`.

- [ ] **Step 1: Écrire les tests**

`tests/pages.test.mjs` :

```js
test('À propos montre le portrait, la disponibilité et deux liens, sans chantier', () => {
  const html = page('/about/');
  assert.match(html, /<img[^>]*alt="Photo de profil de Thibault ROSALIE"/);
  const t = text(html);
  assert.ok(t.includes("Diplômé d'un BUT Informatique de l'IUT de Bayonne"));
  assert.ok(!/construction|🚧/.test(t));
  assert.match(html, /href="\/cv\/"[^>]*>\s*Lire le CV/);
  assert.ok(page('/en/about/').includes('href="/en/contact/"'));
});
test('le formulaire de contact garde son fonctionnement', () => {
  const html = page('/contact/');
  for (const s of ['action="https://formspree.io/f/maqdrkgr"', 'name="_gotcha"', 'name="_next"', 'id="contact-sent"']) assert.ok(html.includes(s), s);
});
test('la 404 renvoie à l’accueil, sans flèche', () => {
  assert.match(page('/404'), /href="\/"[^>]*>\s*Retour à l(&#39;|')accueil\s*</);
  assert.ok(!text(page('/404')).includes('←'));
});
```

`tests/cleanup.test.mjs` (lit `src/` récursivement, fichiers `.astro`, `.css`, `.ts`) :

```js
const GONE = [/var\(--gray-/, /var\(--accent-/, /--gradient-/, /var\(--shadow-/, /--font-brand/, /--font-body/, /var\(--text-(xs|sm|base|md|lg|xl|\dxl)\)/, /--theme-transition/, /theme-dark/];
test('plus aucun jeton de l’ancien thème dans src/', () => {
  for (const file of srcFiles()) for (const re of GONE) assert.ok(!re.test(file.content), `${file.path} : ${re}`);
});
test('plus d’étiquette en capitales dans le site', () => {
  for (const file of srcFiles().filter((f) => !/cv-(print|screen)\.css|ProjectFrame|ChronoFlaps/.test(f.path))) {
    assert.ok(!/text-transform:\s*uppercase/.test(file.content), file.path);
  }
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npm run build:fast && npm test`
Expected: les tests d'À propos et de nettoyage FAIL.

- [ ] **Step 3: Réécrire les pages et nettoyer**

- `AboutPage.astro` : `h1` `about.wip.title` (renommée `about.title`), portrait via `<Image>` (`src/assets/portrait.jpg`, largeur 360, `widths={[360, 720]}`, rayon 2 px), paragraphe `contact.availability.text`, bouton `cta.cv` et lien `cta.contact`. Les deux routes l'incluent.
- `ContactPage.astro` : plus d'icônes ; titres en casse de phrase ; champs `--paper`, bordure 1 px `--ink-muted`, rayon `--radius`, focus du Global Constraints ; placeholders `--ink-muted` ; bouton d'envoi `--ink` sans avion en papier ; bandeau de confirmation sur `--paper` avec filet `--ink` à gauche.
- `404.astro` : `h1`, phrase, lien souligné vers l'accueil, aligné à gauche dans `.wrapper`, sans `Hero`. Clé `404.back` sans flèche : « Retour à l'accueil » / « Back to home ».
- Supprimer `WorkInProgress.astro`, `Hero.astro`, les clés `wip.*` ; retirer de `IconPaths.ts` toutes les icônes sauf celles encore utilisées (relever les usages avec `rg "icon=\"" src`) ; retirer la prop `gradient` d'`Icon.astro`.
- `docs/AMELIORATIONS.md` : sous l'entrée « À propos affiche 🚧 en construction », ajouter une ligne qui dit que la carte de chantier est remplacée par une page provisoire (portrait, disponibilité, liens) et que le texte reste à écrire ; l'entrée reste non cochée.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `npm run check && npm run build:fast && npm test`
Expected: tout PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src tests docs
git commit -m "À propos provisoire, contact et 404 dans la vitrine, ancien thème retiré"
```

---

### Task 9: Le CV et la lettre de l'outil candidatures

**Files (dépôt `C:\dev\candidatures`):**
- Modify: `src/template/cv.css`, `src/template/letter.css`

**Interfaces:**
- Consumes: la table de correspondance de la tâche 7, appliquée à l'identique. Dans `letter.css`, le dégradé de la ligne 37 devient `#1C2230` et la couleur `#1c0056` de la ligne 84 devient `#1C2230`.

- [ ] **Step 1: Constater l'état de départ**

Run (dans `C:\dev\candidatures`) : `git status --short` puis `grep -nE "7611a6|c561f6|1c0056|197, 97, 246" src/template/cv.css src/template/letter.css`
Expected: trois fichiers de données déjà modifiés par Thibault (à laisser tels quels) ; 14 lignes violettes dans les deux CSS.

- [ ] **Step 2: Recolorer**

Appliquer la table. Aucune police, taille, marge ni interligne ne change.

- [ ] **Step 3: Vérifier**

Run: `grep -nE "7611a6|c561f6|1c0056|197, 97, 246" src/template/cv.css src/template/letter.css` puis `npm test`
Expected: aucune ligne trouvée ; la suite Vitest passe. Puis `npm run dev`, ouvrir l'outil : l'indicateur « tient sur 1 page » reste vert pour la version « Publique » en FR et en EN, et l'aperçu de la lettre n'a plus de violet.

- [ ] **Step 4: Commit (dépôt candidatures uniquement, sans les fichiers de données)**

```bash
git add src/template/cv.css src/template/letter.css
git commit -m "CV et lettre dans la palette du portfolio"
```

---

### Task 10: Vérification finale

**Files:** aucun, sauf corrections révélées par la vérification (chacune dans son propre commit).

- [ ] **Step 1: Build complet et tests**

Run (dans `C:\dev\portfolio`) : `npm run check && npm run build && npm test`
Expected: aucune erreur, PDF d'une page en FR et en EN, tous les tests PASS.

- [ ] **Step 2: Revue visuelle (Review Focus 1 et 2)**

Run: `npm run preview`, puis à 1440 px et à 375 px, en FR et en EN : `/`, `/work/`, `/work/seenit/`, `/work/covoit-etud/`, `/cv/`, `/contact/`, `/about/`, `/404`.
Expected: aucune barre de défilement horizontale ; « Projet Chat Multi-Channels » passe à la ligne dans son cadre ; menu replié utilisable à 375 px avec FR/EN atteignables ; aucun fond flou, dégradé, pilule, ombre ni capitale espacée hors du cadre ChronoPotes et du CV.

- [ ] **Step 3: Clavier et réseau (Review Focus 3)**

Parcourir `/` et `/work/seenit/` à la touche Tab depuis le haut de page.
Expected: le lien d'évitement apparaît en premier ; chaque vignette, le bouton de démo, les flèches du carrousel et les champs du contact montrent le contour `--ink`. Dans l'onglet réseau, aucune requête vers `fonts.googleapis.com` ni `fonts.gstatic.com`.

- [ ] **Step 4: Bilan**

Lister à Thibault ce qui a été vérifié, les écarts corrigés et ce qui reste hors périmètre (texte de la page À propos, titres d'onglet, image Open Graph).
