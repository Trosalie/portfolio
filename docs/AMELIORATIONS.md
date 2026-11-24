# Backlog d'améliorations — Portfolio

Audit réalisé le 15 août 2026. Les points cochés ont été traités sur la branche
`ameliorations-perf-seo-i18n` ; les autres restent ouverts.

Chaque entrée donne le fait constaté (avec sa référence `fichier:ligne`), l'argument qui
justifie l'intervention, et l'action proposée.

---

## P0 — Performance

- [x] **Portrait de 15 Mo en image LCP.** `public/assets/portrait.jpg` était une photo brute
  de 4000×6000 (15 197 227 octets) affichée en 480×620, servie depuis `public/` donc hors de
  tout pipeline d'optimisation. Elle représentait ~90 % des 17 Mo du site.
  → Source redimensionnée en 1200×1800 dans `src/assets/`, rendue via `<Image>` d'`astro:assets`.
  Résultat : 17 à 56 Ko selon le viewport, `dist/` passé de 17 Mo à 2,5 Mo.

- [x] **Favicon de 335 Ko.** `MainHead.astro` pointait sur `/logo_nobg.png` (500×500), chargé
  sur chaque page pour une icône de 32 px.
  → `favicon-32.png` (3,4 Ko) et `apple-touch-icon.png` (16 Ko). Le logo source a quitté
  `public/` (tout ce qui s'y trouve part dans `dist/`, référencé ou non).

- [x] **Pipeline PDF cassé et fichiers orphelins.** `build:full` lançait le script Puppeteer
  après `astro build`, mais le script écrivait dans `public/` alors que `public/` avait déjà
  été copié vers `dist/`. Le `dist/` déployé contenait donc toujours les PDF du commit
  précédent, et le travail de Puppeteer en CI était intégralement jeté. Aucune page ne liait
  ces PDF.
  → Écriture dans `dist/assets/pdf/`, PDF sortis du dépôt (artefacts de build), bouton
  « Télécharger le PDF » ajouté sur `/cv/` et `/en/cv/`.

## P1 — Référencement et déclaration de langue

- [x] **`<html lang="fr">` en dur** dans `BaseLayout.astro` : les pages `/en/*` s'annonçaient
  comme françaises aux lecteurs d'écran comme aux moteurs.
  → Langue déduite de l'URL via `getLangFromUrl`.

- [x] **Aucun `canonical`, aucun `hreflang`.** Deux versions complètes du même contenu sans
  relation déclarée : cas d'école du contenu dupliqué.
  → `canonical` + `hreflang` fr/en/x-default dans `MainHead.astro`.

- [x] **Aucune balise Open Graph.** Seul `og:description` existait, via un bricolage
  (`name="description" property="og:description"` sur une seule balise). Un partage LinkedIn —
  canal principal pour une recherche de stage — affichait une carte grise.
  → Open Graph complet + Twitter Card + `public/og.jpg` (1200×630, 36 Ko).

- [x] **Pas de sitemap ni de robots.txt.**
  → `@astrojs/sitemap` avec exclusion des pages d'impression, et `public/robots.txt`.

- [x] **Le sitemap n'apparie pas `/lettre/` et `/en/letter/`.** `@astrojs/sitemap` ne relie
  automatiquement que les pages dont le chemin est identique d'une langue à l'autre. Les
  balises `hreflang` en page sont correctes et restent le signal principal, donc l'impact est
  faible. À traiter si les routes traduites se multiplient.
  → Sans objet : éditeur de lettre déplacé hors du portfolio (2026-11-20), dans l'outil local
  `candidatures`. Plus aucune route ne change de nom d'une langue à l'autre.

## P2 — Duplication de code

- [x] **`CvContent.astro` était du code mort (481 lignes).** Aucun `import` nulle part, alors
  que son en-tête affirmait « Utilisé à la fois par cv.astro et cv-print.astro ». La refacto
  avait été commencée puis abandonnée : `cv.astro` (~700 l.) et `cv-print.astro` (~690 l.)
  embarquaient chacun leur copie intégrale du CV. Le contenu existait en **5 exemplaires**.
  → Contenu extrait dans `src/data/cv.ts` (typé `Record<Lang, CvData>`, donc une langue
  incomplète échoue au `astro check`), rendu unique dans `CvDocument.astro` décliné par une
  prop `variant` écran/impression, styles dans `src/styles/cv-{screen,print}.css`.
  `CvContent.astro` supprimé, les quatre pages tombent à six lignes. **−1 687 lignes.**

  **La dérive s'était produite deux fois.** D'abord sur l'âge : les cinq copies affichaient
  quatre valeurs différentes, seul le PDF français étant juste. Puis, découvert au moment de
  la refacto, entre l'écran et le PDF : la page anglaise et le PDF anglais divergeaient en
  **douze endroits** — faute « studiying », « UIT » au lieu de « IUT » quatre fois, paragraphe
  de profil entièrement différent, « POO » au lieu de « OOP », repères ARIA rédigés en
  français. Le PDF, celui qu'un recruteur reçoit, a été retenu comme référence partout.

- [x] **Pages FR/EN dupliquées.** `cv.astro` vs `en/cv.astro` : ~170 lignes de différence sur
  ~700, soit 75 % identiques. `lettre.astro` vs `en/letter.astro` : 34 lignes sur 386, soit
  **91 % identiques**, CSS et logique JavaScript compris.
  → Une seule page par fonctionnalité. Le CV et la lettre passent par un composant unique
  alimenté par `src/data/`, les libellés restants rejoignent `src/i18n/ui.ts`, et les pages de
  `src/pages/` ne déclarent plus que leur route. La barre des pages d'impression est
  mutualisée dans `PrintToolbar.astro`. **−2 188 lignes au total sur les deux chantiers.**

- [x] **Deux collections de contenu parallèles** (`work` / `work-en`, mêmes slugs). Rien ne
  garantit leur synchronisation : un projet ajouté en FR et oublié en EN casse le sélecteur de
  langue en silence, sans erreur de build.
  → **La dérive s'était déjà produite**, dans une autre variante que celle redoutée :
  `en/index.astro` chargeait la collection `work` — la française — et ne passait pas de
  `basePath` à `PortfolioPreview`. L'accueil anglais affichait donc les trois projets décrits
  en français, avec des cartes renvoyant vers `/work/<slug>` au lieu de `/en/work/<slug>`.

  Les deux collections passent maintenant par `getWorkCollection(lang)`
  (`src/data/work.ts`), seul point d'entrée. Il charge toujours **les deux**, compare les jeux
  de slugs et interrompt le build en nommant les orphelins de chaque côté. Vérifié : en
  retirant un projet anglais, le build sort en code 1 avec le slug en cause. Il expose aussi
  `workBasePath(lang)`, jusqu'ici recopié à la main sur chaque appel.

## P3 — Cohérence linguistique et navigation

- [x] **`Skills.astro` intégralement en français en dur**, alors qu'il est rendu sur la page
  d'accueil anglaise (`en/index.astro`). Un visiteur anglophone lisait trois paragraphes en
  français — le défaut le plus visible du site pour un recruteur international.
  → Textes passés en i18n.

- [x] **`Footer.astro` : « Créé avec Astro »** sur toutes les pages EN. → i18n.

- [x] **Le sélecteur FR/EN menait à un 404 sur la page lettre.** `getAlternateLangPath`
  traduisait le chemin littéralement : `/lettre/` → `/en/lettre/`, page inexistante.
  → Table des segments de route qui diffèrent entre les langues, vérifiée sur les 19 routes du
  site dans les deux sens.

- [x] **`Nav.astro` : le logo pointait sur `/` en dur**, renvoyant à l'accueil français depuis
  n'importe quelle page anglaise. → Utilise le préfixe de langue.

- [x] **`404.astro` rédigé en anglais** pour la locale par défaut, sans lien de retour.
  → Traduit et doté d'un lien vers l'accueil.

- [ ] **Pas de page 404 par langue.** Un hébergement statique ne sert qu'une seule page
  d'erreur : `/en/404` ne serait jamais atteinte sans configuration serveur côté Alwaysdata.
  En attendant, le sélecteur de langue de la page 404 renvoie vers l'accueil de l'autre langue,
  une page d'erreur n'ayant pas d'équivalent traduit. À traiter avec une règle `ErrorDocument`
  si le besoin se confirme.

- [x] **`npm run build` seul produisait deux liens de téléchargement morts.** Les PDF n'étaient
  générés que par `npm run build:full`. Le workflow de déploiement utilisait bien `build:full`,
  donc la production était correcte — mais un déploiement manuel lancé depuis `npm run build`
  livrait un `/cv/` dont le bouton de téléchargement renvoyait sur du vide.
  → Les deux scripts sont fusionnés : `npm run build` compile et génère les PDF. `build:fast`
  reste disponible pour itérer sans Puppeteer, et le README dit explicitement qu'il ne produit
  pas de PDF.

- [ ] **« À propos » affiche « 🚧 en construction »** alors que la page est dans le menu
  principal. Sur un portfolio de recherche de stage, une entrée de menu menant à une page vide
  coûte plus cher que l'absence d'entrée. → La remplir, ou la retirer du nav en attendant.
  Avancement (2026-11-20, direction visuelle « La vitrine ») : la carte de chantier est
  remplacée par une page provisoire (portrait, phrase de disponibilité, liens vers le CV et le
  contact). Le texte de la page reste à écrire.
  Mise à jour (2026-11-21) : la page est masquée en attendant son texte. Elle n'est plus dans
  le menu et n'est plus construite : ses routes sont `src/pages/_about.astro` et
  `src/pages/en/_about.astro`, qu'Astro ignore grâce au « _ ». Retirer ce préfixe et remettre
  l'entrée `nav.about` dans `Nav.astro` la remet en ligne.

## P4 — Outillage et dépôt

- [x] **Aucun contrôle qualité automatisé.** Le `tsconfig` étendait `astro/tsconfigs/strict`
  mais rien ne le vérifiait, ni en local ni en CI.
  → `@astrojs/check` installé, `npm run check` disponible et lancé par le workflow avant le
  build. ESLint, Prettier et `.editorconfig` restent à faire si le besoin se confirme.

- [x] **Le README était le template Astro non modifié** (« Astro Starter Kit: Portfolio »,
  « Seasoned astronaut? Delete this file »). Le dépôt est lié depuis le portfolio *et* depuis
  le CV : un recruteur qui cliquait tombait sur la documentation d'un template.
  → Réécrit : présentation, stack, commandes, arborescence, règle de la source unique pour le
  CV et la lettre, procédure d'ajout d'un projet, déploiement.

- [ ] **Déploiement par mot de passe SSH.** `deploy.yml` utilise `sshpass -e` avec
  `StrictHostKeyChecking=no`. Alwaysdata supporte les clés SSH : une deploy key dédiée avec
  `known_hosts` épinglé supprime le risque de MITM et la dépendance à sshpass.

- [x] **`astro-i18n` était une dépendance non utilisée.** Aucun import dans `src/` ni dans
  `astro.config.mjs` — le projet utilise son propre `src/i18n/ui.ts`. → Désinstallée.

- [ ] **13 vulnérabilités npm en dépendances de production** (sharp/libvips, picomatch),
  héritées de l'arbre de dépendances d'Astro. Le site étant statique, rien de tout cela ne
  s'exécute à l'exécution : le risque est limité au poste de build. À traiter lors d'une montée
  de version d'Astro.

- [x] **`.venv/` dans le `.gitignore`** d'un projet Astro : résidu. → Retiré.

- [ ] **Le blob de 15 Mo subsiste dans l'historique git.** Le fichier a été supprimé du dépôt
  mais reste dans les objets git : chaque clone le télécharge encore. Le retirer demanderait une
  réécriture d'historique (`git filter-repo`) et un `push --force`, à ne faire que si le poids
  du clone devient gênant.

## P5 — Accessibilité et UX

- [x] **Pas de lien d'évitement (« skip to content »)**, et dans `index.astro` le `<h1>` est
  hors du `<main>` (le hero est dans un `<header>` qui précède `<main>`) : structure de
  landmarks incohérente pour la navigation au clavier et au lecteur d'écran.
  → Lien d'évitement dans `BaseLayout.astro`, visible au focus, ciblant un `id="main-content"`
  ajouté aux onze `<main>` du site. Le `<nav>` était nu : il rejoint un `<header>`, seul
  `banner` du document. Les `<header>` de l'accueil et des pages projet, qui revendiquaient un
  `banner` concurrent **sans** contenir la navigation, redeviennent des `<div>` et passent à
  l'intérieur du `<main>` — le `<h1>` y entre avec eux. Les pages « À propos » étaient les
  seules **sans `<main>` du tout** (`WorkInProgress.astro` n'émettait que des `<div>`).
  Au passage, la hiérarchie des titres de l'accueil sautait de `h1` à `h3` : `h3`→`h2` et
  `h4`→`h3`.

- [x] **Formulaire de contact** (`contact.astro`) : pas de honeypot ni de protection anti-spam,
  et pas de paramètre `_next` Formspree — après envoi, l'utilisateur est éjecté sur le domaine
  formspree.io au lieu de rester sur le site. Vérifier aussi la cohérence de l'adresse affichée
  (`thibaultrosaliepro@gmail.com`) avec celle du CV.
  → Honeypot `_gotcha` (sorti de l'écran, hors parcours clavier et hors arbre d'accessibilité),
  `_next` vers `/contact/?envoye=1` — le bandeau de confirmation se dévoile au retour puis
  l'URL est nettoyée — et `_subject` traduit, les deux langues partageant le même endpoint.
  Les coordonnées sont lues dans `src/data/profile.ts`, qui alimente déjà le CV : la cohérence
  devient structurelle au lieu d'être vérifiée à l'œil. Ajout des `autocomplete`.

  **Les deux pages étaient encore dupliquées**, à l'identique sur 255 lignes — le chantier P2
  les avait manquées. Corriger deux fois et maintenir la synchronisation à la main aurait
  rejoué la dérive du CV : rendu unique dans `ContactPage.astro`, les pages de `src/pages/`
  ne déclarent plus que leur route.

- [x] **Images des pages projet sans dimensions ni `loading`** (`work/[...slug].astro` et son
  équivalent EN) → décalage de mise en page au chargement. `PortfolioPreview.astro` le fait
  correctement, ces pages non.
  → Deux nuances à l'audit, vérifiées. D'abord, ces `<img>` sont **inertes** : aucun des six
  fichiers de contenu ne renseigne `img`, ils n'ont qu'un `gradient`. Ensuite,
  `PortfolioPreview.astro` ne « le fait » pas non plus — il n'avait pas davantage de
  dimensions, il était simplement protégé par un conteneur de hauteur fixe.

  La cause tient au schéma : `img` y était une `z.string()`, donc un chemin opaque qu'aucun
  outil ne pouvait mesurer. Il passe par le helper `image()`, ce qui fait entrer le fichier
  dans le pipeline `astro:assets` — comme le portrait de l'accueil — et les trois points de
  rendu utilisent `<Image>`. Les `width`/`height` sont désormais déduits du fichier source.
  Vérifié en ajoutant temporairement une image à un projet : le HTML sort en WebP avec ses
  dimensions et, pour les cartes, un `srcset` à trois tailles.

- [x] **Contrastes à mesurer** : `--gray-300` sur `--gray-999` dans `.info-list`, et les
  placeholders en `--gray-600`, sont probablement sous le seuil 4.5:1 du WCAG AA. À passer au
  contrast checker plutôt qu'à l'œil.
  → Mesuré. L'hypothèse était juste pour l'un, fausse pour l'autre. La palette étant inversée
  entre les deux thèmes, chaque variable a été mesurée deux fois :

  | Élément | Couleur sur `--gray-999` | Clair | Sombre |
  |---|---|---|---|
  | `.info-list` (texte et liens) | `--gray-300` | 6,48:1 | 8,70:1 |
  | `::placeholder` (avant) | `--gray-600` | **2,26:1** | **3,03:1** |
  | `::placeholder` (après) | `--gray-400` | 4,60:1 | 6,22:1 |

  `.info-list` était donc conforme et n'a pas bougé. Les placeholders échouaient dans les deux
  thèmes, et ils portent une information de format (« Proposition de poste, collaboration… »),
  pas du décor : passés en `--gray-400`.

  Deux défauts voisins relevés au passage sur la même page. `input:focus { outline: none }`
  supprimait l'indicateur de focus natif en ne le remplaçant que par une couleur de bordure :
  remplacé par un `outline` sur `:focus-visible`. Et les liens de `.info-list` avaient
  exactement la couleur du texte qui les entoure, sans soulignement — rien ne les signalait
  comme liens (WCAG 1.4.1) : soulignés.

## P6 : Interface (audit du 21 novembre 2026)

Audit front-end mené sur le site construit, à 1440 px et à 375 px, après la direction visuelle
« La vitrine ». Classé du plus urgent au moins urgent. Les points 1, 2 et 4 sont les trois
retenus en premier.

- [x] **1. La vitrine ne marche que pour 2 projets sur 6.** BluePoint, Projet Chat, SportPXL et
  Covoit'Etud retombent sur le même cadre encre et la police du site
  (`src/components/work/ProjectFrame.astro:27`) : sur `/work/`, quatre vignettes identiques sur
  six, et l'idée forte du site s'efface. Chacun a pourtant une identité visible dans ses
  captures (logo et orange de SportPXL, bleu pervenche de Covoit'Etud, interface industrielle
  sombre de BluePoint, terminal du Chat).
  → Le nuancier est devenu facultatif mais entier, et les six projets ont un cadre. Trois
  styles de titre s'ajoutent : la police du site (Covoit'Etud, BluePoint), Jost en capitales
  (SportPXL, à la place de Futura, commerciale) et DM Mono (Projet Chat). Un test exige 4,5:1
  entre chaque titre et son fond. Le liseré de SportPXL est marine : l'orange des boutons lisait
  comme un état sélectionné.

- [x] **2. Sur téléphone, les vignettes sont des miniatures d'écran de bureau.** Les captures
  sont recadrées en 16:10 (`ProjectFrame.astro:88`) : à 375 px, l'accueil de Seenit ou le flux
  de BluePoint font 300 px de large et ne se lisent plus. Le titre de l'accueil prend sept
  lignes et le premier projet n'apparaît qu'au bas du premier écran. Les recruteurs ouvrent
  souvent le lien depuis LinkedIn, sur téléphone.
  → Sous 50em, chaque vignette sert un détail de l'interface (`img_mobile`, découpé par
  `scripts/crop-mobile-tiles.mjs`, de 460 à 820 px de large dans les captures de bureau pour que
  le texte reste lisible, 1250 px dans la capture de téléphone de ChronoPotes).
  Le titre de l'accueil passe à 1,75rem : le premier projet apparaît dans le premier écran.

