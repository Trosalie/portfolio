---
title: Multi-Channel Chat Project
publishDate: 2026-03-19 00:00:00
description: |
  Client/server chat application in C with dynamic channels, message history, and multi-client handling through POSIX threads.
tags:
  - C
  - Sockets
  - pthread
githubUrl: https://github.com/Trosalie/projetChat
img: ../../assets/projets/projet-chat/couverture.webp
img_alt: "Three terminals during a real chat session: the server logs connections and messages on the general channel, lea chats with hugo, and ines, on arrival, receives the history of the five previous messages."
period: "2026"
context: Coursework, BUT Computer Science
identity:
  frame:
    background: "#17181C"
    border: "#3C3F47"
    titleColor: "#81B07A"
    titleStyle: dm-mono
intro: |
  Multi-Channel Chat Project is a network application in C implementing a command-line messaging system. The architecture is based on a main server, connected clients, and dynamic channel management to separate conversations.
features:
  - Client/server communication over TCP sockets
  - title: Parallel multi-client handling
    description: One POSIX thread per connected client.
  - Dynamic channel creation and selection at connection time
  - title: Per-channel message history
  - title: Client exit command
    description: Clean disconnection through quit or Ctrl+D.
stack:
  - layer: Language
    items: [C]
  - layer: Networking
    items: [TCP sockets (POSIX)]
  - layer: Concurrency
    items: [POSIX threads (pthread)]
  - layer: Build
    items: [GCC]
role: |
  Designed and developed a small C client/server system: server structure, concurrent connection handling, channel logic, and local execution testing.
---
