---
title: ChronoPotes
publishDate: 2026-11-20 00:00:00
description: |
  Jeu web quotidien de précision temporelle, reconstruit de zéro : arrêter un chronomètre à l'aveugle au plus près d'une cible. Un défi commun chaque jour, des duels entre amis, des groupes et une application installable.
tags:
  - React
  - TypeScript
  - Supabase
  - PostgreSQL
  - PWA
demoUrl: https://www.chronopotes.fr
gradient: "linear-gradient(135deg, #F5C518 0%, #101216 100%)"
img: ../../assets/projets/chronopotes/couverture.webp
img_alt: "Trois écrans de ChronoPotes côte à côte : l'accueil avec le défi du jour et les cinq modes du Jeu libre, le résultat d'une partie de Classique notée Masterclass, et le bilan d'une partie de Survie."
period: Juin – novembre 2026
context: Projet personnel, en ligne
team: Seul
intro: |
  ChronoPotes est un jeu quotidien qui entraîne le sens du temps : arrêter un chronomètre à l'aveugle, au plus près d'une durée cible. Chaque jour, le serveur tire le même défi pour tous les joueurs, à jouer en un seul essai. Une première version est en ligne depuis l'été ; en novembre, je l'ai reconstruite de zéro, avec une nouvelle charte inspirée des tableaux de gare, un nouveau moteur de jeu, une nouvelle base et des fonctions sociales repensées. Le jeu est ouvert à tous sur chronopotes.fr et s'installe sur téléphone comme une application.
features:
  - title: Défi du jour, même sans compte
    description: Une cible tirée par le serveur, la même pour tous à l'heure de Paris, jamais dans le même mode deux jours de suite. On le joue sans compte ; le compte ajoute le classement et la série.
    icon: trophy
  - title: Cinq modes de jeu
    description: Classique, Estimation à l'aveugle, Multi-cible, Cadence, et Survie, où un capital de temps s'use au fil des manches, avec combos et incidents aléatoires.
    icon: strategy
  - title: Un résultat lisible d'un coup d'œil
    description: Des palettes qui se retournent comme sur un tableau de gare, un son synthétisé en Web Audio et une horloge-cible où chaque écart se plante comme une fléchette.
    icon: pencil-line
  - title: Duels et défis de groupe
    description: Un duel asynchrone en trois tentatives, lancé par lien ou depuis ses amis, le bilan de chaque rivalité, et des défis ouverts à tout un groupe avec leur palmarès.
    icon: paper-plane-tilt
  - title: Amis et groupes
    description: Des amis ajoutés par pseudo, des groupes rejoints par code ou par lien, et des classements filtrés sur ces cercles.
    icon: list
  - title: Application installable et notifications
    description: Une PWA qui se joue sans réseau en Jeu libre, un guide d'installation sur iPhone, et des notifications Web Push réglables type par type et muettes la nuit.
    icon: rocket-launch
  - title: Back-office d'administration
    description: Un accès protégé par un code à usage unique, le calendrier des défis à venir, la fiche et l'export des données d'un joueur, les suspensions, les annonces et un bandeau d'information, chaque action notée au journal.
    icon: terminal-window
  - title: La règle d'or du chrono
    description: Pendant qu'un chrono court, rien ne bouge à l'écran et aucun appel réseau ne part, pour ne donner aucun repère au joueur. Un test de bout en bout vérifie que la page reste identique entre le GO et le clic.
    icon: code
stack:
  - layer: Frontend
    items: [React 19, TypeScript strict, Vite, React Router, CSS Modules]
  - layer: Backend
    items: [Supabase, PostgreSQL, Row Level Security, Edge Functions, Realtime, pg_cron]
  - layer: PWA
    items: [Workbox, Web Push]
  - layer: Tests
    items: [Vitest, Testing Library, Playwright, pgTAP]
  - layer: Hébergement
    items: [Vercel]
role: |
  Projet personnel mené seul, de la conception à la mise en ligne. La première version fonctionnait, mais son code se prêtait mal aux évolutions, la génération des défis laissait passer des erreurs et l'interface manquait de personnalité. Plutôt que de la rapiécer, je l'ai reconstruite en sous-projets, chacun livré avec sa spécification, son plan et ses tests, et validé sur des adresses de prévisualisation avant la bascule du domaine.

  Le moteur de jeu est du TypeScript pur, sans React ni horloge : chaque mode est une machine à états, testée avec des instants et un tirage aléatoire injectés. La même copie du moteur tourne dans les Edge Functions, qui recalculent chaque score côté serveur. Côté base, une règle guide tout : le serveur seul décide. Elle vient de l'audit de la première version, qui avait révélé des écritures contournant la validation. Droits d'accès, limites, suspensions et administration sont vérifiés dans PostgreSQL et couverts par des tests pgTAP, si bien qu'un appel direct à l'API ne contourne rien.
gallery:
  - src: ../../assets/projets/chronopotes/accueil.webp
    alt: "Accueil de ChronoPotes sur téléphone : le défi du jour n°16 en mode Cadence, son intervalle de 0,69 s sur des palettes jaunes et le bouton Jouer le défi, puis la liste des cinq modes du Jeu libre et la barre de navigation."
    caption: "L'accueil met en tête le défi du jour, jouable sans compte, au-dessus des cinq modes du Jeu libre."
  - src: ../../assets/projets/chronopotes/classique-resultat.webp
    alt: "Résultat d'une partie de Classique : une horloge de gare dont la fléchette est plantée dans la zone verte du centre, une cible de 12,23 s, une arrivée à 12,30 s et le bandeau À l'heure, Masterclass, +0,07 s."
    caption: "Chaque écart se lit sur l'horloge : l'avance à gauche, le retard à droite, la Masterclass au centre."
  - src: ../../assets/projets/chronopotes/multi-resultat.webp
    alt: "Résultat d'une partie de Multi-cible : trois fléchettes numérotées sur l'horloge, un écart moyen de 0,29 s noté Dans les temps, et le tableau des trois arrêts avec la cible, le temps réalisé et l'écart coloré selon son niveau."
    caption: "En Multi-cible, une fléchette par arrêt et le détail de chaque écart."
  - src: ../../assets/projets/chronopotes/survie-resultat.webp
    alt: "Bilan d'une partie de Survie : 998 points en 8 manches, capital épuisé, une fléchette par manche sur l'horloge, le meilleur et le pire écart, puis le tableau des manches avec cible, temps réalisé, écart et points."
    caption: "La Survie s'arrête quand le capital de temps est épuisé ; le bilan retrace chaque manche."
  - src: ../../assets/projets/chronopotes/regles.webp
    alt: "Règles du mode Classique affichées par-dessus l'écran de jeu : les trois étapes d'une partie, puis l'échelle des niveaux, de À l'heure sous 0,15 s d'écart jusqu'à Supprimé au-delà d'une seconde."
    caption: "Les règles s'ouvrent avant la première partie de chaque mode, avec l'échelle des niveaux."
---
