/**
 * Les espaces insecables du francais, posees au rendu.
 *
 * Les textes s'ecrivent avec des espaces ordinaires, dans src/i18n/ui.ts comme dans
 * les contenus Markdown : une seule regle les remplace dans la page, et rien ne
 * depend de l'attention de qui ecrit. Ce module n'importe rien d'Astro, les tests
 * le chargent tel quel.
 */

const FINE = '\u202f';
const NBSP = '\u00a0';

/** Espace fine avant ; ! ? et espace insecable avant : et dans les guillemets. */
export function frenchSpaces(text: string): string {
	return text
		.replace(/ (?=[;!?])/g, FINE)
		.replace(/ (?=[:»])/g, NBSP)
		.replace(/« /g, `«${NBSP}`);
}

// Ce qui n'est pas du texte a lire : scripts, styles, code, commentaires et balises,
// attributs compris (un chevron entre guillemets n'y ferme pas la balise).
const NOT_TEXT =
	/<(script|style|code|pre|textarea)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->|<(?:"[^"]*"|'[^']*'|[^'">])*>/;
const PARTS = new RegExp(`${NOT_TEXT.source}|([^<]+)`, 'g');

/** Une page entiere : seul le texte d'une page francaise change. */
export function frenchHtml(html: string): string {
	if (!/<html[^>]*\blang="fr"/.test(html)) return html;
	return html.replace(PARTS, (part: string, _tag: string | undefined, text: string | undefined) =>
		text === undefined ? part : frenchSpaces(text),
	);
}
