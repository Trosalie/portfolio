---
title: ChronoPotes
publishDate: 2026-11-20 00:00:00
description: |
  A daily web game about timing, rebuilt from scratch: stop a timer blind, as close as possible to a target. One shared challenge a day, duels between friends, groups, and an installable app.
tags:
  - React
  - TypeScript
  - Supabase
  - PostgreSQL
  - PWA
demoUrl: https://www.chronopotes.fr
gradient: "linear-gradient(135deg, #F5C518 0%, #101216 100%)"
img: ../../assets/projets/chronopotes/couverture.webp
img_alt: "Three ChronoPotes screens side by side: the home screen with the daily challenge and the five Free Play modes, the result of a Classic game rated Masterclass, and the summary of a Survival game."
period: June – November 2026
context: Personal project, live
team: Solo
intro: |
  ChronoPotes is a daily game that trains your sense of time: stop a timer blind, as close as you can to a target duration. Every day, the server draws the same challenge for every player, with a single attempt. A first version has been live since the summer; in November, I rebuilt it from scratch, with a new visual identity inspired by railway departure boards, a new game engine, a new database, and redesigned social features. The game is open to everyone at chronopotes.fr and installs on a phone like an app.
features:
  - title: A daily challenge, even without an account
    description: A target drawn by the server, the same for everyone on Paris time, never in the same mode two days in a row. You can play it without an account; an account adds the leaderboard and the streak.
    icon: trophy
  - title: Five game modes
    description: Classic, blind Estimation, Multi-Target, Cadence, and Survival, where a time bank wears down round after round, with combos and random incidents.
    icon: strategy
  - title: A result you read at a glance
    description: Flaps that flip like a departure board, a sound synthesised with Web Audio, and a clock-shaped target where each gap lands like a dart.
    icon: pencil-line
  - title: Duels and group challenges
    description: An asynchronous duel in three attempts, started from a link or from your friends list, the record of every rivalry, and challenges open to a whole group with their own honours board.
    icon: paper-plane-tilt
  - title: Friends and groups
    description: Friends added by username, groups joined with a code or a link, and leaderboards filtered to these circles.
    icon: list
  - title: Installable app and notifications
    description: A PWA whose Free Play works offline, an installation guide for iPhone, and Web Push notifications that can be switched off type by type and stay silent at night.
    icon: rocket-launch
  - title: Administration back office
    description: Access protected by a one-time code, the calendar of upcoming challenges, each player's record and data export, suspensions, announcements, and an information banner, with every action written to an audit log.
    icon: terminal-window
  - title: The golden rule of the timer
    description: While a timer runs, nothing moves on screen and no network call goes out, so the player gets no cue at all. An end-to-end test checks that the page stays identical between GO and the tap.
    icon: code
stack:
  - layer: Frontend
    items: [React 19, strict TypeScript, Vite, React Router, CSS Modules]
  - layer: Backend
    items: [Supabase, PostgreSQL, Row Level Security, Edge Functions, Realtime, pg_cron]
  - layer: PWA
    items: [Workbox, Web Push]
  - layer: Testing
    items: [Vitest, Testing Library, Playwright, pgTAP]
  - layer: Hosting
    items: [Vercel]
role: |
  A personal project I carried out alone, from design to release. The first version worked, but its code was hard to evolve, challenge generation let errors through, and the interface lacked personality. Rather than patching it, I rebuilt it as a series of sub-projects, each delivered with its own specification, plan, and tests, and validated on preview deployments before the domain was switched over.

  The game engine is plain TypeScript, with no React and no clock: each mode is a state machine, tested with injected timestamps and an injected random generator. The same copy of the engine runs in the Edge Functions, which recompute every score on the server. On the database side, one rule drives everything: the server alone decides. It comes from the audit of the first version, which had uncovered writes that bypassed validation. Access rights, limits, suspensions, and administration are enforced in PostgreSQL and covered by pgTAP tests, so a direct call to the API gets around none of them.
gallery:
  - src: ../../assets/projets/chronopotes/accueil.webp
    alt: "ChronoPotes home screen on a phone: daily challenge no. 16 in Cadence mode, its 0.69 s interval on yellow flaps and the Play the challenge button, followed by the list of the five Free Play modes and the navigation bar."
    caption: "The home screen leads with the daily challenge, playable without an account, above the five Free Play modes."
  - src: ../../assets/projets/chronopotes/classique-resultat.webp
    alt: "Result of a Classic game: a station clock with the dart in the green centre zone, a target of 12.23 s, an arrival at 12.30 s, and the banner On time, Masterclass, +0.07 s."
    caption: "Every gap shows on the clock: early to the left, late to the right, Masterclass in the centre."
  - src: ../../assets/projets/chronopotes/multi-resultat.webp
    alt: "Result of a Multi-Target game: three numbered darts on the clock, an average gap of 0.29 s rated On schedule, and a table of the three stops with the target, the actual time, and a gap coloured by level."
    caption: "In Multi-Target, one dart per stop and the detail of each gap."
  - src: ../../assets/projets/chronopotes/survie-resultat.webp
    alt: "Summary of a Survival game: 998 points over 8 rounds, time bank used up, one dart per round on the clock, the best and worst gaps, then the table of rounds with target, actual time, gap, and points."
    caption: "Survival ends when the time bank runs out; the summary goes back over every round."
  - src: ../../assets/projets/chronopotes/regles.webp
    alt: "Rules of the Classic mode shown over the game screen: the three steps of a game, then the scale of levels, from On time under a 0.15 s gap to Cancelled beyond one second."
    caption: "The rules open before the first game of each mode, along with the scale of levels."
---
