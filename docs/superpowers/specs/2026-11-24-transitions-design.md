# Transitions entre une vignette et sa page : conception

Date : 2026-11-24. Statut : validé par Thibault le 2026-11-24.

Couvre le point 6 de la section P6 de `docs/AMELIORATIONS.md`, et un détail d'impression. Suite de
la direction visuelle « La vitrine » (`2026-11-20-direction-visuelle-design.md`).

## Intention

Chaque produit est montré dans son cadre, mais ouvrir un projet coupe ce fil : la page grise
s'affiche, et le produit ne réapparaît qu'à la couverture. Le cadre doit glisser d'un endroit à
l'autre, pour qu'on voie qu'on s'approche du même objet. C'est un soin discret, au service du
souvenir des produits.

## Objectifs

1. Le cadre du projet glisse entre la vignette et la couverture, à l'aller et au retour, et du
   bandeau « Projet suivant » vers la couverture.
2. Le reste de la page se fond.
3. Sans prise en charge, ou si la personne a demandé moins de mouvement, la navigation est celle
   d'aujourd'hui.
4. Un clic sur un projet ne passe plus par une redirection.
5. À l'impression, le lien « Aller au contenu » n'apparaît plus.

## Non-objectifs

- Un routeur côté client, un préchargement des pages, une barre de progression.
- Animer les titres, les cartels, la fiche ou la galerie.
- Une animation à l'ouverture de la visionneuse.

## Anti-objectifs

Raté, même si tout fonctionne, si :

- la navigation paraît plus lente : la transition ne retarde jamais l'affichage de la page ;
- un autre cadre que celui du projet bouge, reste affiché ou traverse l'écran ;
- le cadre glisse vers un endroit qu'on ne voit pas ;
- on voit une bande transparente ou un éclat pendant le glissement ;
- le mouvement devient un effet : rebond, échelle, éléments qui arrivent en cascade.

## Contraintes

- Astro 5 statique, transitions entre documents du navigateur (`@view-transition`), aucune
  bibliothèque. Un script d'une trentaine de lignes, placé dans l'en-tête de chaque page : il doit
  être prêt avant le premier affichage.
- Parité FR/EN : le même comportement dans les deux langues.
- Le script n'est nécessaire à rien d'autre : une erreur ou une API absente laisse la navigation
  intacte, sans message d'erreur dans la console.
- Branche `transitions`. `release` déploie.
- Vérification : `npm run check`, `npm run build:fast && npm test`.

## Approches

- **A. CSS seul**, le cadre nommé au survol : aller et « Projet suivant » animés, retour en fondu.
  Dépend de l'état de survol sur écran tactile, invérifiable ici sur iPhone.
- **B. CSS et un petit script** (retenue par Thibault le 2026-11-24). Seul le cadre concerné est
  nommé, au départ et à l'arrivée. Tous les sens sont animés, rien ne dépend du survol.
- **C. Un simple fondu** : rien ne relie la vignette à sa page.

Essayées dans le navigateur, au ralenti, sur le site construit. Nommer tous les cadres en CSS,
comme le prévoyait l'audit, fait traverser l'écran à des cadres voisins : le bandeau « Projet
suivant » porterait le même nom qu'une vignette.

## Quel cadre glisse

À chaque changement de page, au plus un cadre. C'est celui du **projet de destination** si la page
quittée en montre un cadre à l'écran, sinon celui du **projet quitté**.

| De | Vers | Cadre au départ | Cadre à l'arrivée |
|---|---|---|---|
| liste ou accueil | projet X | vignette de X | couverture de X |
| projet X | projet Y (« Projet suivant ») | bandeau de Y | couverture de Y |
| projet X | liste ou accueil | couverture de X | vignette de X |
| projet Y | projet X (retour du navigateur) | couverture de Y | bandeau de Y |
| projet X en français | projet X en anglais | couverture de X | couverture de X |
| tout autre cas | | aucun | aucun |

- Un cadre ne compte que s'il est au moins en partie dans l'écran, au départ comme à l'arrivée. Sur
  un téléphone de 375 × 667, la couverture de ChronoPotes, de BluePoint ou de SportPXL arrive hors
  de l'écran : c'est alors un simple fondu.
- « Retour aux projets » ouvre la liste en haut : le cadre glisse si la vignette y est visible,
  sinon fondu. Le bouton retour du navigateur retrouve la position, donc la vignette.
- La page d'arrivée n'anime un cadre que si la page de départ a désigné ce même projet.
- Visionneuse ouverte, aucun cadre ne glisse : il passerait par-dessus elle.
- Quand un cadre est attendu, la page n'est montrée qu'une fois lue jusqu'à lui (la couverture, ou
  la page entière ailleurs). Sans cela, au retour sur une page que le navigateur n'a pas gardée en
  mémoire, elle s'affiche en haut puis saute. Les pages font moins de 11 Ko compressées.
- Le navigateur peut abandonner une transition : la page s'ouvre sans elle et sans erreur.
- Un clic pendant les 300 ms est perdu : le navigateur ne donne pas le pointeur à la page pendant
  une transition, et rien en CSS n'y change.

## Le mouvement

- 300 ms pour tout, avec la courbe par défaut du navigateur pour le glissement.
- Le cadre qui glisse garde sa couleur de fond et rogne ce qui dépasse : les deux captures n'ont pas
  les mêmes proportions.
- Le menu se fond avec le reste de la page.
- `prefers-reduced-motion: reduce` : aucune transition, pas même le fondu.
- Les noms posés par le script sont retirés dès la fin, et au retour depuis le cache du navigateur.

## Les liens de projet

Les liens internes vers un projet s'écrivent avec la barre finale (`/work/seenit/`), comme les
autres liens du site : en ligne, l'adresse sans barre est redirigée (301), un aller-retour de plus
à chaque clic. Les adresses sans barre reçues d'ailleurs continuent de fonctionner.

## L'impression

Le lien d'évitement, fixe, s'imprime au bas de chaque page. Il est masqué à l'impression, sur
toutes les pages qui le portent.

## Navigateurs

Transitions entre documents : Chrome et Edge 126, Safari 18.2. Le script demande en plus les
événements `pageswap` et `pagereveal` (Safari 26.2 d'après la recherche du 2026-11-24). Firefox :
partiel au mieux, sur des données de mars 2026. Entre les deux, un fondu ; sans rien, la navigation
d'aujourd'hui. Seul Chrome est vérifiable ici.

## Ce qui est laissé au constructeur

- Le moyen de passer le projet désigné d'une page à l'autre, et le nom de la transition.
- L'écriture du script et sa place exacte dans l'en-tête.

## Vérification

- **Tests sur `dist/`** : liens de projet avec la barre finale, dans les deux langues ; la règle
  CSS est sous `prefers-reduced-motion: no-preference` ; le script est dans l'en-tête.
- **Tests dans un navigateur**, sur l'état pendant la transition : pour chaque ligne du tableau,
  quel cadre est nommé au départ et à l'arrivée, et qu'il est le seul ; couverture ou vignette hors
  de l'écran ; mouvement réduit ; API absentes ; plus aucun nom après la transition, retour par le
  cache compris ; aucune erreur dans la console ; navigation rapide (deux clics de suite, retour
  pendant la transition).
- **Images au ralenti** pour juger à l'œil à 1440 et 375 px, dans les cinq sens du tableau.
- Impression : le lien d'évitement masqué.
- À essayer par Thibault sur un vrai téléphone.
