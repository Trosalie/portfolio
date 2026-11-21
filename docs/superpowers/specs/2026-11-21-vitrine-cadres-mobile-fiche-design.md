# Cadres pour tous les projets, vignettes mobiles et fiche projet : conception

Date : 2026-11-21. Statut : validé par Thibault le 2026-11-21.

Suite de la direction visuelle « La vitrine »
(`docs/superpowers/specs/2026-11-20-direction-visuelle-design.md`). Couvre les points 1, 2 et 4
de la section P6 de `docs/AMELIORATIONS.md`.

## Intention

Le portfolio doit laisser à une personne qui recrute le souvenir du soin que Thibault porte au
produit et au design. L'idée qui porte le site, chaque projet montré dans sa propre identité, ne
s'applique aujourd'hui qu'à Seenit et ChronoPotes : les quatre autres projets ont le même cadre
encre. Sur téléphone, où beaucoup de recruteurs ouvrent le lien depuis LinkedIn, les vignettes
sont des captures d'écran de bureau réduites à 290 px de large et ne se lisent plus. Enfin, la
page d'un projet disperse ce qu'on y cherche d'abord (quand, dans quel cadre, avec qui, avec
quoi) et se termine sans mener nulle part.

## Objectifs

1. Chaque projet a un cadre dans l'identité de son produit, sur les vignettes, la couverture et
   le nouveau lien « Projet suivant ».
2. Sous 50em, chaque vignette montre un détail lisible du produit au lieu de la capture entière.
   Le titre de l'accueil laisse voir le premier projet plus tôt.
3. La page d'un projet ouvre sur une fiche (période, cadre, équipe, technologies) à côté du titre
   et se termine par un lien vers le projet suivant.

## Non-objectifs

- Un nuancier pour BluePoint, Projet Chat, SportPXL et Covoit'Etud. Le nuancier montre des choix
  de design faits par Thibault ; ces quatre produits reposent sur Bootstrap, sur l'apparence par
  défaut de Qt ou sur un terminal, et un nuancier y prétendrait un travail qui n'a pas eu lieu.
- Une fiche qui reste fixe pendant le défilement (écartée, voir « Approches »).
- Les autres points de P6 (visionneuse, liste à deux niveaux, transitions, pièce jouable,
  typographie, menu mobile, alignements).
- Recadrer la couverture des pages projet sur mobile : elle reste entière, la visionneuse (P6,
  point 3) traitera sa lisibilité.

## Anti-objectifs

Raté, même si tout fonctionne, si :

- un cadre invente une identité que le produit n'a pas (couleur ou police absente du produit) ;
- le site retombe dans le gabarit que la direction visuelle écarte : flèche sur « Projet
  suivant », étiquette en capitales espacées, carte avec ombre, pastilles ;
- la fiche devient un tableau de bord (icônes, badges, chiffres mis en avant) ;
- une police est embarquée sans licence qui le permette ;
- l'accessibilité, la parité FR/EN ou les performances reculent (voir `docs/AMELIORATIONS.md`,
  P0, P3, P5).

## Contraintes

- Astro 5 en sortie statique, JavaScript client minimal ; ces trois changements n'en ajoutent pas.
- Parité FR/EN contrôlée au build : `getWorkCollection` (`src/data/work.ts`) et `identityGaps`
  (`src/data/identity.ts`). Les codes couleur et styles de titre doivent être identiques entre
  les deux versions d'un projet ; tout nouveau libellé va dans `src/i18n/ui.ts`.
- Polices installées via `@fontsource`, sous-ensemble latin, une graisse par usage, chargées par
  les seuls composants qui les utilisent. Aucune requête vers Google Fonts.
