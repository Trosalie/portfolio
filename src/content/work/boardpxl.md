---
title: SportPXL Dashboard
level: university
publishDate: 2025-09-15 00:00:00
description: |
  Tableau de bord financier pour SportPXL, qui permet aux photographes et administrateurs de gérer les transactions, crédits et historiques financiers de manière centralisée.
tags:
  - Angular
  - Laravel
  - TypeScript
  - Docker
githubUrl: https://github.com/Trosalie/projetsportpxl
img: ../../assets/projets/sportpxl/couverture.webp
img_alt: "Liste des photographes du tableau de bord SportPXL, menu ouvert : pour chacun, le chiffre d'affaires, les crédits restants et le statut des factures. Les photographes sont fictifs."
img_mobile: ../../assets/projets/sportpxl/vignette-mobile.webp
gallery:
  - src: ../../assets/projets/sportpxl/graphique.webp
    alt: "Graphique général : courbe des ventes de crédits de juillet à septembre 2026, filtres à gauche, et totaux du chiffre d'affaires et des crédits vendus."
    caption: Le graphique général suit les ventes de crédits et le chiffre d'affaires.
  - src: ../../assets/projets/sportpxl/factures.webp
    alt: "Historique des factures d'un photographe : achats de crédits et versements de chiffre d'affaires, avec montant, crédits, statut Payée ou Non payée et échéance."
    caption: Chaque photographe a son historique de factures, filtrable par statut, type et période.
  - src: ../../assets/projets/sportpxl/releves.webp
    alt: "Liste des relevés d'encaissement de septembre 2026 : pour chaque photographe, le montant, la commission et l'acompte, avec un bouton de téléchargement."
    caption: Les relevés d'encaissement calculent la commission de SportPXL et l'acompte à verser.
period: 2025 – 2026
context: SAÉ de BUT Informatique
team: Équipe de 5
identity:
  frame:
    background: "#E8EAF6"
    border: "#0A2D44"
    titleColor: "#0A2D44"
    titleStyle: jost-caps
intro: |
  SportPXL Dashboard est une application web fullstack conçue pour centraliser la gestion des flux financiers de la plateforme SportPXL. Elle offre aux photographes et aux administrateurs un espace dédié pour suivre leurs transactions, gérer leurs crédits et consulter leur historique financier de manière claire et efficace.
features:
  - Gestion centralisée des factures et transactions
  - Suivi des crédits photographes en temps réel
  - title: Intégration de services externes
    description: Stripe pour les paiements, Pennylane pour la comptabilité et ForestAdmin pour l'administration.
  - title: Tableau de bord adapté aux rôles
    description: Vues distinctes pour les photographes et pour les administrateurs.
  - title: Historique complet des flux financiers
stack:
  - layer: Frontend
    items: [Angular, TypeScript]
  - layer: Backend
    items: [Laravel (PHP)]
  - layer: Base de données
    items: [MySQL]
  - layer: Infra
    items: [Docker, Docker Compose]
  - layer: CI/CD
    items: [GitHub Actions]
role: |
  Projet de BUT Informatique mené à cinq pour SportPXL, qui nous a confié le sujet. Nous avons pris en charge tout le reste : le recueil des besoins, les cahiers des charges fonctionnel et technique, les maquettes, le développement et la livraison finale.

  Chaque membre de l'équipe tenait un rôle Scrum : j'ai été Scrum Master, en plus de développer.
---
