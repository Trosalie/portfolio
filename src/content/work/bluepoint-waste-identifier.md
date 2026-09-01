---
title: BluePoint WasteIdentifier
publishDate: 2026-08-01 00:00:00
description: |
  Application desktop d'identification et de suivi de déchets en temps réel sur convoyeur réalisé dans le cadre du projet européen BluePoint. Elle croise une caméra industrielle, un modèle YOLO et une caméra hyperspectrale pour reconnaître la matière de chaque objet, pour transmettre des trames TCP pour chaque déchet.
tags:
  - Python
  - PyQt6
  - YOLO
  - TensorRT
  - Modbus TCP
gradient: "linear-gradient(135deg, #0d9488 0%, #1d4ed8 100%)"
img: ../../assets/projets/bluepoint/flux-detection.webp
img_alt: "Fenêtre principale de BluePoint WasteIdentifier : un bidon plastique suivi par une boîte orientée sur le flux du convoyeur, la liste des objets classés et la courbe spectrale de la matière identifiée."
period: Avril – août 2026
context: Stage de fin de BUT chez Compositadour
team: Seul sur l'application
intro: |
  BluePoint WasteIdentifier identifie les déchets qui défilent sur un convoyeur de tri, en temps réel. Deux chaînes d'acquisition tournent en parallèle : une caméra industrielle RGB, où un modèle YOLO détecte et suit chaque objet, et une caméra hyperspectrale, dont le spectre révèle la matière (PET, PETG, PE, ...). Une file d'attente réconcilie les deux : au bout du convoyeur, chaque objet suivi porte enfin le nom de sa matière, et l'application regroupe les données par déchet dans un JSON transmis par TCP.
features:
  - title: Détection et suivi temps réel
    description: Modèle YOLO à boîtes orientées et suivi ByteTrack sur le flux d'une caméra industrielle Basler, exécuté sur GPU via TensorRT.
    icon: terminal-window
  - title: Reconnaissance de matière par imagerie hyperspectrale
    description: Le spectre de chaque objet est segmenté puis classé par un modèle scikit-learn, indépendamment de sa couleur ou de son étiquette.
    icon: strategy
  - title: Association des deux chaînes
    description: Une file FIFO synchronise l'objet vu par la caméra couleur et la matière lue par le capteur hyperspectral, malgré leurs cadences et leurs champs de vue différents.
    icon: list
  - title: Pilotage des actionneurs en Modbus TCP
    description: Convoyeur, jets d'air et bras de tri.
    icon: rocket-launch
  - title: Assistants de calibration guidés
    description: Calibration intrinsèque de la caméra et pose du repère monde en quelques étapes, avec contrôle de couverture du champ, erreur de reprojection et comparaison à la calibration précédente.
    icon: trophy
  - title: Profils de démarrage et modes simulés
    description: "Le poste industriel n'est pas toujours disponible : chaque périphérique a un mode simulé, et un profil rejoue une session complète sans matériel."
    icon: pencil-line
  - title: Mesure de performance intégrée
    description: Fenêtre de benchmark dédiée et métriques temps réel (cadence d'acquisition, latence de traitement, charge GPU).
  - title: Qualité outillée
    description: Architecture MVC stricte, threads Qt et buffer circulaire zéro-copie, suite pytest avec couverture et documentation Sphinx.
    icon: code
stack:
  - layer: Interface
    items: [PyQt6, pytest-qt]
  - layer: Vision
    items: [Ultralytics YOLO, TensorRT, ONNX Runtime, OpenCV, PyTorch]
  - layer: Données
    items: [NumPy, Pandas, Polars, scikit-learn, scikit-image]
  - layer: Matériel
    items: [pypylon (Basler), Pleora eBUS (Specim), pyModbusTCP]
  - layer: Qualité
    items: [pytest, coverage, Allure, Sphinx]
role: |
  Stage de fin de BUT Informatique chez Compositadour. J'ai écrit l'intégralité de l'application (architecture MVC, chaîne de vision, assistants de calibration, interface PyQt6 et communication avec les actionneurs), à l'exception du module Sensorhub, développé par un autre développeur et que j'ai intégré à mon application. Le sujet m'a fait travailler des sujets neufs pour moi : temps réel, threads Qt, calibration de caméra et automates industriels.
gallery:
  - src: ../../assets/projets/bluepoint/flux-detection.webp
    alt: "Fenêtre principale de l'application : un bidon plastique entouré d'une boîte orientée bleue étiquetée « ID 3, classe trash, 88 % » sur le flux du convoyeur, à droite la liste des objets classés PET et la courbe de réflectance de la matière."
    caption: "Le flux annoté en temps réel : objet suivi, zone de détection, ligne de fin, et le spectre de la matière identifiée."
  - src: ../../assets/projets/bluepoint/repere-monde-marqueur.webp
    alt: "Dialogue de calibration du repère monde, étape 1 sur 3 : choix du type de marqueur, du dictionnaire ArUco et de la taille, avec l'aperçu du marqueur à imprimer."
    caption: L'assistant du repère monde génère le marqueur à imprimer et rappelle la taille mesurée à confirmer.
  - src: ../../assets/projets/bluepoint/repere-monde-detection.webp
    alt: Étape 2 sur 3 de la calibration du repère monde. Une mire ChArUco posée sur le convoyeur, ses coins détectés en vert et les axes du repère dessinés sur un coin.
    caption: "La mire détectée pose l'origine du repère sur le plan du convoyeur : les positions passent des pixels aux millimètres."
  - src: ../../assets/projets/bluepoint/calibration-couverture.webp
    alt: Étape 3 sur 4 de la calibration caméra. La mire est tenue à la main devant l'objectif, avec une grille de couverture du champ colorée en vert et la liste des vingt-cinq captures retenues.
    caption: La grille de couverture indique où la mire manque encore, plutôt que de laisser deviner quand la prise de vue est suffisante.
  - src: ../../assets/projets/bluepoint/calibration-validation.webp
    alt: "Étape 4 sur 4 de la calibration caméra : erreur de reprojection RMS de 0,346 pixel, paramètres intrinsèques obtenus et tableau de comparaison avec la calibration précédente."
    caption: "La nouvelle calibration est comparée à l'ancienne avant d'être acceptée : une régression se voit au lieu de se découvrir en production."
---
