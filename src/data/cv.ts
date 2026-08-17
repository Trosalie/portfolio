/**
 * Contenu rédigé du CV, une version par langue.
 *
 * Ce fichier est la source unique : les quatre pages (`/cv/`, `/en/cv/`,
 * `/cv-print/`, `/en/cv-print/`) rendent toutes le même composant
 * `CvDocument.astro` alimenté par ces données. Auparavant le contenu existait
 * en cinq exemplaires, qui avaient déjà divergé en une douzaine d'endroits.
 * Voir docs/AMELIORATIONS.md (P2).
 *
 * Le typage en `Record<Lang, CvData>` est volontaire : oublier une section ou
 * un champ dans une langue devient une erreur de compilation attrapée par
 * `npm run check`, et non un défaut découvert en production.
 */

import type { Lang } from '../i18n/ui';

/** Une entrée de parcours : diplôme, projet d'étude ou expérience. */
export interface CvEntry {
	title: string;
	/** Technologies et nom du projet, affiché sous le titre. */
	subtitle?: string;
	/** Établissement ou entreprise. */
	place?: string;
	date: string;
	bullets: string[];
}

export interface CvData {
	jobTitle: string;
	/** Unité affichée après l'âge calculé (« ans », « years old »). */
	ageUnit: string;
	/** Libellés des repères ARIA, lus par les lecteurs d'écran. */
	aria: {
		document: string;
		sidebar: string;
		main: string;
	};
	sectionTitles: {
		profile: string;
		contact: string;
		skills: string;
		languages: string;
		hobbies: string;
		education: string;
		projects: string;
		experience: string;
	};
	/** Paragraphes du bloc « Profil ». */
	profile: string[];
	/** Adresse postale, une ligne par élément. */
	address: string[];
	/** Numéro tel qu'il est affiché ; le lien `tel:` vit dans profile.ts. */
	phoneDisplay: string;
	skills: string[];
	languages: { name: string; level: string }[];
	hobbies: string[];
	education: CvEntry[];
	projects: CvEntry[];
	experience: CvEntry[];
}

