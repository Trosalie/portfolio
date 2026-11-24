---
title: Seenit
level: featured
publishDate: 2026-11-19 00:00:00
description: |
  A local web app for keeping a film diary: a library laid out as a shelf, a watchlist, a screenings calendar, statistics, and recommendations powered by TMDb.
tags:
  - React
  - TypeScript
  - Node.js
  - SQLite
  - TMDb API
img: ../../assets/projets/seenit/couverture.webp
img_alt: "Seenit home screen: the Now Showing marquee lists three planned screenings, above the search field, the filters, and the start of the shelf of recent viewings."
img_mobile: ../../assets/projets/seenit/vignette-mobile.webp
period: November 2026
context: Personal project
team: Solo
identity:
  frame:
    background: "#2C1C0F"
    border: "#4D331E"
    titleColor: "#C5A059"
    titleStyle: playfair-italic
  palette:
    - { name: Wood, hex: "#2C1C0F" }
    - { name: Brass, hex: "#C5A059" }
    - { name: Velvet, hex: "#3A1214" }
    - { name: Ivory, hex: "#EFEBD9" }
  fonts:
    - { family: Playfair Display, role: Headings }
    - { family: DM Sans, role: Body text }
    - { family: DM Mono, role: Figures }
  specimen: seenit-ticket
intro: |
  Seenit is my film diary: every film watched, every rating, every planned screening. The interface borrows from an old movie theatre, with a wooden shelf, brass plaques, and film pages shaped like a ticket stub. TMDb data fills in each film, links it to its directors and cast, and suggests recommendations based on what I liked. The app runs on my own computer: a small Node server serves the interface, stores the library in SQLite, and starts with the Windows session.
features:
  - title: A shelf that sorts itself
    description: Watched films are filed by month of viewing, behind brass plaques, and sagas are grouped into box sets that open in place.
  - title: Film and person pages
    description: Synopsis, cast, trailer, and the platforms where the film can be watched in France; a director's or actor's page lays out their filmography and shows what I have already seen.
  - title: Recommendations
    description: The Discover tab combines the recommendations of well-rated films and of the watchlist, and sets aside whatever resembles poorly rated ones.
  - title: Screenings calendar
    description: Dragging a poster onto a day plans a screening, and upcoming releases of awaited films appear on their own.
  - title: Year in review
    description: A film strip unrolls the months of the year, with time spent watching, the average rating, and the most-watched directors.
  - title: What to watch tonight?
    description: A random draw from the watchlist, filtered by running time, genre, and the streaming platforms I subscribe to.
  - title: Keyboard navigation
    description: A Ctrl+K palette to jump to a film, a person, or a tab, shortcuts for every action, and a URL that follows the open page.
  - title: Installable app
    description: Seenit installs as an app in Chrome or Edge, with its own window, its icon, and shortcuts.
stack:
  - layer: Frontend
    items: [React 19, strict TypeScript, Vite]
  - layer: Server
    items: [Node.js 24, node:http, node:sqlite]
  - layer: Data
    items: [SQLite, TMDb API]
  - layer: Testing
    items: [Vitest, Playwright]
  - layer: Code quality
    items: [oxlint, Prettier]
role: |
  A personal project I carried out alone. The business logic lives apart from the interface, as tested pure functions: filters, statistics, recommendations, the calendar, and a reducer through which every change to the library goes.

  The library first lived in the browser. I moved it to a Node server with no dependencies at all, using node:sqlite and TypeScript run natively, so that every browser on the computer shares the same library. The server also relays calls to TMDb: the API key never reaches the code sent to the browser, and the build fails if anyone tries to expose it there. The data is versioned and migrated automatically, and the server keeps a copy of it every day. End-to-end tests run on a frozen date with TMDb mocked, so they depend on neither the day nor the network.
gallery:
  - src: ../../assets/projets/seenit/etagere.webp
    alt: "Seenit library shelf: under the November 2026 plaque, the posters of Mulholland Drive, Aftersun, The Zone of Interest, Perfect Days, and a two-film Dune box set, then the October row."
    caption: Watched films are filed by month of viewing, and sagas into box sets.
  - src: ../../assets/projets/seenit/fiche-film.webp
    alt: "Page of the film Dune: Part Two: banner, poster, director and running time, trailer button, synopsis, ticket stub with the rating and viewing date, and cast photos."
    caption: A film's page gathers its actions in a ticket stub.
  - src: ../../assets/projets/seenit/fiche-personne.webp
    alt: "Page of Denis Villeneuve: portrait, biography, and filmography, with a row of beads showing 6 films seen out of 25 and 3 on the watchlist, and the posters of his films marked Seen or To watch."
    caption: A director's filmography shows what you have already seen.
  - src: ../../assets/projets/seenit/calendrier.webp
    alt: "November 2026 calendar: the posters of watched films placed on their days, screenings planned on the 25th and 28th, the release of Asterix on the 22nd, and on the right the watchlist, ready to be dragged onto a day."
    caption: Dragging a poster onto a day is enough to plan a screening.
  - src: ../../assets/projets/seenit/statistiques.webp
    alt: "Year statistics: a film strip of the months of 2026 with the number of screenings in each, the six films watched in November, then the year's figures, 41 screenings, 91 h 10 of viewing, and an average rating of 4.3."
    caption: The statistics film strip unrolls the year month by month.
---
