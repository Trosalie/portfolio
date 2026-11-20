# Direction visuelle « La vitrine » : conception

Date : 2026-11-20. Statut : à valider par Thibault.

## Intention

Le portfolio porte encore l'habillage du thème « Portfolio » officiel d'Astro : polices Rubik et
Public Sans, violet `#7611a6`, fonds flous, boutons en pilule dégradée, icônes du modèle. Ajouté
à des textes génériques, cela le fait passer pour un site généré ou recopié d'un modèle.

Thibault cherche un premier poste de développeur full stack. Il veut qu'en refermant la page, une
personne qui recrute retienne **son soin du produit et du design**, comme on le voit dans Seenit
(une salle de cinéma ancienne, bois, laiton, talons de billet) et ChronoPotes (tableau de gare,
noir et jaune). Aujourd'hui ses projets ont plus d'identité que son portfolio.

Public : recruteurs et développeurs qui recrutent, en France, en français ou en anglais.

## Objectifs

- Un cadre visuel propre au portfolio, sobre et assumé, qui ne rappelle aucun modèle.
- Les projets portent la personnalité : chacun apparaît dans les couleurs et la typographie que
  Thibault lui a données.
- Sur la page d'un projet qui a une identité, un nuancier montre ses choix de design : palette
  nommée, polices, une pièce d'interface typique.
- Un seul thème, clair.

## Non-objectifs

- Écrire la page « À propos » (chantier séparé).
- Réécrire le texte du CV ou celui des projets.
- Les autres points de l'audit du 2026-11-20 qui ne touchent pas au visuel : fautes des titres
  d'onglet (`ThibaultROSALIE- Portfolio`), image Open Graph mal recadrée, 404 par langue, clé SSH
  de déploiement.

## Anti-objectifs

Le chantier est raté, même si tout fonctionne, si :

- le site retombe dans un autre gabarit reconnaissable : fond crème avec titre à empattements et
  accent terre cuite, fond noir avec accent vert acide, kit de cartes arrondies avec ombre grise,
  étiquettes en capitales espacées au-dessus des titres, métadonnées séparées par des points
  médians, flèches ajoutées aux boutons ;
- le cadre entre en concurrence avec les projets au lieu de les mettre en valeur ;
- le CV PDF passe sur deux pages ;
- l'accessibilité, la parité FR/EN ou les performances reculent par rapport à l'état actuel
  (voir `docs/AMELIORATIONS.md`, sections P0, P3 et P5).

## Contraintes

- Astro 5 en sortie statique, sans framework d'interface. Le JavaScript client reste minimal.
- Parité FR/EN : chaque texte existe dans `src/i18n/ui.ts` ou dans les deux collections
  `work`/`work-en`. Les pages dupliquées par langue doivent devenir un composant unique, comme
  l'ont déjà été le CV et le contact.
- Le CV doit tenir sur une page A4 en français et en anglais. Il est rempli à 99 %. Le build
  échoue sinon (`scripts/generate-cv-pdf.mjs`). Sa mise en page existe en deux exemplaires : ici
  (`CvDocument.astro`, `cv-print.css`, `cv-screen.css`) et dans l'outil local
  `C:\dev\candidatures` (`src/template/cv.css`).
- Les polices sont installées avec le site via `@fontsource`. Aucune requête vers Google Fonts.
- Le formulaire de contact (Formspree, piège à robots, retour sur `/contact/?envoye=1`) ne change
  pas de fonctionnement.
- Un push sur `release` déploie le site : le travail se fait sur une branche dédiée. L'outil
  `candidatures` est un dépôt privé distinct, commité à part et jamais poussé par Claude.

## Approches considérées

Trois directions ont été maquettées sur l'accueil, avec les vrais projets.

- **A. La vitrine.** Cadre sobre (mur gris clair, encre bleu nuit, une police). Chaque projet est
  présenté dans son identité, avec une étiquette de musée. Met le travail en avant et vieillit
  bien. Limite : les projets sans visuel paraissent plus faibles.
