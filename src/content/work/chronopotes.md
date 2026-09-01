---
title: ChronoPotes
publishDate: 2026-08-18 00:00:00
description: |
  Jeu web quotidien où l'on entraîne sa perception du temps : arrêter un chronomètre au plus près d'une durée cible. Un défi commun à tous les joueurs chaque jour, des classements, des duels et des groupes privés.
tags:
  - React
  - Supabase
  - PostgreSQL
  - Tailwind CSS
  - Capacitor
demoUrl: https://www.chronopotes.fr
gradient: "linear-gradient(135deg, #00d4b4 0%, #1e1b4b 100%)"
img: ../../assets/projets/chronopotes/couverture.webp
img_alt: "Trois ecrans de ChronoPotes cote a cote : le menu des cinq modes de jeu, l'ecran de lancement affichant un temps cible de 8,65 s, et l'ecran de resultat annoncant un ecart de +0,03 s note MASTERCLASS."
period: "2026"
context: Projet personnel
team: Seul
intro: |
  ChronoPotes est un jeu quotidien qui entraîne le sens du temps. Chaque jour, une même durée cible est tirée pour tout le monde : il faut arrêter le chronomètre au plus près, en une seule tentative. Le reste du jeu est construit autour de cette contrainte : un classement du jour, une série à ne pas casser, des duels lancés à un ami par un simple lien et des groupes privés pour ne se comparer qu'à ses proches. Le jeu est en ligne et ouvert à tous.
features:
  - title: Un défi quotidien, une seule tentative
    description: La même durée cible pour tous les joueurs, une série qui se construit jour après jour et des jokers gagnés en jouant pour survivre à un oubli.
    icon: trophy
  - title: Cinq modes de jeu
    description: Classique, Estimation à l'aveugle, Multi-Cible, Cadence à reproduire et Survie avec banque de temps.
    icon: strategy
  - title: Duels asynchrones entre amis
    description: Un duel se lance par un lien partagé ; l'adversaire joue quand il veut, dans des conditions identiques, et l'onglet Rivalités tient le bilan des face-à-face.
    icon: paper-plane-tilt
  - title: Groupes privés
    description: Un code d'invitation crée un classement fermé, pour se mesurer à ses proches plutôt qu'au monde entier.
  - title: Classements multiples
    description: Du jour, général, hebdomadaire et survie, avec la tendance de rang par rapport à la veille.
    icon: list
  - title: Trophées et carte de partage
    description: Des succès à paliers, dont quelques-uns cachés, et une image de résultat générée en canvas pour partager sa performance.
  - title: Back-office complet
    description: Calendrier des défis à venir, configuration du jeu, gestion des joueurs et des groupes, et mode maintenance.
    icon: terminal-window
  - title: Application Android
    description: Le même code empaqueté en application native via Capacitor.
    icon: rocket-launch
stack:
  - layer: Frontend
    items: [React 19, Vite, React Router, Tailwind CSS]
  - layer: Backend
    items: [Supabase, PostgreSQL, Row Level Security, Edge Functions]
  - layer: Tests
    items: [Vitest, Testing Library]
  - layer: Mobile
    items: [Capacitor (Android)]
  - layer: Déploiement
    items: [Vercel]
role: |
  Projet personnel mené seul, du jeu lui-même jusqu'à la mise en ligne. La partie la plus instructive n'a pas été le jeu mais la base : les scores étant classants, tout ce qui les produit vit côté serveur. J'ai mené un audit de l'intégration entre l'application et la base, qui a mis au jour des écritures directes contournant les fonctions de validation, des accès concurrents capables de fausser un duel ou une série, et des données de joueurs privés lisibles via l'API. Les règles d'accès ont été refermées, les compteurs rendus atomiques et le calcul des écarts déplacé côté serveur.
gallery:
  - src: ../../assets/projets/chronopotes/modes.webp
    alt: "Ecran Jeu Libre de ChronoPotes : cinq cartes de mode (Chrono Classique, Estimation, Multi-Cible, Cadence et Survie), chacune avec sa description en une ligne."
    caption: Les cinq modes du jeu libre, chacun avec sa propre regle de precision.
  - src: ../../assets/projets/chronopotes/temps-cible.webp
    alt: "Ecran de lancement d'une partie : le mode Chrono Classique, un temps cible de 8,65 s affiche en tres grand, et un bouton Demarrer."
    caption: "Le temps cible s'affiche avant le depart : c'est la seule information dont dispose le joueur."
  - src: ../../assets/projets/chronopotes/resultat.webp
    alt: "Ecran de resultat : temps cible 8,65 s, temps du joueur 8,68 s, ecart de +0,03 s note MASTERCLASS, suivi des boutons Partager et Rejouer."
    caption: Le resultat compare la cible au temps reel et attribue une note selon l'ecart.
  - src: ../../assets/projets/chronopotes/regles.webp
    alt: "Modale des regles du jeu, onglet Classique : les trois etapes d'une partie, puis l'echelle de precision qui associe chaque palier d'ecart a une note, de MASTERCLASS a moins de 0,15 s jusqu'a Encore un effort au-dela d'une seconde."
    caption: "L'echelle de precision est commune a tous les modes : un ecart, un palier, une note."
---