- [x] **3. Aucune capture ne s'agrandit.** La couverture et la galerie n'ouvrent rien ; un clic
  sur une voisine la centre seulement (`src/components/project/ProjectGallery.astro:169`).
  → Une visionneuse sur `<dialog>` natif, aux couleurs du cadre de chaque projet
  (`CaptureViewer.astro`). Le plein écran seul ne gagnait que 15 % sur téléphone : une capture de
  bureau s'y ouvre agrandie (800 px au moins) et se parcourt au doigt. Clavier, focus rendu,
  lien vers l'image sans JavaScript. Ses comportements sont testés dans un navigateur, aussi
  avant chaque déploiement.

- [x] **4. Les pages projet ne mènent nulle part et laissent une colonne vide.** Sur grand
  écran, le tiers droit reste vide pendant que période, cadre et équipe tiennent en trois
  lignes grises (`src/components/project/ProjectHero.astro:26`) et que la stack est tout en bas
  (`src/layouts/ProjectLayout.astro:72`). La page finit sur le bloc de contact, sans suite.
  → Une fiche (période, cadre, équipe, technologies) à droite du titre à partir de 50em, sous
  les liens en dessous ; la stack détaillée reste en bas. La page finit sur « Projet suivant »,
  un bandeau dans le cadre du projet suivant, le premier après le dernier.

