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

- [ ] **Le sitemap n'apparie pas `/lettre/` et `/en/letter/`.** `@astrojs/sitemap` ne relie
  automatiquement que les pages dont le chemin est identique d'une langue à l'autre. Les
  balises `hreflang` en page sont correctes et restent le signal principal, donc l'impact est
  faible. À traiter si les routes traduites se multiplient.

## P2 — Duplication de code

- [ ] **`CvContent.astro` est du code mort (481 lignes).** Aucun `import` nulle part, alors
  que son en-tête affirme « Utilisé à la fois par cv.astro et cv-print.astro ». La refacto a
  été commencée puis abandonnée : `cv.astro` (~700 l.) et `cv-print.astro` (~690 l.) embarquent
  chacun leur copie intégrale du CV. Le contenu existe donc en **6 exemplaires**
  (FR/EN × cv / cv-print / CvContent mort). Chaque correction — adresse, date, mission —
  demande 6 modifications, avec certitude d'en oublier une. Un CV affiché à l'écran qui diffère
  du PDF téléchargé est éliminatoire sur une candidature.
  → Extraire les données du CV dans un fichier de données par langue et n'avoir qu'un seul
  composant de rendu. **C'est le chantier prioritaire restant.**

  **La dérive s'est déjà produite.** Au moment de rendre l'âge automatique, les cinq copies
  affichaient quatre valeurs différentes : `22 ans` sur la page FR, `23 ans` dans le PDF FR,
  `22 ans` — en français — sur la page EN, et `22 years old` dans le PDF EN. Seul le PDF
  français était juste. C'est exactement le scénario décrit ci-dessus, et il concernait la
  donnée la plus visible du CV.

  `src/data/profile.ts` a été créé à cette occasion : c'est l'amorce du fichier de données
  visé par cette refacto. Les prochaines données extraites (coordonnées, formation,
  expériences) ont vocation à l'y rejoindre.

- [ ] **Pages FR/EN dupliquées.** `cv.astro` vs `en/cv.astro` : ~170 lignes de différence sur
  ~700, soit 75 % identiques. `lettre.astro` vs `en/letter.astro` : 34 lignes sur 386, soit
  **91 % identiques**, CSS et logique JavaScript compris.
  → Une seule page par fonctionnalité, textes dans `src/i18n/ui.ts` (le mécanisme existe déjà
  et fonctionne bien).

- [ ] **Deux collections de contenu parallèles** (`work` / `work-en`, mêmes slugs). Rien ne
  garantit leur synchronisation : un projet ajouté en FR et oublié en EN casse le sélecteur de
  langue en silence, sans erreur de build.

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

- [ ] **`npm run build` seul produit deux liens de téléchargement morts.** Les PDF ne sont
  générés que par `npm run build:full`. Le workflow de déploiement utilise bien `build:full`,
  donc la production est correcte — mais un déploiement manuel lancé depuis `npm run build`
  livrerait un `/cv/` dont le bouton de téléchargement renvoie sur du vide. À sécuriser en
  fusionnant les deux scripts, ou en documentant la commande de déploiement.

- [ ] **« À propos » affiche « 🚧 en construction »** alors que la page est dans le menu
  principal. Sur un portfolio de recherche de stage, une entrée de menu menant à une page vide
  coûte plus cher que l'absence d'entrée. → La remplir, ou la retirer du nav en attendant.

## P4 — Outillage et dépôt

- [ ] **Aucun contrôle qualité automatisé.** `@astrojs/check` n'est pas installé, ni ESLint, ni
  Prettier, ni `.editorconfig`. Le `tsconfig` étend `astro/tsconfigs/strict` mais rien ne le
  vérifie, ni en local ni en CI. Un `astro check` dans le workflow attraperait typiquement une
  clé i18n manquante avant qu'elle n'atteigne la production.

- [ ] **Le README est le template Astro non modifié** (« Astro Starter Kit: Portfolio »,
  « Seasoned astronaut? Delete this file »). Le dépôt est lié depuis le portfolio *et* depuis
  le CV : un recruteur qui clique tombe sur la documentation d'un template. Cinq minutes de
  travail pour un signal disproportionné.

- [ ] **Déploiement par mot de passe SSH.** `deploy.yml` utilise `sshpass -e` avec
  `StrictHostKeyChecking=no`. Alwaysdata supporte les clés SSH : une deploy key dédiée avec
  `known_hosts` épinglé supprime le risque de MITM et la dépendance à sshpass.

- [ ] **`astro-i18n` est une dépendance non utilisée.** Aucun import dans `src/` ni dans
  `astro.config.mjs` — le projet utilise son propre `src/i18n/ui.ts`. À désinstaller.

- [ ] **13 vulnérabilités npm en dépendances de production** (sharp/libvips, picomatch),
  héritées de l'arbre de dépendances d'Astro. Le site étant statique, rien de tout cela ne
  s'exécute à l'exécution : le risque est limité au poste de build. À traiter lors d'une montée
  de version d'Astro.

- [ ] **`.venv/` dans le `.gitignore`** d'un projet Astro : résidu à nettoyer.

- [ ] **Le blob de 15 Mo subsiste dans l'historique git.** Le fichier a été supprimé du dépôt
  mais reste dans les objets git : chaque clone le télécharge encore. Le retirer demanderait une
  réécriture d'historique (`git filter-repo`) et un `push --force`, à ne faire que si le poids
  du clone devient gênant.

## P5 — Accessibilité et UX

- [ ] **Pas de lien d'évitement (« skip to content »)**, et dans `index.astro` le `<h1>` est
  hors du `<main>` (le hero est dans un `<header>` qui précède `<main>`) : structure de
  landmarks incohérente pour la navigation au clavier et au lecteur d'écran.

- [ ] **Formulaire de contact** (`contact.astro`) : pas de honeypot ni de protection anti-spam,
  et pas de paramètre `_next` Formspree — après envoi, l'utilisateur est éjecté sur le domaine
  formspree.io au lieu de rester sur le site. Vérifier aussi la cohérence de l'adresse affichée
  (`thibaultrosaliepro@gmail.com`) avec celle du CV.

- [ ] **Images des pages projet sans dimensions ni `loading`** (`work/[...slug].astro` et son
  équivalent EN) → décalage de mise en page au chargement. `PortfolioPreview.astro` le fait
  correctement, ces pages non.

- [ ] **Contrastes à mesurer** : `--gray-300` sur `--gray-999` dans `.info-list`, et les
  placeholders en `--gray-600`, sont probablement sous le seuil 4.5:1 du WCAG AA. À passer au
  contrast checker plutôt qu'à l'œil.
