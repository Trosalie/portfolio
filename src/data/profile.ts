/**
 * Données personnelles qui ne dépendent pas de la langue.
 *
 * Le contenu rédigé du CV — profil, formation, expériences — vit dans
 * `src/data/cv.ts`, une version par langue. Ici ne figure que ce qui s'écrit
 * de la même façon en français et en anglais : le nom et les liens.
 *
 * Voir docs/AMELIORATIONS.md (P2).
 */

export const identity = {
	firstName: 'Thibault',
	lastName: 'Rosalie',
} as const;

/**
 * Liens de contact. Le numéro et l'adresse postale s'écrivent différemment
 * selon la langue (indicatif international, mention du pays) : ils sont dans
 * `cv.ts`. Seul le `href` du téléphone, qui est une donnée machine, est ici.
 */
export const contact = {
	phoneHref: 'tel:+33760299913',
	email: 'thibaultrosaliepro@gmail.com',
	linkedin: { href: 'https://linkedin.com/in/thibaultrosalie', label: 'thibaultrosalie' },
	github: { href: 'https://github.com/trosalie', label: 'github.com/trosalie' },
	website: { href: 'https://trosalie.alwaysdata.net', label: 'trosalie.alwaysdata.net' },
} as const;

// Mois en base 0 : 4 = mai. Volontairement construit à partir de ses
// composants plutôt que d'une chaîne « 2003-05-30 », que JavaScript
// interpréterait en UTC et qui pourrait donc reculer d'un jour selon le
// fuseau de la machine qui compile.
export const birthDate = new Date(2003, 4, 30);

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
