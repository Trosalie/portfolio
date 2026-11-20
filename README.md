# Portfolio — Thibault ROSALIE

Site personnel bilingue (français / anglais) d'un développeur full stack au terme d'un BUT
Informatique, en recherche de poste : projets, CV consultable et téléchargeable en PDF. Le
texte du CV se rédige dans un outil local à part, `candidatures` (voir plus bas).

**En ligne :** <https://trosalie.alwaysdata.net>

## Stack

- [Astro 5](https://astro.build) en sortie **statique** — aucun serveur applicatif en production.
- Internationalisation maison : un dictionnaire dans `src/i18n/ui.ts`, la langue déduite de
  l'URL. Le français est la locale par défaut et n'est pas préfixée (`/cv/`), l'anglais l'est
  (`/en/cv/`).
- [Puppeteer](https://pptr.dev) au moment du build, pour transformer les pages A4 du CV en PDF.
- `@astrojs/sitemap` pour le sitemap, `astro:assets` pour l'optimisation des images.
- Aucun framework d'interface : le peu de JavaScript client est écrit à la main.

## Commandes

| Commande               | Effet                                                              |
| :--------------------- | :----------------------------------------------------------------- |
| `npm install`          | Installe les dépendances (dont Chromium, pour Puppeteer)            |
| `npm run dev`          | Serveur de développement sur `localhost:4321`                       |
| `npm run check`        | Contrôle de types (`astro check`) — lancé aussi en CI               |
| `npm run build`        | Compile le site **et** génère les PDF du CV dans `dist/`            |
| `npm run build:fast`   | Compile le site seul, sans Puppeteer — pour itérer rapidement       |
| `npm run preview`      | Sert le `dist/` compilé                                             |

> `build:fast` produit un site dont les deux boutons « Télécharger le PDF » pointent dans le
> vide : les PDF ne sont créés que par `npm run build`. C'est la commande de déploiement.

## Organisation

```
src/
├── data/          cv.json (exporté par l'outil candidatures), cvExport.ts, cv.ts, profile.ts
├── i18n/ui.ts     Dictionnaire FR/EN + chemin de la page équivalente dans l'autre langue
├── components/    Composants, dont le CV (voir ci-dessous)
├── content/       Collections des projets : work/ (FR) et work-en/ (EN)
├── layouts/       BaseLayout : head, nav, footer, fonds de page
├── pages/         Routes publiées. Les pages EN vivent sous pages/en/
└── styles/        global.css + les feuilles du CV
scripts/
└── generate-cv-pdf.mjs   Sert dist/ en local, imprime les pages A4 du CV, vérifie qu'elles
                          tiennent sur une page
docs/
└── AMELIORATIONS.md      Backlog d'audit, points traités cochés
```

### Le CV : une seule source, hors du portfolio

Le CV est rendu par **quatre** routes — `/cv/`, `/en/cv/`, `/cv-print/`, `/en/cv-print/` — à
partir d'un seul composant, `CvDocument.astro`, habillé par `cv-screen.css` ou `cv-print.css`
selon le contexte.

Son texte, et les coordonnées, ne se rédigent **plus dans ce dépôt**. Ils vivent dans l'outil
local `candidatures` (`C:\dev\candidatures`, dépôt privé), où chaque texte est écrit une fois
en français et en anglais, et où se préparent aussi les versions de CV et les lettres de
motivation de chaque candidature. La version marquée « Publique » s'exporte ici dans
**`src/data/cv.json`** : ne pas modifier ce fichier à la main.

Pour changer le CV en ligne : le modifier dans l'outil, cliquer sur « Exporter vers le
portfolio », relire le diff, committer, déployer.

Deux garde-fous :

- `src/data/cvExport.ts` valide `cv.json` au chargement. Un export incomplet fait échouer le
  build en nommant le champ en cause, au lieu de publier un CV amputé.
- `scripts/generate-cv-pdf.mjs` compte les pages de chaque PDF : un CV de deux pages fait
  échouer le build. La page d'impression embarque les mêmes fichiers de police que l'outil
  (`@fontsource`), pour que le rendu de la CI soit celui que l'outil a mesuré.

La mise en page du CV existe en deux exemplaires (ici et dans l'outil) : changer le design
demande de le changer aux deux endroits.

Cette organisation remplace un état où le CV existait en cinq copies, qui avaient déjà divergé —
la page anglaise et le PDF anglais ne disaient pas la même chose en douze endroits. L'historique
est dans `docs/AMELIORATIONS.md`.

### Ajouter un projet

Créer le même fichier dans `src/content/work/` (français) **et** dans `src/content/work-en/`
(anglais), avec le **même nom de fichier** : c'est ce slug commun qui permet au sélecteur de
langue de retrouver la page équivalente. Le schéma attendu est dans `src/content.config.ts`.

## Déploiement

Un push sur la branche `release` déclenche `.github/workflows/deploy.yml` : contrôle de types,
build avec génération des PDF, puis synchronisation de `dist/` vers Alwaysdata par `rsync`.
Les identifiants sont des secrets GitHub (`REMOTE_USER`, `REMOTE_HOST`, `REMOTE_PATH`,
`SSH_PASSWORD`).

## État du projet

`docs/AMELIORATIONS.md` tient la liste des améliorations identifiées lors d'un audit, classées
par priorité, les points traités cochés. À lire avant d'ouvrir un chantier.
