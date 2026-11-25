# Affichage ChronoPotes jouable : conception

Date : 2026-11-25. Statut : validé par Thibault le 2026-11-25.

Couvre le point 7 de la section P6 de `docs/AMELIORATIONS.md`, et un détail de la page d'impression du
CV. Suite de la direction visuelle « La vitrine » (`2026-11-20-direction-visuelle-design.md`).

## Intention

Le nuancier montre les choix de design d'un produit au lieu de les affirmer. Pour ChronoPotes, la pièce
est un affichage à palettes figé, alors que le produit est un geste : arrêter un chrono à l'aveugle.
En cinq secondes, une personne qui recrute doit l'avoir fait, avec la précision et la retenue du vrai
jeu. C'est le moment qu'on raconte ensuite.

## Objectifs

1. On joue une manche sur la page ChronoPotes, en français et en anglais, sans rien installer.
2. Les règles, les mentions, les couleurs et le mouvement des palettes sont ceux du jeu.
3. La règle d'or est tenue : rien ne bouge à l'écran pendant que le chrono court.
4. On y joue à la souris, au doigt, au clavier et avec un lecteur d'écran.
5. Sans JavaScript, la pièce reste celle d'aujourd'hui.
6. La page d'impression du CV déclare son icône : plus d'erreur 404 dans la console.

## Non-objectifs

- Son, record, série, classement, partage, décompte, autres modes, horloge-cible.
- Rendre jouable la pièce de Seenit.
- Enregistrer ou envoyer quoi que ce soit.

## Anti-objectifs

Raté, même si tout fonctionne, si :

- quelque chose bouge entre le départ et l'arrêt : compteur, barre, clignotement, bouton qui change
  d'aspect ;
- le temps mesuré n'est pas celui du geste (arrêt pris au relâchement, retard d'affichage) ;
- un geste en déclenche deux : un double-clic qui arrête aussitôt, un relâchement qui relance ;
- la pièce devient une carte de jeu : compteur de parties, encouragements, confettis ;
- elle prend le focus, joue ou s'anime toute seule.

## Contraintes

- Astro 5 statique, aucune bibliothèque. Le script n'est chargé que sur les pages ChronoPotes.
- Parité FR/EN, libellés dans `src/i18n/ui.ts`. Pas de tiret long, de point médian, de flèche. Les
  capitales restent permises dans la pièce, dans l'identité du produit.
- Les règles et le roulement sont des fonctions pures, testées sans navigateur.
- Textes à 4,5:1 au moins, cibles de 2,75rem au moins.
- `release` déploie : travail sur la branche `chronopotes-jouable`.
- Vérification : `npm run check`, `npm run build:fast && npm test`. La machine manque de mémoire : pas
  de tests en arrière-plan, un navigateur à la fois.

## Approches

- **A. Une manche courte, sur place** (retenue par Thibault le 2026-11-25, cible fixe de 5,00 s).
- **B. A, avec l'horloge-cible** : plus spectaculaire, mais la pièce double de hauteur et les palettes
  passent au second plan.
- **C. Le vrai jeu dans un cadre intégré** : fidèle mais lourd, avec un site entier, ses cookies et
  ses connexions.

## La pièce

```
Au repos (et sans JavaScript)   Pendant                 Résultat
┌──────────────────────────┐    ┌──────────────────┐    ┌──────────────────────────┐
│ 0 4 , 9 6   MASTERCLASS  │    │ ? ? , ? ?        │    │ 0 5 , 1 2   À L'HEURE    │
└──────────────────────────┘    └──────────────────┘    │ Masterclass   +0,12 s    │
Cible : 5,00 s                  Cible : 5,00 s          └──────────────────────────┘
[ JOUER ]                       [ ARRÊTER ]             [ REJOUER ]   Jouer sur
                                                                      chronopotes.fr
```

- **Au repos :** l'exemple d'aujourd'hui (04,96, Masterclass), la cible et un bouton « Jouer ». Sans
  JavaScript, l'exemple seul : ni cible ni bouton.
- **Le bouton** reprend celui du jeu : jaune `#F5C518`, texte `#101216`, Oswald en capitales.
- **Pendant :** palettes « ?? , ?? » en gris lisible (`#9AA3B2`), bouton « Arrêter ». Le gris du jeu
  ne donne que 2,0:1.
- **Résultat :** les palettes roulent jusqu'au temps, puis la mention s'affiche, avec l'écart signé.
- **Le lien** « Jouer sur chronopotes.fr », en texte souligné, paraît après la première manche et
  reste. Il prend l'adresse `demoUrl` du projet.
