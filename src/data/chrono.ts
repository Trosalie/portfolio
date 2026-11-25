/**
 * Une manche de ChronoPotes : les seuils, les formats et le roulement des palettes.
 *
 * Repris du jeu (`src/engine/common.ts` et `src/ui/SplitFlap/roll.ts`). Ce module
 * n'importe rien d'Astro : le script de la page et les tests le chargent tel quel.
 */
import type { Lang } from '../i18n/ui';

export const TARGET_MS = 5000;

/** En deca, deux gestes de suite n'en font qu'un. */
export const GUARD_MS = 400;

/** Une manche que personne n'arrete s'interrompt. */
export const LIMIT_MS = 30_000;

/** La duree d'un cran du roulement. */
export const ROLL_TICK_MS = 80;

export type Tier = 'masterclass' | 'good' | 'average' | 'missed';

/** La mention, d'apres l'ecart a la cible, en valeur absolue. */
export function tierFor(diffMs: number): Tier {
	if (diffMs < 150) return 'masterclass';
	if (diffMs <= 500) return 'good';
	if (diffMs <= 1000) return 'average';
	return 'missed';
}

function decimal(hundredths: number, lang: Lang): string {
	const whole = Math.floor(hundredths / 100);
	return `${whole}${lang === 'fr' ? ',' : '.'}${String(hundredths % 100).padStart(2, '0')}`;
}

/** Le temps des palettes, quatre chiffres : « 05,12 ». */
export function formatFlap(ms: number, lang: Lang): string {
	return decimal(Math.min(Math.round(ms / 10), 9999), lang).padStart(5, '0');
}

/** L'ecart signe : « +0,12 s ». Arrondi avec son signe, comme le temps affiche dont il est l'ecart. */
export function formatGap(signedMs: number, lang: Lang): string {
	const hundredths = Math.round(signedMs / 10);
	const sign = hundredths > 0 ? '+' : hundredths < 0 ? '\u2212' : '';
	return `${sign}${decimal(Math.abs(hundredths), lang)}\u00a0s`;
}

/** Les caracteres affiches tour a tour a chaque position : un chiffre tourne un cran de plus que son voisin de gauche. */
export function rollPlan(value: string): string[][] {
	let digits = 0;
	return [...value].map((char) => {
		if (!/^\d$/.test(char)) return [char];
		const steps = 3 + digits++;
		return Array.from({ length: steps + 1 }, (_, i) => String((Number(char) - steps + i + 10) % 10));
	});
}
