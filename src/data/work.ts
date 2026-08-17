/**
 * Point d'entree unique vers les deux collections de projets.
 *
 * Les projets vivent dans deux collections paralleles, `work` et `work-en`,
 * qui doivent porter les memes slugs : c'est sur eux que le selecteur de langue
 * construit le chemin de la page equivalente. Rien ne le garantissait, et la
 * derive s'etait deja produite — la page d'accueil anglaise chargeait `work`,
 * si bien qu'elle affichait les cartes en francais et renvoyait vers `/work/`.
 *
 * Passer par cette fonction rend l'ecart impossible a ignorer : elle charge
 * toujours les deux collections et echoue au build si leurs slugs different.
 * Voir docs/AMELIORATIONS.md (P2).
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type WorkEntry = CollectionEntry<'work'> | CollectionEntry<'work-en'>;

/** Prefixe des URL de projet, par langue. */
export function workBasePath(lang: Lang): string {
	return lang === 'en' ? '/en/work/' : '/work/';
}

function listOrphans(a: WorkEntry[], b: WorkEntry[]): string[] {
	const known = new Set(b.map((entry) => entry.id));
	return a.map((entry) => entry.id).filter((id) => !known.has(id));
}

/**
 * Les projets d'une langue, tries du plus recent au plus ancien.
 *
 * @throws si un projet existe dans une langue et pas dans l'autre. Le message
 * nomme les slugs en cause : le probleme se lit sans avoir a ouvrir les deux
 * dossiers.
 */
// Les surcharges gardent le type etroit quand la langue est connue a l'ecriture,
// ce dont les routes dynamiques ont besoin pour typer leurs props.
export async function getWorkCollection(lang: 'fr'): Promise<CollectionEntry<'work'>[]>;
export async function getWorkCollection(lang: 'en'): Promise<CollectionEntry<'work-en'>[]>;
export async function getWorkCollection(lang: Lang): Promise<WorkEntry[]>;
export async function getWorkCollection(lang: Lang): Promise<WorkEntry[]> {
	const [fr, en] = await Promise.all([getCollection('work'), getCollection('work-en')]);

	const missingInEn = listOrphans(fr, en);
	const missingInFr = listOrphans(en, fr);

	if (missingInEn.length > 0 || missingInFr.length > 0) {
		const details = [
			missingInEn.length > 0 ? `absents de src/content/work-en/ : ${missingInEn.join(', ')}` : null,
			missingInFr.length > 0 ? `absents de src/content/work/ : ${missingInFr.join(', ')}` : null,
		]
			.filter(Boolean)
			.join(' ; ');

		throw new Error(
			`Les collections de projets ne sont plus synchronisees (${details}). ` +
				'Chaque projet doit exister dans les deux langues sous le meme slug, ' +
				"sans quoi le selecteur de langue mene a un 404. Voir src/data/work.ts.",
		);
	}

	const collection = lang === 'en' ? en : fr;
	return [...collection].sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}
