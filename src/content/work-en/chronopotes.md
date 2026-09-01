---
title: ChronoPotes
publishDate: 2026-08-18 00:00:00
description: |
  A daily web game that trains your sense of time: stop a timer as close as possible to a target duration. One shared challenge a day, leaderboards, duels, and private groups.
tags:
  - React
  - Supabase
  - PostgreSQL
  - Tailwind CSS
  - Capacitor
demoUrl: https://www.chronopotes.fr
gradient: "linear-gradient(135deg, #00d4b4 0%, #1e1b4b 100%)"
img: ../../assets/projets/chronopotes/couverture.webp
img_alt: "Three ChronoPotes screens side by side: the five-mode menu, the launch screen showing a target time of 8.65 s, and the result screen announcing a gap of +0.03 s rated MASTERCLASS."
period: "2026"
context: Personal project
team: Solo
intro: |
  ChronoPotes is a daily game that trains your sense of time. Every day, the same target duration is drawn for everyone: you have to stop the timer as close to it as you can, in a single attempt. The rest of the game is built around that constraint: a daily leaderboard, a streak you would rather not break, duels sent to a friend through a plain link, and private groups so you only compare yourself to the people you know. The game is live and open to everyone.
features:
  - title: One daily challenge, one attempt
    description: The same target duration for every player, a streak built day after day, and jokers earned through play to survive a missed day.
    icon: trophy
  - title: Five game modes
    description: Classic, blind Estimation, Multi-Target, Cadence to reproduce, and Survival with a time bank.
    icon: strategy
  - title: Asynchronous duels between friends
    description: A duel starts from a shared link; your opponent plays whenever they want under identical conditions, and the Rivalries tab keeps the head-to-head record.
    icon: paper-plane-tilt
  - title: Private groups
    description: An invite code creates a closed leaderboard, to measure yourself against friends rather than the whole world.
  - title: Multiple leaderboards
    description: Daily, all-time, weekly, and survival, with the rank trend compared to the day before.
    icon: list
  - title: Achievements and share card
    description: Tiered achievements, a few of them hidden, and a canvas-generated result image to share a performance.
  - title: Full back-office
    description: Calendar of upcoming challenges, game configuration, player and group management, and a maintenance mode.
    icon: terminal-window
  - title: Android application
    description: The same codebase packaged as a native app through Capacitor.
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
  - layer: Deployment
    items: [Vercel]
role: |
  A personal project carried out alone, from the game itself through to going live. The most instructive part was not the game but the database: since scores are ranked, everything that produces them belongs on the server. I ran an audit of the integration between the app and the database, which surfaced direct writes bypassing the validation functions, concurrent accesses able to corrupt a duel or a streak, and private players' data readable through the API. Access rules were closed down, counters made atomic, and score-gap computation moved server-side.
gallery:
  - src: ../../assets/projets/chronopotes/modes.webp
    alt: "ChronoPotes free-play screen: five mode cards (Chrono Classique, Estimation, Multi-Cible, Cadence and Survie), each with a one-line description."
    caption: The five free-play modes, each with its own precision rule.
  - src: ../../assets/projets/chronopotes/temps-cible.webp
    alt: "Game launch screen: Chrono Classique mode, a target time of 8.65 s shown very large, and a Start button."
    caption: "The target time appears before the start: it is the only information the player gets."
  - src: ../../assets/projets/chronopotes/resultat.webp
    alt: "Result screen: target time 8.65 s, player time 8.68 s, a gap of +0.03 s rated MASTERCLASS, followed by Share and Replay buttons."
    caption: The result compares the target with the actual time and grades it by the gap.
  - src: ../../assets/projets/chronopotes/regles.webp
    alt: "Game rules modal, Classic tab: the three steps of a round, then the precision scale mapping each gap band to a grade, from MASTERCLASS under 0.15 s down to Keep trying beyond one second."
    caption: "The precision scale is shared by every mode: one gap, one band, one grade."
---
