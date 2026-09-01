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
gradient: "linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%)"
period: "2026"
context: Coursework, BUT Computer Science
intro: |
  Multi-Channel Chat Project is a network application in C implementing a command-line messaging system. The architecture is based on a main server, connected clients, and dynamic channel management to separate conversations.
features:
  - Client/server communication over TCP sockets
  - title: Parallel multi-client handling
    description: One POSIX thread per connected client.
    icon: code
  - Dynamic channel creation and selection at connection time
  - title: Per-channel message history
    icon: list
  - title: Client exit command
    description: Clean disconnection through quit or Ctrl+D.
    icon: terminal-window
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