- Les captures ne contiennent que des données fictives (règle déjà suivie pour SportPXL et
  Covoit'Etud) ; les recadrages sont découpés dans les captures existantes.
- Le titre dans le cadre d'une vignette reste décoratif (`aria-hidden`) : c'est l'étiquette qui
  nomme le lien. La capture d'une vignette garde `alt=""`.
- `release` déploie à chaque push : le travail se fait sur une branche dédiée.
- Vérification : `npm run check`, `npm run build:fast && npm test` (Node 22.18+).

## Approches

Pour la fiche projet (point 4), deux approches ont été considérées :

- **Fiche en tête** (retenue par Thibault) : la fiche se pose à droite du titre et de la
  description sur grand écran, sous eux sur mobile. Simple, lisible tout de suite, cohérente avec
  le cartel des vignettes.
- **Fiche collante** (écartée) : une colonne qui suit le défilement. La galerie déborde sur toute
  la largeur de la page (`ProjectGallery.astro`, piste en `100vw`) et le nuancier comme les
  fonctionnalités ont besoin de la largeur de la colonne : la fiche devrait s'arrêter avant eux et
  ne suivrait que « Le projet » et « Mon rôle ». Toute la page passerait en deux colonnes pour à
  peine plus que la fiche en tête.

Pour les points 1 et 2, une seule voie raisonnable a été proposée et acceptée : un cadre seul
(sans nuancier) pour les quatre projets, et un recadrage dédié au mobile découpé une fois dans les
captures existantes plutôt qu'un zoom en CSS (un zoom ne choisit pas le détail et oblige à servir
une image bien plus large que nécessaire).

## 1. Un cadre pour chaque projet

### Modèle de données

Aujourd'hui, `identity` porte à la fois le cadre et le nuancier, tous deux obligatoires
(`src/content.config.ts`, `identitySchema`). Exigences pour la nouvelle forme :