- [x] **5. La liste des projets finit sur une vignette orpheline et ne hiérarchise rien.** Un
  projet en vedette puis cinq en grille de deux (`src/styles/global.css:245`) : Covoit'Etud
  reste seul avec un trou à droite, et un TP en C pèse autant que Seenit.
  → Deux niveaux, par un champ `level` obligatoire dans le contenu : ChronoPotes, Seenit et
  BluePoint en grand, puis « Projets de BUT » en rangée de trois. L'accueil ne montre plus que les
  trois phares. Dans une rangée, cadres, captures et cartels s'alignent (`subgrid`).

- [x] **6. Rien ne relie la vignette à sa page.** Le produit ne réapparaît qu'à la couverture,
  après une page grise.
  → Transitions entre pages du navigateur (`PageTransition.astro`) : le cadre du projet glisse
  entre sa vignette, sa couverture et « Projet suivant », le reste se fond en 300 ms, rien sous
  `prefers-reduced-motion`. Nommer tous les cadres en CSS faisait traverser l'écran aux cadres
  voisins : un petit script n'en nomme qu'un. Les liens de projet ont pris la barre finale, qui
  évite une redirection à chaque clic.

- [ ] **7. La pièce d'interface du nuancier est figée.** L'affichage à palettes de ChronoPotes
  (`src/components/project/specimens/ChronoFlaps.astro:18`) est une image en HTML.
  → La rendre jouable : on arrête le chrono à l'aveugle, les palettes tournent jusqu'au résultat
  et à sa mention. Espace au clavier, résultat en `aria-live`, affichage direct en mouvement
  réduit.