- La place du résultat et du lien est réservée : la page ne saute pas.

## Une manche

- **Départ :** au clic sur « Jouer » ou « Rejouer » (souris, doigt, Espace, Entrée). Pas de décompte.
- **Arrêt :** à l'appui, sur le bouton ou sur les palettes, ou à l'enfoncement d'Espace ou d'Entrée
  quand le bouton a le focus.
- **Temps :** celui de l'événement du geste, pas celui du traitement. Arrondi à la milliseconde pour
  l'écart, au centième pour l'affichage.
- **Mention**, sur l'écart à 5 000 ms, comme `tierFor` dans le jeu :

| Écart | Français | Anglais | Couleur |
|---|---|---|---|
| moins de 150 ms | À l'heure, Masterclass | On time, Masterclass | `#6FF0A9` |
| jusqu'à 500 ms | Dans les temps | Good service | `#F5C518` |
| jusqu'à 1 000 ms | Trafic perturbé | Disrupted | `#FB923C` |
| plus de 1 000 ms | Supprimé | Cancelled | `#FF6B57` |

- **Gestes en double :** un arrêt dans les 400 ms qui suivent le départ est ignoré (double-clic), une
  touche maintenue ne compte qu'une fois, et le relâchement qui suit un arrêt ne relance rien. Un
  nouveau départ est ignoré dans les 400 ms qui suivent un arrêt.
- **Interruption :** page masquée, page quittée, ou 30 secondes sans arrêt. La pièce revient au repos,
  avec « Manche interrompue ».

## La règle d'or

Entre le départ et l'arrêt, aucun élément de la page ne change et aucune animation ne tourne. Le
passage aux « ?? » et à « Arrêter » se fait au départ, d'un coup.

## Les palettes

- Le mouvement du jeu : quatre moitiés, une feuille qui tombe et une qui se pose, un cran toutes les
  80 ms, trois crans pour le premier chiffre et un de plus pour chaque suivant.
- **Mouvement réduit :** le résultat et la mention s'affichent directement.
- Les palettes restent décoratives : le résultat se lit d'un bloc.

## Lecteur d'écran et clavier

- La pièce est un groupe nommé. Le bouton dit son action et la cible (« Jouer, cible 5 secondes »).
- Annonces : « Chrono lancé » au départ ; au résultat, le temps, l'écart, le sens (en avance ou en
  retard) et la mention. Rien entre les deux. L'interruption est annoncée.
- Le focus reste sur le bouton pendant toute la partie.

## Le CV

La page d'impression du CV déclare la même icône que le reste du site.

## Ce qui est laissé au constructeur

- Le découpage (composant, fonctions pures, script), les espacements, les classes.
- Les libellés exacts des annonces, dans le respect de ce qui précède.

## Vérification

- **Fonctions pures :** mentions aux bornes (149, 150, 500, 501, 1000, 1001 ms, en avance et en retard),
  format du temps et de l'écart dans les deux langues, plan de roulement identique à celui du jeu.
- **`dist/` :** libellés, rien d'autre que l'exemple sans JavaScript, script absent des autres pages,
  icône de la page d'impression.
- **Dans un navigateur :** manche à la souris, au doigt, à Espace et à Entrée ; temps mesuré à 30 ms près
  d'un geste connu ; arrêt à l'appui et non au relâchement ; gestes en double ; aucun changement de la
  page ni animation entre départ et arrêt ; interruption par l'onglet, par la page quittée et par le
  délai ; mouvement réduit ; annonces ; focus ; page sans saut ; 320 px et texte à 200 %.
- **Revue à l'œil** à 1440 et 375 px, FR et EN, dans les trois états et les quatre mentions.
- À essayer par Thibault sur son téléphone : le toucher et le zoom au double appui.

## Écarts à la livraison

- Un clic sans appui (lecteur d'écran, commande vocale) arrête aussi la manche : sans cela, ces
  personnes ne pourraient que la lancer.
- « Manche interrompue » s'affiche à la place de « Cible : 5,00 s », jusqu'au départ suivant.
- La garde de 400 ms vaut aussi après une interruption, pour qu'un appui trop tardif ne relance rien.
- Une touche maintenue, ou pressée avec Maj, Ctrl, Alt ou Cmd, ne lance ni n'arrête rien.
- En texte agrandi, les palettes rétrécissent pour rester dans la pièce.
- Les tests exigent 10 ms, et non 30, entre le temps affiché et celui des gestes.
