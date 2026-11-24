# Visionneuse des captures : conception

Date : 2026-11-24. Statut : validé par Thibault le 2026-11-24.

Couvre le point 3 de la section P6 de `docs/AMELIORATIONS.md`. Suite de la direction visuelle « La
vitrine » (`2026-11-20-direction-visuelle-design.md`) et des cadres de tous les projets
(`2026-11-21-vitrine-cadres-mobile-fiche-design.md`).

## Intention

Les produits portent la personnalité du portfolio, et on ne peut pas les regarder de près. La
couverture et la galerie n'ouvrent rien. Sur un téléphone, une capture de bureau de 1440 à 1920 px
s'affiche sur 327 px : une personne qui recrute voit qu'il y a une interface, pas le soin mis
dedans.

Le plein écran seul ne règle rien : sur un téléphone de 375 px, la capture passe de 327 à 375 px.
Il faut l'ouvrir à une taille lisible et permettre de la parcourir.

## Objectifs

1. Toute capture d'une page projet, couverture comprise, s'ouvre en grand.
2. Sur téléphone, une capture de bureau s'ouvre à une taille où son texte se lit, et se parcourt
   au doigt.
3. La visionneuse prolonge la vitrine : elle prend les couleurs du cadre du projet.
4. Elle s'utilise entièrement au clavier et avec un lecteur d'écran.
5. Sans JavaScript, chaque capture reste atteignable en grand.

## Non-objectifs

- Un pincement ou un déplacement programmés : le défilement et le zoom sont ceux du navigateur.
- Passer d'une capture à l'autre en balayant l'écran : le geste sert à parcourir la capture
  agrandie.
- Refaire les captures en plus haute définition. Celles de SportPXL, Covoit'Etud et Projet Chat
  font 1440 px de large et seront un peu douces sur un écran 2x ou 3x.
- Une visionneuse sur l'accueil et la liste : une vignette y mène à la page du projet.
- Une animation d'ouverture (les transitions sont le point 6).

## Anti-objectifs

Raté, même si tout fonctionne, si :

- une capture de bureau s'ouvre sur téléphone aussi petite que dans la galerie ;
- la visionneuse ressemble à un composant tout fait : voile noir, ombres, icônes flottantes ;
- on perd sa place ou le focus en fermant ;
- la page charge des images en grand que personne n'a ouvertes ;
- la galerie actuelle perd un comportement (clic sur une voisine, flèches, pastilles, piste au
  clavier, usage sans script).

## Contraintes

- Astro 5 statique, `<dialog>` natif, aucune bibliothèque. Le script n'est chargé que sur les
  pages projet et vise une centaine de lignes.
- Parité FR/EN, libellés dans `src/i18n/ui.ts`. Aucun tiret long, aucune majuscule espacée, pas de
  point médian, pas de flèche dans un libellé (les boutons fléchés de la galerie restent).
- Les couleurs viennent du cadre (`identity.frame`), par le même code que `ProjectFrame.astro`.
- Textes et commandes à 4,5:1 au moins sur le fond, cibles tactiles de 2,75rem au moins.
- `release` déploie : travail sur la branche `visionneuse`.
- Vérification : `npm run check`, `npm run build:fast && npm test`.

## Approches

- **A. Deux tailles et défilement natif** (retenue par Thibault le 2026-11-24, avec le fond aux
  couleurs du projet). Chaque capture s'affiche entière ou agrandie. Peu de script, gestes du
  système, lisible sur téléphone. Le pincement du navigateur zoome aussi les commandes.
- **B. Pincement et déplacement sur mesure** : plus fluide, mais deux à trois fois plus de code ou
  une bibliothèque, fragile d'un téléphone à l'autre, et l'ouverture reste trop petite.
- **C. Lien vers l'image** : aucun script, mais on quitte la page, sans légende ni suite. C'est le
  comportement retenu quand le script ne tourne pas.

