/**
 * Les captures d'un projet, telles que les montre la visionneuse : leur suite et
 * la taille a laquelle chacune s'affiche.
 *
 * Ce module n'importe rien d'Astro au chargement : il sert au build, au script
 * de la visionneuse dans le navigateur et aux tests (`node --test`).
 * Voir docs/superpowers/specs/2026-11-24-visionneuse-design.md.
 */

import type { ImageMetadata } from 'astro';

export interface Capture<T> {
	src: T;
	alt: string;
	caption?: string;
}

/** Une capture et l'adresse de son image en grand. */
export interface ViewerCapture extends Capture<ImageMetadata> {
	full: string;
}

/**
 * La couverture puis la galerie, chaque image une seule fois. Une couverture
 * reprise dans la galerie reste en tete, mais avec le texte et la legende qu'elle
 * y porte.
 */
export function captureList<T extends { src: string }>(
	cover: Capture<T> | undefined,
	gallery: Capture<T>[] | undefined,
): Capture<T>[] {
	const list = gallery ?? [];
	if (!cover) return [...list];
	const inGallery = list.find((item) => item.src.src === cover.src.src);
	return [inGallery ?? cover, ...list.filter((item) => item !== inGallery)];
}

interface Size {
	width: number;
	height: number;
}

/** Sur petit ecran, largeur en dessous de laquelle le texte d'un bureau ne se lit plus. */
const MIN_ZOOM = 800;

/**
 * Les deux largeurs d'une capture dans la zone de la visionneuse, en px CSS.
 *
 * La taille reelle est celle de l'ecran d'origine : les captures plus hautes que
 * larges viennent d'un telephone en 3x. Sur grand ecran, agrandir montre cette
 * taille ; sur petit ecran, la capture remplit la zone dans un sens et defile dans
 * l'autre. Elle s'y ouvre agrandie si c'est un ecran de bureau, ou si l'entiere
 * ferait moins de la moitie de sa taille (telephone couche).
 */
export function captureSizes(stage: Size, image: Size, small: boolean) {
	const ratio = image.width / image.height;
	const portrait = ratio < 1;
	const real = portrait ? image.width / 3 : image.width;

	const fit = Math.floor(Math.min(stage.width, real, stage.height * ratio));
	const cover = Math.max(stage.width, stage.height * ratio, portrait ? 0 : MIN_ZOOM);
	const zoom = Math.floor(small ? Math.min(real, cover) : real);

	const canZoom = zoom >= fit * 1.1;
	const opensZoomed = small && canZoom && (!portrait || fit < real / 2);
	return { fit, zoom: canZoom ? zoom : fit, canZoom, opensZoomed };
}
