---
title: Covoit'Etud
publishDate: 2024-10-08 00:00:00
description: |
  Responsive carpooling web app for students that lets them propose or join rides, manage driver profiles, and cut travel costs.
tags:
  - PHP
  - Twig
  - Bootstrap
  - MySQL
githubUrl: https://github.com/kevin-oulai/COVOIT-ETUD
img: ../../assets/projets/covoit-etud/couverture.webp
img_alt: "Covoit'Etud search results: three trips between Biarritz and Anglet on 24 November, with times, seats left and price. The people and trips are fictional."
img_mobile: ../../assets/projets/covoit-etud/vignette-mobile.webp
gallery:
  - src: ../../assets/projets/covoit-etud/reservations.webp
    alt: "My bookings page: two booked trips, each with the driver's name, route, time, number of seats booked and price."
    caption: Passengers find their upcoming and past bookings.
  - src: ../../assets/projets/covoit-etud/mes-trajets.webp
    alt: "Your trips page: the two trips offered by the driver, each with Edit and Delete buttons, below an Add a trip button."
    caption: Drivers manage the trips they offer.
  - src: ../../assets/projets/covoit-etud/proposer.webp
    alt: "Save a trip form: departure and arrival fields on the left, an OpenStreetMap map of Biarritz and Anglet on the right."
    caption: The addresses entered are placed on the map before the trip is saved.
period: 2024 – 2025
context: SAÉ project, BUT Computer Science
team: Team of 5
identity:
  frame:
    background: "#ABC4FF"
    titleColor: "#31429A"
    titleStyle: site
intro: |
  Covoit'Etud is a full-stack carpooling web application designed for students. It makes it easy to connect drivers and passengers, with a system for managing rides, profiles, and ratings.
features:
  - title: Ride creation and search
    description: Departure and arrival location selection, filtering of available rides.
  - Seat reservation system (driver / passenger)
  - Student profile management with photo and vehicle details
  - title: Driver ratings and reviews
  - title: Interactive ride map
    description: Positions resolved through a geocoding API.
  - title: Badges and rewards
  - Privacy policy and password recovery
stack:
  - layer: Frontend
    items: [HTML, CSS, SCSS, Bootstrap]
  - layer: Templates
    items: [Twig]
  - layer: Backend
    items: [PHP]
  - layer: Database
    items: [MySQL]
  - layer: Docs
    items: [Doxygen]
role: |
  A five-person BUT Computer Science project, run end to end: our group came up with the idea, wrote the design and the specification, then built the final application.

  I was mainly a developer, working across every layer of the PHP application: models, controllers, Twig templates and styles.
---
