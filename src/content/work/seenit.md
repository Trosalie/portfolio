---
title: Seenit
level: featured
publishDate: 2026-11-19 00:00:00
description: |
  Application web locale pour tenir le journal de ses films : une bibliothèque en forme d'étagère, une liste à voir, un calendrier de séances, des statistiques et des recommandations nourries par TMDb.
tags:
  - React
  - TypeScript
  - Node.js
  - SQLite
  - API TMDb
img: ../../assets/projets/seenit/couverture.webp
img_alt: "Accueil de Seenit : le fronton À l'affiche annonce trois séances prévues, au-dessus de la recherche, des filtres et du début de l'étagère des derniers visionnages."
img_mobile: ../../assets/projets/seenit/vignette-mobile.webp
period: Novembre 2026
context: Projet personnel
team: Seul
identity:
  frame:
    background: "#2C1C0F"
    border: "#4D331E"
    titleColor: "#C5A059"
    titleStyle: playfair-italic
  palette:
    - { name: Bois, hex: "#2C1C0F" }
    - { name: Laiton, hex: "#C5A059" }
    - { name: Velours, hex: "#3A1214" }
    - { name: Ivoire, hex: "#EFEBD9" }
  fonts:
    - { family: Playfair Display, role: Titres }
    - { family: DM Sans, role: Texte }
    - { family: DM Mono, role: Chiffres }
  specimen: seenit-ticket
intro: |
  Seenit est mon journal de cinéma : chaque film vu, chaque note, chaque séance prévue. L'interface reprend l'univers d'une salle de cinéma ancienne, avec une étagère en bois, des plaques de laiton et des fiches en forme de talon de billet. Les données de TMDb remplissent les fiches, relient chaque film à ses réalisateurs et à ses acteurs, et proposent des recommandations à partir de ce que j'ai aimé. L'application tourne sur mon poste : un petit serveur Node sert l'interface, conserve la bibliothèque dans SQLite et démarre avec la session Windows.
features:
  - title: Une étagère qui se range seule
    description: Les films vus se classent par mois de visionnage, derrière des plaques de laiton, et les sagas se regroupent en coffrets qui s'ouvrent sur place.
  - title: Fiches film et personne
    description: Synopsis, distribution, bande-annonce et plateformes où regarder le film en France ; la fiche d'un réalisateur ou d'un acteur déroule sa filmographie et montre ce que j'en ai déjà vu.
  - title: Recommandations
    description: L'onglet Découvrir croise les recommandations des films bien notés et de la liste à voir, et écarte ce qui ressemble aux films mal notés.
  - title: Calendrier des séances
    description: Une affiche glissée sur un jour planifie une séance, et les sorties à venir des films attendus s'y ajoutent d'elles-mêmes.
  - title: Statistiques de l'année
    description: Une pellicule déroule les mois de l'année, avec le temps passé devant l'écran, la note moyenne et les réalisateurs les plus vus.
  - title: Que regarder ce soir ?
    description: Un tirage au sort parmi les films à voir, filtré par durée, par genre et par plateformes auxquelles je suis abonné.
  - title: Navigation au clavier
    description: Une palette Ctrl+K pour aller à un film, une personne ou un onglet, des raccourcis pour chaque action, et une adresse qui suit la fiche ouverte.
  - title: Application installable
    description: Seenit s'installe comme une application dans Chrome ou Edge, avec sa propre fenêtre, son icône et des raccourcis.
stack:
  - layer: Frontend
    items: [React 19, TypeScript strict, Vite]
  - layer: Serveur
    items: [Node.js 24, node:http, node:sqlite]
  - layer: Données
    items: [SQLite, API TMDb]
  - layer: Tests
    items: [Vitest, Playwright]
  - layer: Qualité
    items: [oxlint, Prettier]
role: |
  Projet personnel mené seul. La logique métier vit à part de l'interface, en fonctions pures testées : filtres, statistiques, recommandations, calendrier, et un réducteur par lequel passe chaque modification de la bibliothèque.

  La bibliothèque vivait d'abord dans le navigateur. Je l'ai migrée vers un serveur Node sans aucune dépendance, avec node:sqlite et TypeScript exécuté nativement, pour que tous les navigateurs du poste partagent la même bibliothèque. Le serveur relaie aussi les appels à TMDb : la clé d'API n'arrive jamais dans le code envoyé au navigateur, et le build échoue si on tente de l'y exposer. Les données sont versionnées et migrées automatiquement, et le serveur en garde une copie chaque jour. Les tests de bout en bout tournent à date figée, avec TMDb simulé, pour ne dépendre ni du jour ni du réseau.
gallery:
  - src: ../../assets/projets/seenit/etagere.webp
    alt: "Étagère de la bibliothèque Seenit : sous la plaque Novembre 2026, les affiches de Mulholland Drive, Aftersun, La Zone d'intérêt, Perfect Days et un coffret Dune de deux films, puis la rangée d'octobre."
    caption: Les films vus se rangent par mois de visionnage, et les sagas en coffrets.
  - src: ../../assets/projets/seenit/fiche-film.webp
    alt: "Fiche du film Dune : Deuxième partie : bannière, affiche, réalisateur et durée, bouton de bande-annonce, synopsis, talon de billet avec la note et la date de visionnage, et photos de la distribution."
    caption: La fiche d'un film range les actions dans un talon de billet.
  - src: ../../assets/projets/seenit/fiche-personne.webp
    alt: "Fiche de Denis Villeneuve : portrait, biographie et filmographie, avec une rangée de perles indiquant 6 films vus sur 25 et 3 à voir, et les affiches de ses films marquées Vu ou À voir."
    caption: La filmographie d'un réalisateur montre ce que l'on en a déjà vu.
  - src: ../../assets/projets/seenit/calendrier.webp
    alt: "Calendrier de novembre 2026 : les affiches des films vus posées sur leurs jours, des séances prévues les 25 et 28, la sortie d'Astérix le 22, et à droite la liste des films à voir à glisser sur un jour."
    caption: Une affiche glissée sur un jour suffit à prévoir une séance.
  - src: ../../assets/projets/seenit/statistiques.webp
    alt: "Statistiques de l'année : une pellicule des mois de 2026 avec le nombre de séances de chacun, les six films vus en novembre, puis les chiffres de l'année, 41 séances, 91 h 10 de projection et une note moyenne de 4,3."
    caption: La pellicule des statistiques déroule l'année mois par mois.
---
