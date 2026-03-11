import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workSchema = z.object({
	title: z.string(),
	description: z.string(),
	publishDate: z.coerce.date(),
	tags: z.array(z.string()),
	img: z.string().optional(),
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
