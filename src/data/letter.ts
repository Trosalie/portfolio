/**
 * Texte par défaut de la lettre de motivation, une version par langue.
 *
 * Il existait en quatre exemplaires : deux fois en chaîne JavaScript dans les
 * éditeurs, deux fois en `<p>` statiques dans les pages d'impression. Un même
 * texte écrit à quatre endroits finit par ne plus être le même — c'est ce qui
 * était arrivé au CV. Voir docs/AMELIORATIONS.md (P2).
 *
 * Les caractères sont volontairement non accentués : ce texte est un point de
 * départ que l'utilisateur réécrit, et il transite par le `localStorage`.
 */

import type { Lang } from '../i18n/ui';

/** Paragraphes du modèle de lettre, séparés par une ligne vide à l'affichage. */
export const defaultLetter: Record<Lang, string[]> = {
	fr: [
		'Madame, Monsieur,',
		'Actuellement etudiant en BUT 3 Informatique, je souhaite integrer votre entreprise afin de mettre en pratique mes competences en developpement web full stack.',
		"Rigoureux, curieux et implique, j'apprecie les environnements techniques stimulants et le travail en equipe.",
		"Je serais heureux d'echanger avec vous afin de vous presenter plus en detail ma motivation.",
		"Je vous prie d'agreer, Madame, Monsieur, l'expression de mes salutations distinguees.",
		'Thibault Rosalie',
	],
	en: [
		'Dear Hiring Manager,',
		'I am currently a third-year Computer Science student and I am eager to join your team to apply my full-stack development skills in a professional environment.',
		'I am rigorous, curious, and motivated by concrete technical challenges as well as collaborative work.',
		'I would be pleased to discuss how my profile could contribute to your projects.',
		'Yours faithfully,',
		'Thibault Rosalie',
	],
};

/** Locale utilisée pour formater la date affichée sur la lettre. */
export const dateLocale: Record<Lang, string> = {
	fr: 'fr-FR',
	en: 'en-GB',
};

/**
 * Clés de `localStorage`. Distinctes par langue : une lettre rédigée en
 * français ne doit pas écraser sa version anglaise.
 */
export function storageKeys(lang: Lang) {
	return {
		text: `motivation-letter-${lang}`,
		meta: `motivation-letter-meta-${lang}`,
	};
}
