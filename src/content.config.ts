import { defineCollection, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `img` passe par le helper `image()` et non par une simple chaine : le fichier
 * entre alors dans le pipeline `astro:assets`, qui en connait les dimensions et
 * les inscrit dans le HTML. Une `<img>` alimentee par une chaine ne peut pas
 * les declarer — l'image occupe une hauteur nulle jusqu'a son chargement, puis
 * pousse le contenu. Le portrait de l'accueil suit deja ce chemin.
 * Voir docs/AMELIORATIONS.md (P5).
 */
const workSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		tags: z.array(z.string()),
		img: image().optional(),
		img_alt: z.string().optional(),
		githubUrl: z.string().url().optional(),
		gradient: z.string().optional(),
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
