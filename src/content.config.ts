import { defineCollection, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

import { iconPaths } from './components/IconPaths';

type IconName = keyof typeof iconPaths;
const iconNames = Object.keys(iconPaths) as [IconName, ...IconName[]];

/**
 * Une fonctionnalite s'ecrit en une ligne, ou en objet quand elle merite une
 * precision ou une icone. La forme courte suffit dans la plupart des cas et
 * garde les fichiers de contenu lisibles ; `normalizeFeatures` (src/data/work.ts)
 * ramene les deux formes a la meme structure au moment du rendu.
 */
const featureSchema = z.union([
	z.string(),
	z.object({
		title: z.string(),
		description: z.string().optional(),
		icon: z.enum(iconNames).optional(),
	}),
]);

/**
 * Une capture de la galerie. `alt` est requis et non optionnel comme `img_alt` :
 * une galerie n'a pas de repli decoratif possible, chaque vue montre un ecran
 * different du logiciel et c'est la seule description qu'en aura un lecteur
 * d'ecran. La legende, elle, est visible de tous et reste facultative.
 */
const galleryItemSchema = ({ image }: SchemaContext) =>
	z.object({
		src: image(),
		alt: z.string(),
		caption: z.string().optional(),
	});

/** Une couche de la stack et les technologies qui la composent. */
const stackGroupSchema = z.object({
	layer: z.string(),
	items: z.array(z.string()).min(1),
});

/**
 * `img` passe par le helper `image()` et non par une simple chaine : le fichier
 * entre alors dans le pipeline `astro:assets`, qui en connait les dimensions et
 * les inscrit dans le HTML. Une `<img>` alimentee par une chaine ne peut pas
 * les declarer — l'image occupe une hauteur nulle jusqu'a son chargement, puis
 * pousse le contenu. Le portrait de l'accueil suit deja ce chemin.
 * Voir docs/AMELIORATIONS.md (P5).
 *
 * `intro`, `features`, `stack` et `role` sont requis : ils portaient auparavant
 * les quatre sections du corps Markdown, que chaque projet reecrivait a la main.
 * Les declarer ici les rend obligatoires — un projet incomplet fait echouer le
 * build en nommant son fichier, au lieu de produire une page amputee. Le corps
 * Markdown reste disponible pour du contenu libre en complement.
 */
const workSchema = ({ image }: SchemaContext) =>
	z
		.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: image().optional(),
			img_alt: z.string().optional(),
			githubUrl: z.string().url().optional(),
			demoUrl: z.string().url().optional(),
			gradient: z.string().optional(),

			// Une seule capture ne suffit pas a montrer un logiciel a plusieurs
			// ecrans. La couverture reste l'image d'appel, la galerie deroule le
			// reste ; un projet sans galerie affiche la page exactement comme avant.
			gallery: z.array(galleryItemSchema({ image })).min(2).optional(),

			intro: z.string(),
			features: z.array(featureSchema).min(1),
			stack: z.array(stackGroupSchema).min(1),
			role: z.string(),

			period: z.string().optional(),
			context: z.string().optional(),
			team: z.string().optional(),
		})
		.superRefine((data, ctx) => {
			// Une capture d'ecran sans alternative textuelle n'existe pas pour un
			// lecteur d'ecran. Le champ etait optionnel et le rendu retombait sur
			// `alt=""`, ce qui declare l'image purement decorative — elle ne l'est
			// pas ici, c'est le seul apercu du projet.
			if (data.img && !data.img_alt) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['img_alt'],
					message:
						"Un projet qui renseigne `img` doit decrire son image dans `img_alt` : " +
						"la capture est le seul apercu du projet, elle n'est pas decorative.",
				});
			}
		});

export const collections = {
	work: defineCollection({
		loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
		schema: workSchema,
	}),
	'work-en': defineCollection({
		loader: glob({ base: './src/content/work-en', pattern: '**/*.md' }),
		schema: workSchema,
	}),
};