## La visionneuse

```
Grand écran                               Téléphone
┌──────────────────────────────────────┐  ┌──────────────────┐
│ 2 sur 6                       Fermer │  │ 2 sur 6   Fermer │
│                                      │  │┌─────────────────│
│    ┌────────────────────────────┐    │  ││ la capture      │
│ ←  │     la capture entière     │  → │  ││ remplit la      │
│    └────────────────────────────┘    │  ││ hauteur, on la  │
│                                      │  ││ fait glisser    │
│ Les films vus se rangent par mois…   │  │└─────────────────│
│                           Agrandir   │  │ ←  Voir entière →│
└──────────────────────────────────────┘  └──────────────────┘
```

Un `<dialog>` par page projet, ouvert par `showModal()`, qui occupe tout l'écran. En haut la
position et « Fermer », au centre la capture, en bas la légende et le bouton de taille. Les
flèches encadrent la capture sur grand écran et passent en bas sur petit écran.

**Couleurs.** Le fond est celui du cadre ; les textes, les commandes et les anneaux de focus
prennent la couleur de son titre. Ces paires atteignent déjà 4,5:1 (BluePoint est la plus juste, à
4,6:1) : les textes restent donc pleins, sans transparence, et un bouton indisponible se distingue
par autre chose qu'une opacité réduite. Un projet sans identité prend l'encre et le blanc. Le texte
est dans la police du site. Le bord d'une capture claire sur le fond lavande ou pervenche est à
juger à l'œil ; si elle s'y perd, lui donner un filet de la couleur du titre.

**La suite.** La couverture, puis les captures de la galerie. Une capture présente aux deux endroits
n'y figure qu'une fois (couverture de BluePoint). Totaux attendus : ChronoPotes 6, Seenit 6,
BluePoint 5, SportPXL 4, Covoit'Etud 4, Projet Chat 1. La suite ne boucle pas, comme la galerie.
Avec une seule capture, ni flèches ni position. La couverture n'a pas de légende, sauf si elle est
aussi une capture de la galerie.

**Chargement.** Les captures sont dans le HTML du `<dialog>`, avec leur texte alternatif, et une
seule est affichée à la fois. Aucune n'est téléchargée avant d'être affichée.

## Les deux tailles

Un « petit écran » fait moins de 50em de large ou moins de 30em de haut (téléphone tenu droit ou
couché).

La **taille réelle** d'une capture est celle de l'écran d'origine : sa largeur en pixels, divisée
par 3 pour une capture plus haute que large (téléphone en 3x : 1290 px donnent 430).

| | Entière | Agrandie |
|---|---|---|
| Grand écran | tient dans la zone, sans dépasser la taille réelle | taille réelle |
| Petit écran | tient dans la zone, sans dépasser la taille réelle | remplit la zone dans un sens et défile dans l'autre, sans dépasser la taille réelle |

- **À l'ouverture :** sur petit écran, agrandie pour une capture de bureau, ainsi que pour une
  capture de téléphone dont l'entière ferait moins de la moitié de la taille réelle (téléphone
  couché) ; entière dans tous les autres cas. Chaque changement de capture repart de cette règle, défilement au début.
- **Repère :** sur petit écran, une capture de bureau agrandie fait au moins 800 px de large, quitte
  à défiler dans les deux sens (téléphone couché ou très petit).
- **Basculer :** un appui sur la capture ou le bouton, « Agrandir » ou « Voir entière ». En
  agrandissant d'un appui, l'endroit touché reste à l'écran, au plus près du centre.
- Quand les deux tailles diffèrent de moins de 10 %, il n'y a ni bouton ni bascule.
- Tourner le téléphone ou redimensionner garde la capture en cours et recalcule ses tailles. Tant
  que la personne n'a pas choisi de taille, la règle d'ouverture s'applique de nouveau.
- La capture garde au moins 150 px de haut, texte agrandi compris : au-delà, c'est la boîte qui
  défile.