- un projet peut avoir un cadre sans nuancier ;
- le nuancier (palette, polices, pièce d'interface) reste complet ou absent, jamais partiel ;
- la page projet n'affiche « Identité visuelle » que si le nuancier existe ;
- `identityGaps` contrôle aussi la parité FR/EN d'un cadre seul ;
- les six projets ont un cadre ; le cadre encre reste le repli d'un projet futur qui n'en
  déclarerait pas.

La forme exacte (champ `frame` séparé, ou `identity` dont le nuancier devient facultatif) est
laissée au constructeur.

### Styles de titre

La table fermée `titleStyles` (`src/data/identity.ts`) gagne trois entrées :

| Style | Rendu | Police |
|---|---|---|
| `site` | 600, casse normale | Schibsted Grotesk (police du site), aucun chargement |
| `jost-caps` | 500, capitales, approche légère | Jost, `@fontsource/jost`, latin 500 |
| `dm-mono` | 500, casse normale | DM Mono, `@fontsource/dm-mono` (déjà installé), latin 500 |

`site` existe déjà comme classe de repli (`title--site`) ; il devient sélectionnable.

SportPXL utilise Futura LT, police commerciale dont le dépôt du projet embarque un fichier tiré
d'un site de téléchargement gratuit. Elle n'est pas reprise ; Jost, libre (OFL) et dessinée
d'après Futura, la remplace.

### Les cadres

Couleurs relevées dans le code du projet quand il est public, sinon mesurées dans les captures
(valeur dominante de la zone, hors anticrénelage).

| Projet | Fond | Liseré | Titre | Style | Source |
|---|---|---|---|---|---|
| ChronoPotes | `#101216` | aucun | `#F5C518` | `oswald-caps` | inchangé |
| Seenit | `#2C1C0F` | `#4D331E` | `#C5A059` | `playfair-italic` | inchangé |
| SportPXL | `#E8EAF6` | `#FA8624` | `#0A2D44` | `jost-caps` | fond : `styles.scss` du projet ; orange : boutons ; marine : logo |
| Covoit'Etud | `#ABC4FF` | aucun | `#31429A` | `site` | fond : `$header-color` de `scss/custom.scss` du projet ; indigo : logo, mesuré |
| BluePoint | `#1F1F1F` | aucun | `#338CD2` | `site` | fenêtre Qt et boîte de détection, mesurées |
| Projet Chat | `#17181C` | `#3C3F47` | `#81B07A` | `dm-mono` | fond du terminal, bord de fenêtre et invite `$`, mesurés |

Les polices des produits reposant sur Bootstrap (Covoit'Etud) et sur Qt (BluePoint) sont celles
du système : le style `site` est le plus honnête pour eux.

Contraste du titre sur le fond, calculé (WCAG) : ChronoPotes 11,5:1, Seenit 6,7:1, SportPXL
11,9:1, Covoit'Etud 5,1:1, BluePoint 4,6:1, Projet Chat 7,1:1. Le titre est décoratif mais
visible : un test exige au moins 4,5:1 pour chaque cadre. Pour Covoit'Etud, l'indigo des boutons
(`$primary`, `#4357BD`) ne donnait que 3,6:1 ; l'indigo du logo, plus sombre, le remplace.

Le liseré orange de SportPXL et le cadre lavande sur le mur gris sont les deux choix les moins
sûrs : à juger sur la page rendue. Si le liseré crie, le remplacer par le marine du logo. Le
cadre lavande a besoin d'un liseré dans tous les cas : il ne se distingue presque pas du mur
(`#E6E6E2`, 1,04:1). Le cadre pervenche de Covoit'Etud s'en détache par la teinte (1,39:1) et
s'en passe ; à confirmer à l'œil.

## 2. Vignettes mobiles

### Recadrages

Un fichier par projet, `src/assets/projets/<projet>/vignette-mobile.webp`, au format 16:10 (le
même que la vignette actuelle, la grille ne change pas), d'au moins 640 px de large pour rester
net sur un écran 2x (la capture occupe environ 290 px de large à 375 px). Découpés une fois dans
les captures existantes :

| Projet | Source | Détail montré |
|---|---|---|
| ChronoPotes | `chronopotes/accueil.webp` (1290×2796) | le haut d'un seul téléphone : « Garde le rythme. Sans le voir. » et l'affichage à palettes |
| Seenit | `seenit/couverture.webp` | le fronton « À l'affiche » et ses trois séances |
| BluePoint | `bluepoint/flux-detection.webp` | la boîte de détection « ID : 3 \| Class : trash \| 88% » et son objet |
| Projet Chat | `projet-chat/couverture.webp` | le terminal de lea : arrivée dans le channel et échanges |
| SportPXL | `sportpxl/couverture.webp` | une ligne de photographe : chiffre d'affaires, crédits, statut des factures |
| Covoit'Etud | `covoit-etud/couverture.webp` | une carte de trajet : adresses, horaires, prix |

Le cadrage exact (coordonnées) est laissé au constructeur, à juger sur l'écran rendu à 375 px.
Garder le script de découpe dans `scripts/` pour pouvoir refaire un recadrage, à la manière de
`scripts/generate-og-images.mjs`.

### Rendu

- Champ facultatif dans le contenu (par exemple `img_mobile: image().optional()`), identique en
  FR et en EN ; un projet sans recadrage garde la capture entière sur mobile.
- La vignette produit un `<picture>` : une `<source media="(max-width: 49.99em)">` pour le
  recadrage, l'`<img>` existante pour le reste. Les deux passent par `astro:assets` (`getImage`)
  avec dimensions et `srcset`, `loading="lazy"`, `alt=""`.
- Seule la vignette (`variant="tile"`) est concernée ; la couverture des pages projet ne change
  pas.

### Titre de l'accueil

Sous 50em, le `h1` de l'accueil (`src/components/pages/HomePage.astro`, aujourd'hui
`clamp(var(--step-4), 4vw, var(--step-5))`, soit 36 px à 375 px) descend à environ 28 px
(1,75 rem), de sorte que le titre du premier cadre et le haut de sa capture apparaissent dans le
premier écran d'un téléphone de 812 px de haut. Rien ne change à partir de 50em. Les titres des
autres pages ne sont pas concernés.

## 4. Page projet : fiche en tête et projet suivant

### La fiche

Elle remplace la liste grise période, cadre, équipe de `ProjectHero.astro`.

```
Retour aux projets
Seenit                                 ┌───────────────────────────────────────┐
Application web locale pour tenir      │ Période       Novembre 2026           │
le journal de ses films : une          │ Cadre         Projet personnel        │
bibliothèque en forme d'étagère…       │ Équipe        Seul                    │
                                       │ Technologies  React, TypeScript,      │
[Voir la démo]  Voir sur GitHub        │               Node.js, SQLite, API TMDb│
                                       └───────────────────────────────────────┘
┌──────────────────── couverture dans le cadre du projet ────────────────────┐
```

- Une liste de définitions (`<dl>`) sur fond `--paper`, comme le cartel des vignettes : libellés
  en 600, valeurs en `--ink-muted`, sans icône ni filet décoratif.
- Lignes : Période (`period`), Cadre (`context`), Équipe (`team`), Technologies (`tags` joints
  par des virgules, la même liste que le cartel). Une ligne dont la valeur manque n'apparaît pas
  (Projet Chat n'a pas d'équipe).
- Libellés dans `src/i18n/ui.ts`. Français : Période, Cadre, Équipe, Technologies. Anglais
  proposé : Date, Context, Team, Technologies.
- À partir de 50em : deux colonnes, le titre, la description et les liens à gauche, la fiche à
  droite, alignée en haut sur le titre. Le lien de retour reste au-dessus, sur toute la largeur.
- Sous 50em : la fiche vient après les liens, dans l'ordre du document.
- La section « Stack technique » détaillée, par couche, reste en bas de page.

### Projet suivant

- Après la dernière section du projet, avant le bloc de contact.
- Le projet suivant est le suivant dans l'ordre de `getWorkCollection(lang)` (du plus récent au
  plus ancien) ; après le dernier, on revient au premier.
