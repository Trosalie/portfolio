/**
 * Données personnelles qui ne dépendent pas de la langue : le nom, les liens,
 * la date de naissance.
 *
 * Comme le CV, elles viennent de l'outil `candidatures` (export `cv.json`,
 * validé par `cvExport.ts`) : changer un contact dans l'outil le change ici
 * aussi, sur le CV comme sur la page Contact. Le numéro affiché et l'adresse
 * postale s'écrivent différemment selon la langue : ils sont dans `cv.ts`.
 *
 * Voir docs/AMELIORATIONS.md (P2).
 */

import { cvExport } from './cvExport';

export const identity = {
	firstName: cvExport.identity.firstName,
	lastName: cvExport.identity.lastName,
} as const;

/** Liens de contact. Seul le `href` du téléphone, donnée machine, est ici. */
export const contact = cvExport.contact;

// Construite à partir de ses composants plutôt que de la chaîne « 2003-05-30 »,
// que JavaScript interpréterait en UTC et qui pourrait donc reculer d'un jour
// selon le fuseau de la machine qui compile.
const [birthYear, birthMonth, birthDay] = cvExport.identity.birthDate.split('-').map(Number) as [number, number, number];
export const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

/**
 * Âge en années révolues.
 *
 * Le site étant statique, la valeur est figée à la compilation : elle se met
 * à jour à chaque build, donc à chaque déploiement.
 */
export function getAge(reference: Date = new Date()): number {
	let age = reference.getFullYear() - birthDate.getFullYear();

	const monthDiff = reference.getMonth() - birthDate.getMonth();
	const dayDiff = reference.getDate() - birthDate.getDate();
	// Anniversaire pas encore passé cette année.
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

	return age;
}