- [x] **8. La typographie française n'est pas finie.** Aucune espace insécable dans les
  sources (« full stack ? », « projet : ce formulaire », `src/i18n/ui.ts:26` et `:80`, et les
  contenus Markdown) : la ponctuation peut se retrouver seule en début de ligne. Aucun
  `text-wrap` : le titre de l'accueil coupe « de la / base de données ».
  → Au rendu (`src/middleware.ts`, `src/typography.ts`), textes traduits et Markdown compris :
  espace fine insécable avant `? ! ;`, espace insécable avant `:` et dans les guillemets, selon
  l'usage français. Pages françaises seulement, CV exclu (son PDF tient sur une page et se relit
  par des outils). `text-wrap: balance` sur les titres, `pretty` sur les paragraphes ; « de la
  base » ne se coupe plus dans le titre de l'accueil.

- [x] **9. Le menu mobile ne se ferme qu'avec son bouton.** Ni Échap ni clic extérieur
  (`src/components/Nav.astro:127`).
  → Échap le ferme et rend le focus au bouton, un appui à l'extérieur le ferme aussi. Sur grand
  écran, où le menu est toujours affiché, rien ne le masque.

- [x] **10. Les alignements.** Les filets du bloc de contact et du pied de page dépassent la
  colonne de texte de 48 px de chaque côté, la bordure étant posée sur une boîte plus large que
  son contenu (`src/components/ContactCTA.astro:22`, `src/components/Footer.astro:23`). Sur
  `/contact/`, le bouton d'envoi touche le filet du pied de page, faute de marge sous le
  `<main>` (`src/components/ContactPage.astro:123`). Sur `/cv/`, un grand vide sépare le menu
  des boutons, alignés à droite alors que le site s'aligne à gauche.
  → Les filets s'arrêtent à la colonne de texte, le formulaire garde sa distance avec le pied de
  page, le CV et ses boutons s'alignent sur le bord gauche du site avec l'écart des autres pages.
  La piste de la galerie, décalée de 32 px à 1440 px, va maintenant d'un bord à l'autre de la page
  et reste centrée sur la colonne.
