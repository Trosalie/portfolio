/**
 * Decoupe les vignettes mobiles : src/assets/projets/<projet>/vignette-mobile.webp.
 *
 * Sous 50em, une vignette fait environ 290 px de large : la capture entiere d'un
 * ecran de bureau n'y montre plus que des formes. Chaque projet y montre a la
 * place un detail de son interface, au format de la vignette (16:10), decoupe
 * une fois dans une capture existante. Les captures ne contiennent que des
 * donnees fictives ; le decoupage n'en ajoute pas.
 *
 * Les images sont commitees : le build ne les regenere pas. Relancer ce script
 * apres avoir change une capture source ou un cadrage :
 *
 *     node scripts/crop-mobile-tiles.mjs
 *
 * Le cadrage cherche la lisibilite avant la definition : dans les captures de
 * bureau, un detail de 460 a 820 px de large, selon la taille de leur texte, le
 * garde dechiffrable. Le terminal de Projet Chat, cadre a 640 px, tombait a 6 px
 * a l'ecran. Le navigateur agrandit alors au plus 1,3 fois l'image sur un ecran
 * 2x, et 1,9 fois sur un ecran 3x. ChronoPotes fait 1250 px : sa source est une
 * capture de telephone en 3x, au texte deja grand.
 */

import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));

/** Largeur minimale d'un cadrage : en dessous, l'agrandissement se verrait. */
const MIN_WIDTH = 440;

/** `left`, `top`, `width` en pixels de la capture source ; la hauteur suit le 16:10. */
const CROPS = [
	// Le haut d'un seul telephone : le defi du jour et l'affichage a palettes.
	{ project: 'chronopotes', source: 'accueil.webp', left: 20, top: 0, width: 1250 },
	// Le fronton « À l'affiche » et la premiere seance prevue.
	{ project: 'seenit', source: 'couverture.webp', left: 190, top: 160, width: 528 },
	// La boite de detection et son etiquette, sur le convoyeur.
	{ project: 'bluepoint', source: 'flux-detection.webp', left: 200, top: 268, width: 820 },
	// Le terminal de lea : l'arrivee dans le channel et les echanges.
	{ project: 'projet-chat', source: 'couverture.webp', left: 490, top: 340, width: 460 },
	// Deux lignes de la liste des photographes, chiffre d'affaires compris.
	{ project: 'sportpxl', source: 'couverture.webp', left: 282, top: 250, width: 560 },
	// Deux cartes de trajet : arrivee, horaires, date et prix.
	{ project: 'covoit-etud', source: 'couverture.webp', left: 572, top: 386, width: 736 },
];

for (const { project, source, left, top, width } of CROPS) {
	const height = Math.round(width / 1.6);
	const input = root(`src/assets/projets/${project}/${source}`);
	const { width: sourceWidth, height: sourceHeight } = await sharp(input).metadata();

	if (width < MIN_WIDTH) {
		throw new Error(`${project} : cadrage de ${width} px, moins que ${MIN_WIDTH} px.`);
	}
	if (left < 0 || top < 0 || left + width > sourceWidth || top + height > sourceHeight) {
		throw new Error(
			`${project} : le cadrage ${left},${top} ${width}x${height} sort de ${source} (${sourceWidth}x${sourceHeight}).`,
		);
	}

	const output = root(`src/assets/projets/${project}/vignette-mobile.webp`);
	await sharp(input).extract({ left, top, width, height }).webp({ quality: 82 }).toFile(output);
	console.log(`${project} : ${width}x${height}`);
}