export const cv: Record<Lang, CvData> = {
	fr: {
		jobTitle: 'Développeur FullStack',
		ageUnit: 'ans',
		aria: {
			document: 'Curriculum Vitae de Thibault Rosalie',
			sidebar: 'Informations personnelles',
			main: 'Parcours',
		},
		sectionTitles: {
			profile: 'Profil',
			contact: 'Coordonnées',
			skills: 'Compétences',
			languages: 'Langues',
			hobbies: 'Loisirs',
			education: 'Formation',
			projects: "Projets d'étude",
			experience: 'Expérience professionnelle',
		},
		profile: [
			'Au terme de mon BUT Informatique, je recherche un poste de développeur full stack pour mettre en pratique mes compétences.',
			'Curieux et rigoureux, je souhaite contribuer à des projets concrets et techniques, tout en consolidant mon sens du travail en équipe.',
		],
		address: ['18 Avenue de Sainte-Croix', '64100 Bayonne'],
		phoneDisplay: '07 60 29 99 13',
		skills: [
			'PHP',
			'Laravel',
			'Angular',
			'Docker',
			'MySQL',
			'PHPUnit',
			'Python',
			'SCRUM',
			'Git / GitHub',
			'POO',
		],
		languages: [
			{ name: 'Anglais', level: 'Niveau B2' },
			{ name: 'Créole Réunionnais', level: 'Natif' },
		],
		hobbies: ['Jeux vidéo', 'Randonnée', 'Musculation', 'Yoseikan Budo'],
		education: [
			{
				title: 'BUT Informatique',
				place: 'IUT de Bayonne et du Pays Basque',
				date: '2023 – 2026',
				bullets: [
					'Développement informatique',
					"Optimisation d'applications",
					'Administration de systèmes communicants',
					'Conception / Gestion / Administration / Exploitation de base de données',
					'Gestion de projet agile',
					'Travail en équipe informatique',
				],
			},
		],
		projects: [
			{
				title: 'Application Web Responsive',
				subtitle: 'Laravel / Angular — SportPxl Dashboard',
				place: 'IUT de Bayonne et du Pays Basque',
				date: '2025 – 2026',
				bullets: [
					'Gestion de projet agile SCRUM',
					'Architecture MVC — POO',
					'Conteneurisation Docker',
					'Gestion et sécurisation de base de données MySQL',
					'Rédaction de tests unitaires',
				],
			},
			{
				title: 'Application Web de Covoiturage',
				subtitle: "PHP / Twig / Bootstrap — Covoit'Étud",
				place: 'IUT de Bayonne et du Pays Basque',
				date: '2024 – 2025',
				bullets: [
					'Développement fullstack en équipe de 5 — Architecture MVC',
					'Système de réservation de trajets conducteur / passager',
					"Intégration d'une API de géocodage pour la carte des trajets",
					'Gestion de profils étudiants, notation et système de badges',
					'Documentation technique avec Doxygen',
				],
			},
		],
		experience: [
			{
				title: 'Stagiaire développement — Vision par ordinateur',
				place: 'Compositadour — Projet européen BluePoint',
				date: 'Avr. – Juil. 2026',
				bullets: [
					"Conception et développement d'une application Python/PyQt6 de suivi d'objets en temps réel, architecture MVC",
					'Vision par ordinateur : étalonnage caméra, détection YOLO26 et suivi multi-objets (ByteTrack, BoT-SORT)',
					"Mise en place d'une suite de tests automatisés",
					'Transmission de données vers un système robotisé (TCP)',
				],
			},
			{
				title: 'Stagiaire en Recherche et Développement',
				place: "LIUPPA",
				date: 'Mai – Juil. 2025',
				bullets: [
					"État de l'art des outils de classification sémantique",
					'Collecte et analyse de données',
					'Conception et réalisation de scripts Python de classification de données structurées et semi-structurées',
				],
			},
		],
	},

	en: {
		jobTitle: 'Full Stack Developer',
		ageUnit: 'years old',
		aria: {
			document: 'Resume of Thibault Rosalie',
			sidebar: 'Personal information',
			main: 'Career path',
		},
		sectionTitles: {
			profile: 'Profile',
			contact: 'Contact Information',
			skills: 'Skills',
			languages: 'Languages',
			hobbies: 'Hobbies',
			education: 'Education',
			projects: 'Study Projects',
			experience: 'Professional Experience',
		},
		profile: [
			"Completing a Bachelor's degree in Computer Science at IUT of Bayonne, I am looking for a full stack developer position to put my skills into practice.",
			'Curious and rigorous, I wish to contribute to concrete and technical projects, while strengthening my sense of teamwork.',
		],
		address: ['18 Avenue de Sainte-Croix', '64100 Bayonne, France'],
		phoneDisplay: '+33 7 60 29 99 13',
		skills: [
			'PHP',
			'Laravel',
			'Angular',
			'Docker',
			'MySQL',
			'PHPUnit',
			'Python',
			'SCRUM',
			'Git / GitHub',
			'OOP',
		],
		languages: [
			{ name: 'English', level: 'B2 Level' },
			{ name: 'Kreol Reyoné', level: 'Native' },
		],
		hobbies: ['Video Games', 'Hiking', 'Weight Training', 'Yoseikan Budo'],
		education: [
			{
				title: "Bachelor's Degree in Computer Science",
				place: 'IUT of Bayonne and the Basque Country',
				date: '2023 – 2026',
				bullets: [
					'Software Development',
					'Application Optimization',
					'Management of Communication Systems',
					'Design / Management / Administration / Exploitation of Databases',
					'Agile Project Management',
					'Teamwork in Computer Science',
				],
			},
		],
		projects: [
			{
				title: 'Responsive Web Application',
				subtitle: 'Laravel / Angular — SportPxl Dashboard',
				place: 'IUT of Bayonne and the Basque Country',
				date: '2025 – 2026',
				bullets: [
					'Agile SCRUM Project Management',
					'MVC Architecture — OOP',
					'Docker Containerization',
					'MySQL Database Management and Security',
					'Unit Test Development',
				],
			},
			{
				title: 'Car Sharing Web Application',
				subtitle: "PHP / Twig / Bootstrap — Covoit'Étud",
				place: 'IUT of Bayonne and the Basque Country',
				date: '2024 – 2025',
				bullets: [
					'Fullstack Development in a Team of 5 — MVC Architecture',
					'Booking System for Drivers and Passengers',
					'Integration of a Geocoding API for the Trip Map',
					'Student Profile Management, Grading, and Badge System',
					'Technical Documentation with Doxygen',
				],
			},
		],
		experience: [
			{
				title: 'Development Intern — Computer Vision',
				place: 'Compositadour — BluePoint European project',
				date: 'April – July 2026',
				bullets: [
					'Design and development of a Python/PyQt6 real-time object tracking application, MVC architecture',
					'Computer vision: camera calibration, YOLO26 detection and multi-object tracking (ByteTrack, BoT-SORT)',
					'Implementation of an automated test suite',
					'Data transmission to a robotic system (TCP)',
				],
			},
			{
				title: 'Research and Development Intern',
				place: 'LIUPPA',
				date: 'May – July 2025',
				bullets: [
					'State of the art review of semantic classification tools',
					'Data collection and analysis',
					'Design and implementation of Python scripts for classification of structured and semi-structured data',
				],
			},
		],
	},
};
