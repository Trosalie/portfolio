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
---

## About the project

**Multi-Channel Chat Project** is a network application in C implementing a command-line messaging system. The architecture is based on a main server, connected clients, and dynamic channel management to separate conversations.

## Key features

- Client/server communication over TCP sockets
- Parallel multi-client handling with **pthread**
- Dynamic channel creation and selection at connection time
- Per-channel message history
- Client exit command (`quit` or `Ctrl+D`)

## Tech stack

| Layer         | Technology                  |
|---------------|-----------------------------|
| Language      | C                           |
| Networking    | TCP sockets (POSIX)         |
| Concurrency   | POSIX threads (`pthread`)   |
| Build         | GCC                         |

## My role

Designed and developed a small C client/server system: server structure, concurrent connection handling, channel logic, and local execution testing.