/**
 * Le niveau d'un projet : `featured` pour les projets phares, montres en grand
 * sur la liste et l'accueil, `university` pour les projets du BUT.
 *
 * Un champ du contenu et non une deduction : la date ne dit pas ce qui compte.
 * Ce module n'importe rien d'Astro, le schema de contenu et les tests le chargent.
 */
export const projectLevels = ['featured', 'university'] as const;

export type ProjectLevel = (typeof projectLevels)[number];

/** Les projets par niveau, chacun dans l'ordre de la liste. */
export function byLevel<T extends { data: { level: ProjectLevel } }>(entries: T[]): Record<ProjectLevel, T[]> {
	const of = (level: ProjectLevel) => entries.filter((entry) => entry.data.level === level);
	return { featured: of('featured'), university: of('university') };
}
