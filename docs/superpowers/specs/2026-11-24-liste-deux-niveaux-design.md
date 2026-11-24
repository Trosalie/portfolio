# Liste des projets à deux niveaux : conception

Date : 2026-11-24. Statut : validé par Thibault le 2026-11-24.

Couvre le point 5 de la section P6 de `docs/AMELIORATIONS.md`. Suite de la direction visuelle « La
vitrine » (`2026-11-20-direction-visuelle-design.md`).

## Intention

Les produits que Thibault a conçus doivent rester en mémoire, Seenit en premier. Aujourd'hui la
liste ne hiérarchise que par la date : ChronoPotes est en grand parce qu'il est le plus récent,
Seenit a la taille d'un TP en C, et Covoit'Etud finit seul avec un trou à droite. L'accueil a le
même défaut : Projet Chat y est à égalité avec Seenit.

## Objectifs

1. La liste montre deux niveaux : les trois projets phares en grand, les trois projets du BUT en
   une rangée plus compacte.
2. Seenit, ChronoPotes et BluePoint ont la même importance, sur la liste et sur l'accueil.
3. Aucune vignette orpheline, aucun cadre étiré avec une bande vide sous sa capture.

## Non-objectifs

- Changer les cartels, les cadres, les captures ou l'ordre de « Projet suivant ».
- Un filtre, un tri, des onglets ou une mise en avant tournante.
- Les autres points de P6 (transitions, typographie, alignements).

## Anti-objectifs

Raté, même si tout fonctionne, si :

- les projets du BUT ont l'air cachés ou reniés : ils gardent leur cadre, leur cartel et un lien
  entier ;
- la mise en page alterne gauche et droite, numérote les projets ou ajoute une étiquette
  « Projet phare » ;
- une largeur d'écran laisse une vignette seule sur sa rangée avec un trou à côté.

## Contraintes

- Astro 5 statique, aucun JavaScript client ajouté.
- Parité FR/EN : le niveau est contrôlé au build, les libellés sont dans `src/i18n/ui.ts`.
- Titre de vignette `aria-hidden`, capture `alt=""`, un seul lien par vignette.
- Pas de tiret long, de capitales espacées, de point médian, de flèche, d'ombre, de pastille.
- `release` déploie : travail sur la branche `liste-deux-niveaux`.
- Vérification : `npm run check`, `npm run build:fast && npm test`.

## Approches

- **A. Trois phares en pleine largeur** (retenue par Thibault le 2026-11-24, avec l'accueil). Chacun
  a un cadre de 648 px à 1440, cartel à côté. Page plus courte qu'aujourd'hui (3099 px, environ
  2700 ensuite).
- **B. ChronoPotes en pleine largeur, Seenit et BluePoint côte à côte** : plus compact (2342 px) et
  plus proche d'aujourd'hui, mais Seenit reste en second.

Maquettes jugées sur les vraies pages, dans le navigateur, avant le choix.

## Le niveau d'un projet

Un champ obligatoire dans le contenu, avec deux valeurs : phare ou BUT. Un projet sans niveau fait
échouer le build, comme un champ manquant ; un niveau différent en français et en anglais aussi.

| Phares | BUT |
|---|---|
| ChronoPotes, Seenit, BluePoint | Projet Chat, SportPXL, Covoit'Etud |

L'ordre à l'intérieur d'un niveau reste celui de `getWorkCollection` (du plus récent au plus
ancien).

## La liste

```
Projets
┌─────────────────────────┐
│ CHRONOPOTES             │ ┌──────────────────┐
│ [capture]               │ │ cartel complet   │
└─────────────────────────┘ └──────────────────┘
   … Seenit, puis BluePoint, de la même façon

Projets de BUT
┌────────────┐ ┌────────────┐ ┌────────────┐
│ [capture]  │ │ [capture]  │ │ [capture]  │
└────────────┘ └────────────┘ └────────────┘
 cartel court   cartel court   cartel court
```

- **Phares :** la vignette en pleine largeur d'aujourd'hui (cadre 3/5, cartel 2/5 posé au pied du
  cadre, description comprise), trois fois, sans titre de groupe.
- **À partir de 64em** le cartel est à côté. En dessous, il passe sous le cadre, qui prend toute la
  largeur : à 820 px, le cartel de BluePoint serait sinon plus haut que son cadre.
- **Le cadre d'un phare ne s'étire jamais** pour atteindre la hauteur du cartel.
- **BUT :** un titre de niveau 2, « Projets de BUT » (« University projects »), dans le style des
  titres de section du site, puis trois colonnes égales à partir de 50em. Cartel sans description.
- **Dans la rangée**, les trois cadres ont la même hauteur, les captures s'alignent sur le bas des
  cadres quand un titre passe sur deux ou trois lignes, et les cartels s'alignent en haut.
- **Sous 50em :** une colonne, dans le même ordre, avec le titre de groupe.
- Les deux groupes sont deux listes. La distance entre eux est plus grande que celle entre deux
  vignettes.

## L'accueil

- Les projets phares seulement, sans description, puis « Voir tous les projets » comme
  aujourd'hui.
- À partir de 50em, deux colonnes. Quand le nombre de phares est impair, le dernier occupe la
  rangée : son cadre garde la largeur d'une colonne et son cartel se pose dans l'autre, au pied du
  cadre.
- Captures alignées sur le bas des cadres, comme dans la rangée du BUT.
- Sous 50em, rien ne change à part le nombre de vignettes.

## Ce qui est laissé au constructeur

- Les noms du champ et de ses valeurs, le découpage des styles.
- Les espacements.
- Les tailles annoncées pour les images (`sizes`) : elles suivent les largeurs réelles.

## Vérification

- **Tests sur `dist/`**, FR et EN : trois phares puis trois projets du BUT dans l'ordre attendu ;
  titre de groupe ; description chez les phares seulement ; trois vignettes sur l'accueil, sans
  Projet Chat ; ordre de « Projet suivant » inchangé. Le contrôle de parité du niveau.
- **Tests dans un navigateur**, à 1440, 1100, 1024, 900, 820 et 375 px : les trois phares ont la
  même largeur ; aucun cadre de phare plus haut que son contenu ; même hauteur pour les cadres de la
  rangée du BUT et captures alignées ; sur l'accueil, les trois cadres ont la même largeur ; aucun
  cartel de phare plus haut que son cadre quand il est à côté ; pas de défilement horizontal.
- **Images :** un phare et une vignette du BUT téléchargent une largeur adaptée à leur place.
- **Revue à l'œil** à 1440, 1024, 820 et 375 px, FR et EN : liste et accueil.