## Ouvrir

- La couverture et chaque capture de la galerie sont des liens vers leur image en grand
  (`href`). Le script intercepte le clic simple ; un clic avec Ctrl, Maj ou le bouton du milieu
  garde le comportement d'un lien.
- Dans la galerie, un clic sur une voisine la centre toujours ; un clic sur la capture centrale
  l'ouvre. Arriver au clavier sur le lien d'une voisine la centre.
- **« Agrandir » est visible**, en texte souligné : sous la couverture, dans le même lien que la
  capture, et dans la barre de commandes de la galerie, où il ouvre la capture centrale. Le curseur
  indique le zoom.
- Le focus va sur « Fermer ».
- Un double-clic sur la page ne fait qu'ouvrir : les clics des 400 premières millisecondes sont
  ignorés. Dans la galerie, un clic répété sur une voisine qui se centre ne l'ouvre pas.

## Se déplacer et fermer

- Boutons précédent et suivant. Les touches gauche et droite font de même tant que la capture est
  entière ; quand elle est agrandie, elles la font défiler.
- La zone de la capture prend le focus, pour défiler au clavier.
- Aux extrémités, le bouton est annoncé indisponible mais garde le focus.
- Un changement de capture est annoncé (« Capture 2 sur 6 », libellé existant).
- **Fermer :** Échap, « Fermer », ou un clic sur le fond hors de la capture et des commandes. Sur
  Android, le geste retour ferme la boîte ; sur iPhone il quitte la page, comme pour toute boîte
  native. Rien n'est ajouté à l'historique.
- **Retour :** ouverte depuis la couverture ou le bouton « Agrandir », elle rend le focus à ce
  point de départ. Ouverte depuis une capture de la galerie, elle place la galerie sur la dernière
  capture vue et y pose le focus ; si la dernière vue n'est pas dans la galerie, le focus revient à
  la capture de départ. La page ne défile pas verticalement, sauf si une
  rotation a sorti ce point de retour de l'écran.
- La page derrière ne défile pas pendant que la visionneuse est ouverte.

## Libellés

| Usage | Français | Anglais |
|---|---|---|
| Ouvrir, passer à l'agrandie | Agrandir | Enlarge |
| Revenir à l'entière | Voir entière | Fit to screen |
| Fermer | Fermer | Close |
| Position visible | {n} sur {total} | {n} of {total} |

Le nom de la boîte, les flèches et l'annonce reprennent les libellés existants de la galerie.

## Ce qui est laissé au constructeur

- Le découpage en composants et la façon de relier visionneuse et galerie.
- Espacements, taille des textes, traitement du bouton indisponible, qualité d'encodage.
- La place exacte des commandes, dans le respect du schéma.

## Vérification

- **Tests sur `dist/`**, en FR et EN : une visionneuse par page projet et nulle part ailleurs ; le
  nombre de captures attendu ; chaque lien mène à un fichier qui existe ; images paresseuses avec
  texte alternatif ; couleurs du cadre ; libellés. Aucun script de visionneuse hors des pages
  projet.
- **Tests dans un navigateur** (Puppeteer, déjà installé), car le reste ne se lit pas dans le
  HTML : ouverture par clic et au clavier, taille à l'ouverture à 375 et 1440 px, bascule, touches,
  fermetures, retour du focus et de la galerie, clic sur une voisine, aucune image en grand
  téléchargée avant l'ouverture, usage sans JavaScript.
- Ces tests tournent aussi avant chaque déploiement : l'étape « Tests » de
  `.github/workflows/deploy.yml` reçoit le chemin de Chrome, comme l'étape de build. Un échec y
  bloque la mise en ligne.
- **Revue à l'œil** à 375 × 812, 812 × 375, 768 × 1024, 1280 × 720 et 1440 × 900, sur les six
  projets : lisibilité, bord des captures claires, légendes longues.
