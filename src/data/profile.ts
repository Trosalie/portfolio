/**
 * Données personnelles partagées par les différentes vues du CV.
 *
 * Premier pas vers la sortie du contenu du CV hors des pages : l'âge était
 * écrit en dur dans cinq fichiers, qui affichaient déjà quatre valeurs
 * différentes. Voir docs/AMELIORATIONS.md (P2).
 */

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
