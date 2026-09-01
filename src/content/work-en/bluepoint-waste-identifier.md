---
title: BluePoint WasteIdentifier
publishDate: 2026-08-01 00:00:00
description: |
  Desktop application for real-time waste identification on a conveyor belt. It combines an industrial camera, a YOLO model, and a hyperspectral camera to recognise each object's material, then drives the sorting actuators.
tags:
  - Python
  - PyQt6
  - YOLO
  - TensorRT
  - Modbus TCP
gradient: "linear-gradient(135deg, #0d9488 0%, #1d4ed8 100%)"
img: ../../assets/projets/bluepoint/flux-detection.webp
img_alt: "BluePoint WasteIdentifier main window: a plastic container tracked by an oriented box on the conveyor feed, the list of classified objects, and the spectral curve of the identified material."
period: April – August 2026
context: End-of-degree internship at Compositadour
team: Sole developer on the application
intro: |
  BluePoint WasteIdentifier identifies waste travelling along a sorting conveyor, in real time. Two acquisition chains run in parallel: an industrial RGB camera, where a YOLO model detects and tracks every object, and a hyperspectral camera, whose spectrum reveals the material: PET, HDPE, cardboard. A queue reconciles the two: by the end of the belt, each tracked object finally carries its material name, and the application drives the actuator that ejects it into the right bin.
features:
  - title: Real-time detection and tracking
    description: Oriented-bounding-box YOLO model with ByteTrack tracking on a Basler industrial camera feed, running on GPU through TensorRT.
    icon: terminal-window
  - title: Material recognition through hyperspectral imaging
    description: Each object's spectrum is segmented then classified by a scikit-learn model, regardless of its colour or its label.
    icon: strategy
  - title: Bridging the two chains
    description: A FIFO queue synchronises the object seen by the colour camera with the material read by the hyperspectral sensor, despite their different frame rates and fields of view.
    icon: list
  - title: Actuator control over Modbus TCP
    description: Conveyor, air jets, and sorting arm are driven from the application as soon as an object crosses the end line.
    icon: rocket-launch
  - title: Guided calibration wizards
    description: Intrinsic camera calibration and world-frame placement in a few steps, with field coverage checks, reprojection error, and a comparison against the previous calibration.
    icon: trophy
  - title: Startup profiles and simulated modes
    description: "The industrial rig is not always available: every device has a mock mode, and a profile replays a full session with no hardware attached."
    icon: pencil-line
  - title: Built-in performance measurement
    description: Dedicated benchmark window and live metrics (acquisition rate, processing latency, GPU load).
  - title: Tooled-up quality
    description: Strict MVC architecture, Qt threads and a zero-copy circular frame buffer, pytest suite with coverage, and Sphinx documentation.
    icon: code
stack:
  - layer: Interface
    items: [PyQt6, pytest-qt]
  - layer: Vision
    items: [Ultralytics YOLO, TensorRT, ONNX Runtime, OpenCV, PyTorch]
  - layer: Data
    items: [NumPy, Pandas, Polars, scikit-learn, scikit-image]
  - layer: Hardware
    items: [pypylon (Basler), Pleora eBUS (Specim), pyModbusTCP]
  - layer: Quality
    items: [pytest, coverage, Allure, Sphinx]
role: |
  End-of-degree internship at Compositadour. I wrote the entire application (MVC architecture, vision pipeline, calibration wizards, PyQt6 interface, and actuator communication), apart from the Sensorhub module, built by another developer and which I integrated into my application. The assignment pushed me into territory that was new to me: real-time processing, Qt threading, camera calibration, and industrial controllers.
gallery:
  - src: ../../assets/projets/bluepoint/flux-detection.webp
    alt: The application's main window, showing a plastic container framed by a blue oriented box labelled "ID 3, class trash, 88%" on the conveyor feed, with the list of objects classified as PET and the reflectance curve of the material on the right.
    caption: "The annotated live feed: tracked object, detection zone, end line, and the spectrum of the identified material."
  - src: ../../assets/projets/bluepoint/repere-monde-marqueur.webp
    alt: "World-frame calibration dialog, step 1 of 3: choice of marker type, ArUco dictionary and size, with a preview of the marker to print."
    caption: The world-frame wizard generates the marker to print and asks for the measured size back once it is on paper.
  - src: ../../assets/projets/bluepoint/repere-monde-detection.webp
    alt: Step 2 of 3 of the world-frame calibration. A ChArUco board lies on the conveyor, its corners detected in green and the frame axes drawn on one corner.
    caption: "The detected board sets the frame origin on the conveyor plane: positions move from pixels to millimetres."
  - src: ../../assets/projets/bluepoint/calibration-couverture.webp
    alt: Step 3 of 4 of the camera calibration. The board is held in front of the lens, with a field-coverage grid shaded green and the list of the twenty-five captures kept.
    caption: The coverage grid shows where the board is still missing, instead of leaving you to guess when enough shots have been taken.
  - src: ../../assets/projets/bluepoint/calibration-validation.webp
    alt: "Step 4 of 4 of the camera calibration: RMS reprojection error of 0.346 pixel, resulting intrinsic parameters, and a comparison table against the previous calibration."
    caption: "The new calibration is compared with the old one before being accepted: a regression shows up here rather than in production."
---
