---
title: SportPXL Dashboard
publishDate: 2025-09-15 00:00:00
description: |
  Financial dashboard for SportPXL that lets photographers and admins manage transactions, credits, and financial history from a single centralised interface.
tags:
  - Angular
  - Laravel
  - TypeScript
  - Docker
githubUrl: https://github.com/Trosalie/projetsportpxl
img: ../../assets/projets/sportpxl/couverture.webp
img_alt: "SportPXL dashboard photographer list with the menu open: revenue, remaining credits and invoice status for each. The photographers are fictional."
img_mobile: ../../assets/projets/sportpxl/vignette-mobile.webp
gallery:
  - src: ../../assets/projets/sportpxl/graphique.webp
    alt: "General chart: credit sales from July to September 2026, filters on the left, and totals for revenue and credits sold."
    caption: The general chart tracks credit sales and revenue.
  - src: ../../assets/projets/sportpxl/factures.webp
    alt: "A photographer's invoice history: credit purchases and revenue payouts, with amount, credits, Paid or Unpaid status and due date."
    caption: Each photographer has an invoice history, filterable by status, type and period.
  - src: ../../assets/projets/sportpxl/releves.webp
    alt: "September 2026 settlement statements: amount, commission and advance for each photographer, with a download button."
    caption: Settlement statements work out SportPXL's commission and the advance to pay out.
period: 2025 – 2026
context: SAÉ project, BUT Computer Science
team: Team of 5
identity:
  frame:
    background: "#E8EAF6"
    border: "#0A2D44"
    titleColor: "#0A2D44"
    titleStyle: jost-caps
intro: |
  SportPXL Dashboard is a full-stack web application built to centralise financial flow management for the SportPXL platform. It gives photographers and administrators a dedicated space to track transactions, manage credits, and review their financial history clearly and efficiently.
features:
  - Centralised invoice and transaction management
  - Real-time photographer credit tracking
  - title: External service integration
    description: Stripe for payments, Pennylane for accounting, and ForestAdmin for administration.
  - title: Role-aware dashboard
    description: Separate views for photographers and for administrators.
  - title: Complete financial history
stack:
  - layer: Frontend
    items: [Angular, TypeScript]
  - layer: Backend
    items: [Laravel (PHP)]
  - layer: Database
    items: [MySQL]
  - layer: Infra
    items: [Docker, Docker Compose]
  - layer: CI/CD
    items: [GitHub Actions]
role: |
  A five-person BUT Computer Science project for SportPXL, who gave us the brief. We handled everything else: gathering requirements, writing the functional and technical specifications, designing the mockups, building the dashboard and delivering the final version.

  Each team member held a Scrum role: I was Scrum Master, as well as a developer.
---
