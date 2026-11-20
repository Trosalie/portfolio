/**
 * Le CV et les coordonnées, tels que les produit l'outil `candidatures`
 * (C:\dev\candidatures) dans `cv.json`. Ce fichier ne se modifie pas à la main :
 * le CV se rédige dans l'outil, puis s'exporte depuis sa version « Publique ».
 *
 * Le fichier est validé ici, au chargement du module : un export incomplet ou
 * mal formé fait échouer `npm run check` comme le build, en nommant le champ en
 * cause, au lieu de produire un CV amputé en production. C'est la garantie que
 * portait auparavant le typage `Record<Lang, CvData>` de cv.ts.
 */

import { z } from 'astro/zod';
import raw from './cv.json';

const text = z.string().min(1);
const link = z.object({ href: text, label: text });

const entrySchema = z.object({
	title: text,
	subtitle: text.optional(),
	place: text.optional(),
	date: text,
	bullets: z.array(text),
	url: z.string().url().optional(),
});

const cvDataSchema = z.object({
	jobTitle: text,
	ageUnit: text,
	aria: z.object({ document: text, sidebar: text, main: text }),
	sectionTitles: z.object({
		profile: text,
		contact: text,
		skills: text,
		languages: text,
		hobbies: text,
		education: text,
		projects: text,
		experience: text,
	}),
	profile: z.array(text).min(1),
	address: z.array(text).min(1),
	phoneDisplay: text,
	skills: z.array(text),
	languages: z.array(z.object({ name: text, level: text })),
	hobbies: z.array(text),
	education: z.array(entrySchema),
	projects: z.array(entrySchema),
	experience: z.array(entrySchema),
});

const exportSchema = z.object({
	identity: z.object({
		firstName: text,
		lastName: text,
		birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date attendue au format AAAA-MM-JJ'),
	}),
	contact: z.object({
		email: text,
		phoneHref: text,
		linkedin: link,
		github: link,
		website: link,
	}),
	cv: z.object({ fr: cvDataSchema, en: cvDataSchema }),
});

const parsed = exportSchema.safeParse(raw);
if (!parsed.success) {
	throw new Error(
		'src/data/cv.json invalide — ' +
			parsed.error.issues.map((issue) => `${issue.path.join('.')} : ${issue.message}`).join(' ; ') +
			". Refaire l'export depuis l'outil candidatures.",
	);
}

export const cvExport = parsed.data;