- **B. La maison basque.** Univers propre au portfolio : murs blancs, colombages rouges, volets
  verts, linteau gravé. La plus mémorable. Limites : risque de folklore, rouge et vert en
  concurrence avec les palettes des projets, lettrage basque difficile à bien rendre, ancrage
  régional.
- **C. Le nuancier.** Chaque projet est montré par ses choix de design (palette, polices, pièce
  d'interface). La plus originale. Limites : parle plus aux designers qu'aux développeurs, montre
  peu les applications, ne fonctionne que pour les projets qui ont une identité.

**Retenu par Thibault : A, avec le nuancier de C sur les pages projet.** Le cadre sobre laisse les
produits s'exprimer, et la page d'un projet est l'endroit naturel pour expliquer ses choix de
design.

## Décisions

Prises par Thibault :

- direction A, la vitrine ;
- nuancier sur les pages projet, pour les projets qui ont une identité ;
- un seul thème clair : le mode sombre et son bouton disparaissent.

Proposées pendant la discussion et non contestées :

- les deux blocs « Compétences » de l'accueil disparaissent : l'étiquette de chaque projet donne
  déjà sa stack ;
- le portrait quitte l'accueil pour la page « À propos » ;
- le CV change de couleurs (du violet à la palette du site) sans changer de polices, dans les deux
  dépôts, pour continuer à tenir sur une page.

## Le système visuel

### Couleurs

| Jeton | Valeur | Rôle |
|---|---|---|
| `--wall` | `#E6E6E2` | fond de toutes les pages |
| `--ink` | `#1C2230` | texte, titres, bouton principal, cadre des projets sans identité |
| `--ink-muted` | `#555C6B` | texte secondaire, bordures des champs de formulaire |
| `--rule` | `#C8C9C3` | filets de séparation (purement décoratifs) |
| `--paper` | `#FFFFFF` | étiquettes, champs de formulaire, feuille du CV |

Contrastes mesurés : `--ink` sur `--wall` 12,7:1 ; `--ink-muted` sur `--wall` 5,4:1 ; `--ink-muted`
sur `--paper` 6,7:1 ; blanc sur `--ink` 15,9:1. `--rule` (1,3:1) ne sert jamais à délimiter un
élément interactif : les champs de formulaire prennent une bordure `--ink-muted` (critère WCAG
1.4.11).

Le portfolio n'a pas de couleur d'accent. Les seules autres couleurs viennent des projets.

### Typographie

- Une seule famille pour tout le site : **Schibsted Grotesk**, paquet
  `@fontsource-variable/schibsted-grotesk`, graisses 400 à 700.
- Échelle (rem) : 0,8125 · 0,875 · 1 · 1,125 · 1,3125 · 1,5 · 2,25 · 3. Le titre de l'accueil
  descend jusqu'à 2,25 rem sur mobile et monte à 3 rem sur grand écran.
- Texte courant : 1 rem, interligne 1,5, lignes de 65 caractères au plus. Titres : interligne 1,1,
  approche légèrement resserrée sur les grands corps.
- Tout en casse de phrase. Aucune capitale espacée, aucune étiquette au-dessus des titres, aucun
  mot isolé mis en valeur dans un titre.
- Le nom s'écrit « Thibault Rosalie » sur le site. La convention « ROSALIE » reste propre au CV.
- Les chiffres alignés (`font-variant-numeric: tabular-nums`) remplacent la police à chasse fixe
  pour les codes couleur et les dates.

### Formes et mouvement

- Rayon de 3 px pour les boutons et les champs, 2 px ou aucun pour les images. Plus de pilules.
- Aucune ombre portée. Les séparations se font par l'espace, et au besoin par un filet `--rule`.
- Les technologies d'un projet s'écrivent en texte, séparées par des virgules, plus en pastilles.
- Pas d'animation d'entrée ni d'effet de survol qui soulève ou agrandit. Le survol d'un lien ou
  d'une vignette souligne son titre.
- Focus clavier visible partout : contour `--ink` de 2 px, décalé de 3 px, sur `:focus-visible`.

### Ce qui disparaît

- Fonds flous et texture de bruit (`BaseLayout.astro`, `public/assets/backgrounds/`).
- Dégradés, ombres et jetons associés dans `global.css` (`--gradient-*`, `--shadow-*`,
  `--accent-*`, l'échelle `--gray-*` à remplacer par les jetons ci-dessus).
- Mode sombre : `ThemeToggle.astro`, le script en ligne de `MainHead.astro`, les règles
  `.theme-dark` partout.
- Le chargement de Public Sans et Rubik depuis Google Fonts dans `MainHead.astro`. Les paquets
  `@fontsource/public-sans` et `@fontsource/rubik` restent : le CV en a besoin.
- `Skills.astro` et la grille de compétences de l'accueil.
- `Pill.astro` et le style dégradé de `CallToAction.astro`.
- Les icônes décoratives : icône « terminal » à côté du nom, icônes des fonctionnalités, flèches
  et avion en papier des boutons, fusée du pied de page. Restent les icônes qui portent une
  information (GitHub et LinkedIn dans la navigation, flèches du carrousel).
- Les images du modèle jamais utilisées : `public/assets/stock-1.jpg` à `stock-4.jpg`,
  `public/assets/at-work.jpg`.
- Le champ `gradient` des projets, remplacé par le cadre décrit plus bas, et le champ `icon` des
  fonctionnalités.

## Les pages

### Navigation et pied de page

```
Thibault Rosalie                 Projets  À propos  CV  Contact      [gh] [in]  FR EN
```

Le nom à gauche, en 600. Les liens en texte ; la page courante est soulignée. GitHub et LinkedIn
restent des icônes avec un libellé pour les lecteurs d'écran, comme aujourd'hui. Le sélecteur de
langue devient deux liens texte, la langue courante marquée par le soulignement et
`aria-current`. Sur mobile, le menu replié actuel est conservé et restylé.

Pied de page : une ligne, « © 2026 Thibault Rosalie » et les liens GitHub et LinkedIn. La mention
« Créé avec Astro » disparaît.

### Accueil

```
Je conçois et je développe des applications web,
de la base de données jusqu'au dernier détail de l'interface.

Diplômé du BUT Informatique à Bayonne, je cherche un premier
poste de développeur full stack.

[Lire le CV]   M'écrire

┌──────────────────────────┐   ┌──────────────────────────┐
│ ChronoPotes, noir/jaune  │   │ Seenit, bois et laiton   │
│ [capture]                │   │ [capture]                │
└──────────────────────────┘   └──────────────────────────┘
 ChronoPotes, 2026               Seenit, 2026
 Projet personnel, en ligne      Projet personnel
 React, TypeScript, Supabase…    React, TypeScript, Node.js…

 (deux autres projets en dessous)

 Voir tous les projets
```

Textes de l'en-tête :

| | Français | Anglais |
|---|---|---|
| Titre | Je conçois et je développe des applications web, de la base de données jusqu'au dernier détail de l'interface. | I design and build web applications, from the database to the last detail of the interface. |
| Phrase | Diplômé du BUT Informatique à Bayonne, je cherche un premier poste de développeur full stack. | I hold a Computer Science degree (BUT) from Bayonne and I'm looking for my first full stack developer role. |
| Bouton | Lire le CV | Read my resume |
| Lien | M'écrire | Get in touch |

Le bouton principal mène au CV et le lien à la page de contact. La maquette proposait « Voir les
projets », mais les projets suivent immédiatement l'en-tête : un bouton pour y descendre ferait
doublon.

Sous l'en-tête, les quatre projets les plus récents (logique actuelle de `getWorkCollection`), en
deux colonnes sur grand écran, une sous 50em. Puis un lien « Voir tous les projets ». Pas de titre
de section ni de paragraphe d'introduction.

Le bloc de contact en bas de chaque page (`ContactCTA.astro`) devient une phrase et un lien :
« Vous recrutez un développeur full stack ? » suivi de « M'écrire » ; en anglais « Hiring a full
stack developer? » et « Get in touch ».

### La vignette d'un projet

C'est l'élément fort du site. Chaque vignette a deux parties :

1. **Le cadre**, dans l'identité du projet : la couleur de fond du produit, éventuellement un
   liseré, le nom du projet dans la police et le style du produit, puis la capture `img`.
2. **L'étiquette**, sur fond `--paper`, sous le cadre, dans la police du portfolio, selon la
   convention des cartels de musée :
   - ligne 1 : le titre en 600, suivi de l'année (`ChronoPotes, 2026`) ;
   - ligne 2 : le cadre du projet (`context`) ;
   - ligne 3 : les technologies (`tags`), séparées par des virgules.

Un projet sans identité prend un cadre `--ink` avec le titre en blanc dans la police du portfolio.
Un projet sans capture montre son titre en grand dans le cadre, sans dégradé de remplacement.

Toute la vignette est un seul lien vers la page du projet.

Identités connues (couleurs relevées dans le code des projets) :

| Projet | Fond | Liseré | Titre |
|---|---|---|---|
| ChronoPotes | `#101216` | aucun | Oswald 600, capitales, `#F5C518` |
| Seenit | `#2C1C0F` | `#4D331E` | Playfair Display 600 italique, `#C5A059` |

Les quatre autres projets (BluePoint, SportPXL, Covoit'Etud, Projet Chat) n'ont pas d'identité.

### Liste des projets (`/work/`)

Titre « Projets » (en anglais « Projects »), sans phrase d'introduction. Le projet le plus récent
en premier sur toute la largeur, les autres en grille de deux colonnes, avec les mêmes vignettes.
Ici l'étiquette ajoute la description du projet sous la ligne 2.

### Page d'un projet

Ordre des sections :

1. lien de retour « Retour aux projets » en texte simple ;
2. titre, description, puis une ligne en phrase pour la période, le cadre et l'équipe
   (« Novembre 2026, projet personnel, réalisé seul »), sans points médians ;
3. liens GitHub et démo en texte souligné, le bouton `--ink` pour la démo quand elle existe ;
4. la couverture dans le cadre du projet ;
5. « Le projet » (`intro`) ;
6. « Mon rôle » (`role`), remonté ici parce que c'est ce qu'une personne qui recrute veut lire ;
7. « Identité visuelle » : le nuancier, seulement si le projet a une identité ;
8. « Fonctionnalités » : liste en deux colonnes, titre en 600 et description, sans cartes ni
   icônes ;
9. « Stack technique » : liste de définitions, couche à gauche, technologies en texte à droite ;
10. « En images » : le carrousel actuel, restylé ;
11. « Pour aller plus loin » si le corps Markdown n'est pas vide.

Les titres de section sont des `h2` ordinaires : 1,5 rem, 600, `--ink`, casse de phrase.

### Le nuancier

Section « Identité visuelle » (« Visual identity ») sur les pages de Seenit et ChronoPotes :

- **Palette** : quatre pastilles rectangulaires, chacune avec son nom et son code hexadécimal en
  chiffres alignés ;
- **Polices** : pour chaque police du produit, « Aa » composé dans la police, son nom et son rôle ;
- **Pièce d'interface** : un élément typique du produit, recréé en HTML et CSS.

| Projet | Palette (FR / EN) | Polices | Pièce d'interface |
|---|---|---|---|
| Seenit | Bois / Wood `#2C1C0F`, Laiton / Brass `#C5A059`, Velours / Velvet `#3A1214`, Ivoire / Ivory `#EFEBD9` | Playfair Display (titres), DM Sans (texte), DM Mono (chiffres) | le talon de billet : titre d'un film, date de visionnage, note en étoiles |
| ChronoPotes | Nuit / Night `#101216`, Signal / Signal `#F5C518`, Palette / Flap `#20242C`, Cadran / Dial `#F4F1E8` | Oswald (textes), Space Mono (chiffres) | l'affichage à palettes d'un résultat (`04,96`, `04.96` en anglais) et sa mention « Masterclass » |

Les noms des couleurs sont une proposition, à corriger par Thibault s'il les nomme autrement dans
ses projets.

## Le CV

- La page `/cv/` montre le CV comme une feuille `--paper` posée sur le mur. Les boutons
  « Télécharger le PDF » et « Sauvegarder en PDF » suivent le style du site : bouton `--ink` et
  lien texte.
- Le document du CV garde ses polices (Rubik et Public Sans) : changer de police changerait la
  longueur des lignes et le ferait déborder sur deux pages. À l'écran, il les recevait par
  `--font-brand` et le lien Google Fonts, qui disparaissent tous deux : la page `/cv/` doit les
  importer depuis `@fontsource`, comme le fait déjà `CvPrintPage.astro`.
- Ses couleurs passent du violet à la palette du site : bandeau d'en-tête et colonne latérale en
  `--ink`, intertitres en `--ink`, textes secondaires en `--ink-muted`. Les dégradés deviennent des
  aplats.
- Le changement est fait dans `cv-print.css` et `cv-screen.css` ici, et dans
  `src/template/cv.css` de l'outil `candidatures`. La lettre (`src/template/letter.css`) suit la
  même palette, pour qu'un envoi CV et lettre reste cohérent.

## Autres pages

- **À propos** : en attendant le vrai texte, la carte « en construction » et son émoji
  disparaissent. La page montre le titre, le portrait, la phrase de disponibilité déjà rédigée
  pour la page de contact (`contact.availability.text`) et les liens vers le CV et le contact.
- **Contact** : même formulaire, restylé. Champs sur `--paper`, bordure `--ink-muted`, rayon 3 px,
  focus visible. Le bandeau de confirmation reste.
- **404** : titre, phrase et lien de retour, dans le cadre du site.

## Ce qui est laissé au constructeur

- Les valeurs d'espacement et les points de rupture précis (garder 50em comme seuil principal).
- La structure des composants : restyler ou supprimer `Hero`, `Grid` et `CallToAction` ;
  regrouper l'accueil et la liste des projets, aujourd'hui dupliqués à l'identique entre
  `src/pages/` et `src/pages/en/`, dans un composant unique comme pour le CV et le contact.
- La forme exacte du champ `identity` dans `src/content.config.ts`. Exigences : facultatif ; le
  style du titre (police, capitales, italique) est choisi dans une table fixe du code et non saisi
  en CSS libre dans le contenu ; les noms de couleurs existent dans les deux langues ; les codes
  couleur sont identiques entre les versions FR et EN d'un même projet.
- Le chargement des polices des projets (Oswald, Playfair Display, DM Sans, DM Mono, Space Mono) :
  `@fontsource`, sous-ensemble latin, une graisse par police, chargées seulement par les
  composants qui les utilisent.
- Les textes de la pièce d'interface de chaque nuancier, à placer dans `src/i18n/ui.ts`.

## Vérification

- `npm run check` et `npm run build` passent, PDF du CV compris (une page en FR et en EN).
- Dans l'outil `candidatures`, l'indicateur « tient sur 1 page » reste vert en FR et en EN.
- Revue visuelle de chaque type de page (accueil, liste, page projet avec et sans nuancier, CV,
  contact, à propos, 404) en FR et en EN, à 1440 px et à 375 px.
- Navigation complète au clavier, avec un focus visible partout et le lien d'évitement intact.
- Aucune requête vers `fonts.googleapis.com` ni `fonts.gstatic.com` dans l'onglet réseau.
- Plus aucune occurrence de `theme-dark`, `gradient-accent` ni des codes violets `#7611a6`,
  `#c561f6` et `#1c0056` dans `src/`, ni dans `src/template/cv.css` et `src/template/letter.css`
  de l'outil `candidatures`. L'interface de l'outil lui-même (`src/app/app.css`) n'est pas
  concernée.
