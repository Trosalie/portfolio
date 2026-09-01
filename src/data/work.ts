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
 * toujours les deux collections et echoue au build si elles divergent.
 * Voir docs/AMELIORATIONS.md (P2).
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import type { iconPaths } from '../components/IconPaths';
import type { Lang } from '../i18n/ui';

export type WorkEntry = CollectionEntry<'work'> | CollectionEntry<'work-en'>;

/** Une fonctionnalite ramenee a sa forme longue, telle que la consomme le rendu. */
export interface ProjectFeature {
	title: string;
	description?: string;
	icon?: keyof typeof iconPaths;
}

/** Prefixe des URL de projet, par langue. */
export function workBasePath(lang: Lang): string {
	return lang === 'en' ? '/en/work/' : '/work/';
}

/**
 * Les deux ecritures possibles d'une fonctionnalite ramenees a une seule.
 * Le contenu accepte `- Texte court` autant que `- title: ... / icon: ...` ;
 * les composants n'ont pas a connaitre cette souplesse.
 */
export function normalizeFeatures(features: WorkEntry['data']['features']): ProjectFeature[] {
	return features.map((feature) =>
		typeof feature === 'string' ? { title: feature } : feature,
	);
}

/** Annee de publication, seule granularite affichee sur les cartes. */
export function projectYear(entry: WorkEntry): string {
	return String(entry.data.publishDate.getFullYear());
}

function listOrphans(a: WorkEntry[], b: WorkEntry[]): string[] {
	const known = new Set(b.map((entry) => entry.id));
	return a.map((entry) => entry.id).filter((id) => !known.has(id));
}

/**
 * Les ecarts de structure entre les deux versions d'un meme projet.
 *
 * Les slugs identiques ne suffisent plus : depuis que les fonctionnalites et la
 * stack sont des donnees et non de la prose, une langue peut prendre du retard
 * sur l'autre — une fonctionnalite ajoutee cote francais et oubliee cote
 * anglais passerait inapercue, la page anglaise se contentant d'en afficher une
 * de moins. Comparer les longueurs et les couches nommees suffit a le detecter.
 */
function listStructuralGaps(fr: WorkEntry[], en: WorkEntry[]): string[] {
	const byId = new Map(en.map((entry) => [entry.id, entry]));

	return fr.flatMap((frEntry) => {
		const enEntry = byId.get(frEntry.id);
		if (!enEntry) return [];

		const gaps: string[] = [];

		if (frEntry.data.features.length !== enEntry.data.features.length) {
			gaps.push(
				`${frEntry.data.features.length} fonctionnalite(s) en francais contre ` +
					`${enEntry.data.features.length} en anglais`,
			);
		}

		// La galerie porte une legende par capture : une langue peut en gagner
		// une et pas l'autre, et le carrousel anglais afficherait alors une vue
		// de moins sans que rien ne le signale.
		const frShots = frEntry.data.gallery?.length ?? 0;
		const enShots = enEntry.data.gallery?.length ?? 0;
		if (frShots !== enShots) {
			gaps.push(`${frShots} capture(s) de galerie en francais contre ${enShots} en anglais`);
		}

		const frLayers = frEntry.data.stack.map((group) => group.layer);
		const enLayers = enEntry.data.stack.map((group) => group.layer);
		if (frLayers.length !== enLayers.length) {
			gaps.push(
				`${frLayers.length} couche(s) de stack en francais contre ${enLayers.length} en anglais`,
			);
		}

		return gaps.length > 0 ? [`${frEntry.id} (${gaps.join(', ')})`] : [];
	});
}

/**
 * Les projets d'une langue, tries du plus recent au plus ancien.
 *
 * @throws si un projet existe dans une langue et pas dans l'autre, ou si les
 * deux versions d'un projet n'ont plus la meme structure. Le message nomme les
 * slugs en cause : le probleme se lit sans avoir a ouvrir les deux dossiers.
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

	const gaps = listStructuralGaps(fr, en);

	if (gaps.length > 0) {
		throw new Error(
			`Les deux versions de certains projets ont diverge (${gaps.join(' ; ')}). ` +
				'Les fonctionnalites et les couches de stack sont desormais des donnees : ' +
				'chaque ajout dans une langue doit etre reporte dans l\'autre. Voir src/data/work.ts.',
		);
	}

	const collection = lang === 'en' ? en : fr;
	return [...collection].sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}
