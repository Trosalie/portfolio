# Portfolio — Thibault ROSALIE

Site personnel bilingue (français / anglais) d'un développeur full stack au terme d'un BUT
Informatique, en recherche de poste : projets, CV consultable et téléchargeable en PDF. Le
dépôt embarque aussi un éditeur de lettre de motivation, outil personnel qui ne part pas en
production (voir plus bas).

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
├── data/          Contenu structuré : cv.ts, letter.ts, profile.ts
├── i18n/ui.ts     Dictionnaire FR/EN + résolution des routes traduites
├── components/    Composants, dont le CV et la lettre (voir ci-dessous)
├── content/       Collections des projets : work/ (FR) et work-en/ (EN)
├── layouts/       BaseLayout : head, nav, footer, fonds de page
├── pages/         Routes publiées. Les pages EN vivent sous pages/en/
├── routes-dev/    Routes servies en dev seulement (éditeur de lettre)
└── styles/        global.css + les feuilles du CV et de la lettre
scripts/
└── generate-cv-pdf.mjs   Sert dist/ en local et imprime les pages A4 du CV
docs/
└── AMELIORATIONS.md      Backlog d'audit, points traités cochés
```

### CV et lettre : une seule source

Le CV est rendu par **quatre** routes — `/cv/`, `/en/cv/`, `/cv-print/`, `/en/cv-print/` — mais
son contenu n'est écrit qu'**une fois**, dans `src/data/cv.ts`. Les pages ne font que déclarer
leur route ; tout le balisage vient de `CvDocument.astro`, habillé par `cv-screen.css` ou
`cv-print.css` selon le contexte. Même principe pour la lettre de motivation.

Pour corriger une date, une mission ou un intitulé : **modifier `src/data/cv.ts`, et rien
d'autre.** Le typage `Record<Lang, CvData>` fait échouer `npm run check` si une langue est
incomplète.

Cette structure remplace un état où le CV existait en cinq copies, qui avaient déjà divergé —
la page anglaise et le PDF anglais ne disaient pas la même chose en douze endroits. L'historique
est dans `docs/AMELIORATIONS.md`.

### L'éditeur de lettre ne va pas en ligne

L'éditeur de lettre de motivation est un outil personnel, pas une page du portfolio : il sert à
rédiger une lettre puis à l'enregistrer en PDF, et n'a aucune raison d'être public.

Ses quatre routes vivent donc dans **`src/routes-dev/`** et non dans `src/pages/`, où tout
fichier deviendrait une page. Une petite intégration d'`astro.config.mjs` les rebranche
uniquement quand Astro tourne en mode `dev`. Le bouton « Rédiger ma lettre » du hero suit le
même signal, via `import.meta.env.DEV`, sans quoi il resterait en production en pointant vers
une page absente.

Conséquence : **aucun build ne peut publier ces pages**, pas même un `npm run build` lancé à la
main. Pour écrire une lettre, `npm run dev` puis `/lettre/` ou `/en/letter/`.

Le reste de la fonctionnalité — `src/data/letter.ts`, `LetterEditorPage.astro`,
`LetterPrintPage.astro`, `letter-{editor,print}.css`, les clés `letter.*` — reste en place et
continue d'être vérifié par `npm run check`.

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
