/**
 * Le CV, une version par langue.
 *
 * Le texte ne se rédige plus ici : il vient de l'outil `candidatures`
 * (C:\dev\candidatures), où il est écrit une seule fois puis exporté depuis la
 * version « Publique » dans `cv.json`, validé par `cvExport.ts`.
 *
 * Les quatre pages (`/cv/`, `/en/cv/`, `/cv-print/`, `/en/cv-print/`) rendent
 * toutes le même composant `CvDocument.astro` alimenté par ces données. Voir
 * docs/AMELIORATIONS.md (P2) pour l'historique.
 */

import type { Lang } from '../i18n/ui';
import { cvExport } from './cvExport';

/** Une entrée de parcours : diplôme, projet d'étude ou expérience. */
export interface CvEntry {
	title: string;
	/** Technologies et nom du projet, affiché sous le titre. */
	subtitle?: string;
	/** Établissement ou entreprise. */
	place?: string;
	date: string;
	bullets: string[];
	url?: string;
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

export const cv: Record<Lang, CvData> = cvExport.cv;
