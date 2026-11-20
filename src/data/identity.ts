/**
 * L'identite visuelle d'un projet : les couleurs et la typographie que le
 * produit s'est donnees, reprises par sa vignette et par son nuancier.
 *
 * Ce module n'importe rien d'Astro : il est charge tel quel par le schema de
 * contenu, par src/data/work.ts et par les tests (`node --test`).
 * Voir docs/superpowers/specs/2026-11-20-direction-visuelle-design.md.
 */

/**
 * Le style du nom du projet dans son cadre. Une liste fermee plutot que du CSS
 * libre dans le contenu : chaque entree correspond a une classe et a une police
 * chargee par ProjectFrame.astro.
 */
export const titleStyles = ['oswald-caps', 'playfair-italic'] as const;

/** Les polices de produit que le nuancier sait afficher, toutes installees avec le site. */
export const specimenFonts = ['Playfair Display', 'DM Sans', 'DM Mono', 'Oswald', 'Space Mono'] as const;

/** Les pieces d'interface recreees, une par produit. */
export const specimens = ['seenit-ticket', 'chronopotes-flaps'] as const;

export interface ProjectIdentity {
	frame: {
		background: string;
		border?: string;
		titleColor: string;
		titleStyle: (typeof titleStyles)[number];
	};
	palette: { name: string; hex: string }[];
	fonts: { family: (typeof specimenFonts)[number]; role: string }[];
	specimen: (typeof specimens)[number];
}

const sameHex = (a: string | undefined, b: string | undefined) =>
	(a ?? '').toUpperCase() === (b ?? '').toUpperCase();

/**
 * Les ecarts entre les versions francaise et anglaise d'une meme identite.
 *
 * Les noms de couleurs et les roles des polices se traduisent ; les codes, le
 * cadre, les familles et la piece d'interface doivent etre identiques. Sans ce
 * controle, une couleur corrigee dans une seule langue donnerait deux nuanciers
 * differents pour un meme produit.
 */
export function identityGaps(
	fr: ProjectIdentity | undefined,
	en: ProjectIdentity | undefined,
): string[] {
	if (!fr && !en) return [];
	if (!fr || !en) return ['identité visuelle présente dans une seule langue'];

	const gaps: string[] = [];

	const frameMatches =
		sameHex(fr.frame.background, en.frame.background) &&
		sameHex(fr.frame.border, en.frame.border) &&
		sameHex(fr.frame.titleColor, en.frame.titleColor) &&
		fr.frame.titleStyle === en.frame.titleStyle;
	if (!frameMatches) gaps.push('cadre différent');

	if (fr.palette.length !== en.palette.length) {
		gaps.push(`${fr.palette.length} couleur(s) en français contre ${en.palette.length} en anglais`);
	} else {
		fr.palette.forEach((color, index) => {
			const other = en.palette[index]!;
			if (!sameHex(color.hex, other.hex)) {
				gaps.push(`couleur ${index + 1} : ${color.hex} en français contre ${other.hex} en anglais`);
			}
		});
	}

	const families = (identity: ProjectIdentity) => identity.fonts.map((font) => font.family).join('|');
	if (families(fr) !== families(en)) gaps.push('polices différentes');

	if (fr.specimen !== en.specimen) gaps.push("pièce d'interface différente");

	return gaps;
}