- Un seul lien : un bandeau dans le cadre du projet suivant (son fond, son liseré, son titre dans
  son style), environ deux fois moins haut qu'une vignette, sans capture. Au-dessus du bandeau,
  hors du cadre, le libellé « Projet suivant » (« Next project ») dans la police du site.
- Le nom accessible du lien contient le libellé et le titre du projet (« Projet suivant :
  BluePoint WasteIdentifier »). Ici le titre dans le cadre est le contenu du lien et n'est donc
  pas `aria-hidden`.
- Pas de flèche. Au survol, le titre se souligne, comme partout sur le site.
- Les styles de cadre (fond, liseré, titre) sont partagés avec `ProjectFrame.astro` plutôt que
  recopiés.

## Ce qui est laissé au constructeur

- La forme exacte du champ de cadre et du champ de recadrage dans le schéma, dans le respect des
  exigences ci-dessus.
- Les coordonnées de chaque recadrage.
- Les espacements, la largeur de la fiche et la hauteur du bandeau « Projet suivant ».
- La remesure des couleurs « mesurées » si une valeur plus exacte se trouve dans le code du
  produit.

## Vérification

- `npm run check` et `npm run build:fast && npm test` passent. Tests à adapter :
  `tests/tiles.test.mjs` attend aujourd'hui `data-frame="ink"` pour BluePoint ;
  `tests/identity.test.mjs` doit couvrir un cadre sans nuancier. Tests à ajouter : les six
  projets ont un cadre d'identité ; le titre de chaque cadre atteint 4,5:1 sur son fond ; chaque vignette avec recadrage sort une `<source>` mobile ;
  chaque page projet a sa fiche et un lien « Projet suivant », le dernier projet renvoyant au
  premier, en FR et en EN.
- Revue visuelle à 1440 px et à 375 px, en FR et en EN : accueil, liste des projets, une page
  avec nuancier (Seenit), une sans (Projet Chat). Chaque recadrage est lisible à 375 px.
- Navigation au clavier : focus visible sur le lien « Projet suivant ».
- Aucune requête vers `fonts.googleapis.com`. Le fichier de Jost n'est téléchargé que sur les
  pages où un cadre SportPXL s'affiche (une police déclarée n'est chargée par le navigateur que
  si un texte l'utilise).
