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
---

## A propos du projet

**Projet Chat Multi-Channels** est une application reseau en C qui implemente un systeme de messagerie en ligne de commande. L'architecture repose sur un serveur principal, des clients connectes et une gestion de channels dynamiques pour separer les conversations.

## Fonctionnalites principales

- Connexion client/serveur via sockets TCP
- Gestion de plusieurs clients en parallele avec **pthread**
- Creation et selection de channels dynamiques a la connexion
- Historique des messages par channel
- Commande de sortie client (`quit` ou `Ctrl+D`)

## Stack technique

| Couche        | Technologie                 |
|---------------|-----------------------------|
| Langage       | C                           |
| Reseau        | Sockets TCP (POSIX)         |
| Concurrence   | Threads POSIX (`pthread`)   |
| Build         | GCC                         |

## Mon role

Conception et developpement d'un mini-systeme client/serveur en C : structuration du serveur, gestion des connexions concurrentes, logique de channels et tests d'execution en local.