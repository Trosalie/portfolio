---
title: Projet Chat Multi-Channels
publishDate: 2026-03-19 00:00:00
description: |
  Application de chat client/serveur en C avec channels dynamiques, historique des messages et gestion multi-clients via threads POSIX.
tags:
  - C
  - Sockets
  - pthread
githubUrl: https://github.com/Trosalie/projetChat
gradient: "linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%)"
period: "2026"
context: Projet de cours en BUT Informatique
intro: |
  Projet Chat Multi-Channels est une application réseau en C qui implémente un système de messagerie en ligne de commande. L'architecture repose sur un serveur principal, des clients connectés et une gestion de channels dynamiques pour séparer les conversations.
features:
  - Connexion client/serveur via sockets TCP
  - title: Gestion de plusieurs clients en parallèle
    description: Un thread POSIX par client connecté.
    icon: code
  - Création et sélection de channels dynamiques à la connexion
  - title: Historique des messages par channel
    icon: list
  - title: Commande de sortie client
    description: Déconnexion propre via quit ou Ctrl+D.
    icon: terminal-window
stack:
  - layer: Langage
    items: [C]
  - layer: Réseau
    items: [Sockets TCP (POSIX)]
  - layer: Concurrence
    items: [Threads POSIX (pthread)]
  - layer: Build
    items: [GCC]
role: |
  Conception et développement d'un mini-système client/serveur en C : structuration du serveur, gestion des connexions concurrentes, logique de channels et tests d'exécution en local.
---
