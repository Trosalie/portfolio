export const languages = {
	fr: 'Français',
	en: 'English',
};

export const defaultLang = 'fr';

export const ui = {
	fr: {
		// Métadonnées par défaut (pages sans title/description explicites)
		'meta.default.title': 'Thibault Rosalie - Portfolio',
		'meta.default.description':
			'Portfolio de Thibault Rosalie, étudiant en BUT 3 Informatique et développeur web full stack.',

		// Navigation
		'nav.home': 'Accueil',
		'nav.work': 'Projets',
		'nav.about': 'À propos',
		'nav.cv': 'CV',
		'nav.contact': 'Me contacter',

		// ContactCTA
		'contactcta.title': 'Intéressé par une collaboration ?',
		'contactcta.cta': 'Envoyez-moi un message',

		// Footer
		'footer.madeWith': 'Créé avec',

		// Page 404
		'404.meta.title': 'Page introuvable | Thibault Rosalie',
		'404.meta.desc': "Erreur 404 — cette page n'existe pas ou a été déplacée.",
		'404.title': 'Page introuvable',
		'404.tagline': "Cette page n'existe pas ou a été déplacée.",
		'404.back': "← Retour à l'accueil",

		// WorkInProgress
		'wip.subtitle': 'Cette page est en cours de construction.',
		'wip.text': 'Je travaille activement dessus. Revenez bientôt !',
		'wip.back': '← Retour à l\'accueil',

		// Page d'accueil
		'index.hero.title': "Bonjour, je m'appelle Thibault Rosalie",
		'index.hero.tagline': "Je suis étudiant en BUT 3 Informatique, passionné par le développement web et les nouvelles technologies.",
		'index.hero.portrait.alt': 'Photo de profil de Thibault Rosalie',
		'index.hero.role.dev': 'Développeur',
		'index.hero.role.student': 'Étudiant',
		'index.hero.cta': 'Voir mon CV',
		'index.hero.letterCta': 'Rédiger ma lettre',
		'index.projects.title': 'Projets sélectionnés',
		'index.projects.desc': 'Découvrez ci-dessous une sélection de mes projets récents réalisés dans le cadre de mes études et de mes projets personnels.',
		'index.projects.cta': 'Voir tous les projets',
		'index.skills.title': 'Compétences',
		'index.skills.desc': 'Actuellement en formation BUT Informatique, je développe mes compétences dans différents domaines du développement logiciel et web.',
		'index.skills.backend': 'Back-end',
		'index.skills.frontend': 'Front-end',
		'index.skills.tools': 'Outils & Méthodes',

		// Encart compétences (composant Skills)
		'skills.backend.text':
			"PHP, Laravel, Python — développement d'applications web robustes, tests unitaires avec PHPUnit et conception orientée objet.",
		'skills.frontend.text':
			"Angular, HTML/CSS — création d'interfaces modernes et responsives, avec une approche mobile-first et un souci du détail.",
		'skills.tools.text':
			'Git, Docker, MySQL, SCRUM — environnements conteneurisés, versioning collaboratif et gestion de projet agile.',

		// Projets
		'work.title': 'Mes Projets',
		'work.tagline': 'Découvrez mes projets les plus récents pour avoir un aperçu de mon expérience.',
		'work.meta.title': 'Mes Projets | Thibault Rosalie',
		'work.meta.desc': 'Découvrez les projets récents de Thibault Rosalie',

		// Contact
		'contact.title': 'Me contacter',
		'contact.subtitle': "Une question, une opportunité, un projet ? N'hésitez pas à m'écrire, je vous répondrai dans les plus brefs délais.",
		'contact.name': 'Nom',
		'contact.email': 'Adresse e-mail',
		'contact.subject': 'Sujet',
		'contact.message': 'Message',
		'contact.name.placeholder': 'Jean Dupont',
		'contact.email.placeholder': 'jean.dupont@email.com',
		'contact.subject.placeholder': 'Proposition de stage, collaboration...',
		'contact.message.placeholder': 'Décrivez votre demande...',
		'contact.submit': 'Envoyer le message',
		'contact.details': 'Coordonnées',
		'contact.availability': 'Disponibilité',
		'contact.availability.text': "Actuellement en BUT 3 Informatique à l'IUT de Bayonne. Ouvert aux opportunités de stage et d'alternance.",
		'contact.meta.title': 'Me contacter | Thibault Rosalie',
		'contact.meta.desc': 'Envoyez-moi un message pour toute proposition de collaboration ou question.',

		// À propos
		'about.meta.title': 'À propos | Thibault Rosalie',
		'about.meta.desc': 'À propos de Thibault Rosalie - Étudiant en BUT 3 Informatique',
		'about.wip.title': 'À propos',

		// CV
		'cv.save': 'Sauvegarder en PDF',
		'cv.download': 'Télécharger le PDF',
		'cv.age.unit': 'ans',
		'cv.meta.title': 'CV | Thibault Rosalie',
		'cv.meta.desc': 'Curriculum Vitae de Thibault Rosalie - Développeur FullStack, étudiant en BUT 3 Informatique',

		// Lettre de motivation
		'letter.meta.title': 'Lettre de motivation | Thibault Rosalie',
		'letter.meta.desc': 'Rédaction et impression PDF de la lettre de motivation de Thibault Rosalie.',
		'letter.page.title': 'Lettre de motivation',
		'letter.page.subtitle': 'Rédigez votre lettre puis ouvrez la page d\'impression pour la sauvegarder en PDF, comme pour le CV.',
		'letter.form.label': 'Contenu de la lettre',
		'letter.form.placeholder': 'Saisissez votre lettre de motivation ici...\n\nUtilisez une ligne vide entre deux paragraphes pour une meilleure mise en page.',
		'letter.form.cta': 'Ouvrir la version PDF',
		'letter.form.date': 'Date',
		'letter.form.company': 'Nom de l\'entreprise',
		'letter.form.address': 'Adresse de l\'entreprise',
		'letter.form.title': 'Titre de la lettre',
		'letter.form.company.placeholder': 'Ex: Alwaysdata',
		'letter.form.address.placeholder': 'Ex: 62 rue Tiquetonne, 75002 Paris',
		'letter.form.title.placeholder': 'Ex: Candidature pour un stage de developpement web',
		'letter.preview.header': 'Lettre de motivation',
	},
	en: {
		// Métadonnées par défaut (pages sans title/description explicites)
		'meta.default.title': 'Thibault Rosalie - Portfolio',
		'meta.default.description':
			'Portfolio of Thibault Rosalie, Computer Science student and full stack web developer.',

		// Navigation
		'nav.home': 'Home',
		'nav.work': 'Projects',
		'nav.about': 'About',
		'nav.cv': 'Resume',
		'nav.contact': 'Contact me',

		// ContactCTA
		'contactcta.title': 'Interested in collaborating?',
		'contactcta.cta': 'Send me a message',

		// Footer
		'footer.madeWith': 'Built with',

		// Page 404
		'404.meta.title': 'Page not found | Thibault Rosalie',
		'404.meta.desc': '404 error — this page does not exist or has been moved.',
		'404.title': 'Page not found',
		'404.tagline': 'This page does not exist or has been moved.',
		'404.back': '← Back to home',

		// WorkInProgress
		'wip.subtitle': 'This page is under construction.',
		'wip.text': 'I am actively working on it. Come back soon!',
		'wip.back': '← Back to home',

		// Page d'accueil
		'index.hero.title': "Hello, my name is Thibault Rosalie",
		'index.hero.tagline': "I am a 3rd year Computer Science student, passionate about web development and new technologies.",
		'index.hero.portrait.alt': 'Profile picture of Thibault Rosalie',
		'index.hero.role.dev': 'Developer',
		'index.hero.role.student': 'Student',
		'index.hero.cta': 'View my Resume',
		'index.hero.letterCta': 'Write my Cover Letter',
		'index.projects.title': 'Selected Projects',
		'index.projects.desc': 'Discover below a selection of my recent projects completed as part of my studies and personal projects.',
		'index.projects.cta': 'View all projects',
		'index.skills.title': 'Skills',
		'index.skills.desc': 'Currently studying Computer Science, I am developing my skills in various areas of software and web development.',
		'index.skills.backend': 'Back-end',
		'index.skills.frontend': 'Front-end',
		'index.skills.tools': 'Tools & Methods',

		// Skills box (Skills component)
		'skills.backend.text':
			'PHP, Laravel, Python — building robust web applications, unit testing with PHPUnit and object-oriented design.',
		'skills.frontend.text':
			'Angular, HTML/CSS — building modern, responsive interfaces with a mobile-first approach and an eye for detail.',
		'skills.tools.text':
			'Git, Docker, MySQL, SCRUM — containerised environments, collaborative versioning and agile project management.',

		// Projects
		'work.title': 'My Projects',
		'work.tagline': 'Discover my most recent projects to get an overview of my experience.',
		'work.meta.title': 'My Projects | Thibault Rosalie',
		'work.meta.desc': 'Discover the recent projects of Thibault Rosalie',

		// Contact
		'contact.title': 'Contact me',
		'contact.subtitle': "A question, an opportunity, a project? Don't hesitate to write to me, I'll get back to you as soon as possible.",
		'contact.name': 'Name',
		'contact.email': 'Email address',
		'contact.subject': 'Subject',
		'contact.message': 'Message',
		'contact.name.placeholder': 'John Doe',
		'contact.email.placeholder': 'john.doe@email.com',
		'contact.subject.placeholder': 'Internship proposal, collaboration...',
		'contact.message.placeholder': 'Describe your request...',
		'contact.submit': 'Send message',
		'contact.details': 'Contact details',
		'contact.availability': 'Availability',
		'contact.availability.text': "Currently in 3rd year Computer Science at IUT de Bayonne. Open to internship and apprenticeship opportunities.",
		'contact.meta.title': 'Contact me | Thibault Rosalie',
		'contact.meta.desc': 'Send me a message for any collaboration proposal or question.',

		// About
		'about.meta.title': 'About | Thibault Rosalie',
		'about.meta.desc': 'About Thibault Rosalie - 3rd year Computer Science student',
		'about.wip.title': 'About',

		// Resume
		'cv.save': 'Save as PDF',
		'cv.download': 'Download the PDF',
		'cv.age.unit': 'years old',
		'cv.meta.title': 'Resume | Thibault Rosalie',
		'cv.meta.desc': 'Curriculum Vitae of Thibault Rosalie - FullStack Developer, 3rd year Computer Science student',

		// Cover letter
		'letter.meta.title': 'Cover Letter | Thibault Rosalie',
		'letter.meta.desc': 'Write and print the PDF cover letter of Thibault Rosalie.',
		'letter.page.title': 'Cover Letter',
		'letter.page.subtitle': 'Write your letter, then open the print page to save it as PDF with the same flow as the resume.',
		'letter.form.label': 'Letter content',
		'letter.form.placeholder': 'Write your cover letter here...\n\nUse an empty line between paragraphs for cleaner layout.',
		'letter.form.cta': 'Open PDF version',
		'letter.form.date': 'Date',
		'letter.form.company': 'Company name',
		'letter.form.address': 'Company address',
		'letter.form.title': 'Letter title',
		'letter.form.company.placeholder': 'E.g. Alwaysdata',
		'letter.form.address.placeholder': 'E.g. 62 rue Tiquetonne, 75002 Paris',
		'letter.form.title.placeholder': 'E.g. Application for a web development internship',
		'letter.preview.header': 'Cover Letter',
	},
} as const;

export type Lang = keyof typeof ui;
export type TranslationKey = keyof typeof ui['fr'];

export function getLangFromUrl(url: URL): Lang {
	const [, lang] = url.pathname.split('/');
	if (lang in ui) return lang as Lang;
	return defaultLang;
}

export function useTranslations(lang: Lang) {
	return function t(key: TranslationKey): string {
		return ui[lang][key] ?? ui[defaultLang][key];
	};
}

/**
 * Segments de route dont le nom change d'une langue à l'autre.
 * Toutes les autres routes (/, /work/, /about/, /cv/, /contact/, /cv-print/
 * et les slugs de projets) sont identiques en FR et en EN.
 */
const routeSegments = {
	lettre: 'letter',
	'lettre-print': 'letter-print',
} as const;

const frToEn: Record<string, string> = routeSegments;
const enToFr: Record<string, string> = Object.fromEntries(
	Object.entries(routeSegments).map(([fr, en]) => [en, fr]),
);

/**
 * Retourne le chemin vers la page équivalente dans l'autre langue.
 * Seul le premier segment est traduit : c'est le seul qui porte le nom de la
 * route, les suivants sont des slugs de contenu communs aux deux langues.
 */
export function getAlternateLangPath(url: URL): string {
	const isEn = url.pathname === '/en' || url.pathname.startsWith('/en/');
	const source = isEn ? url.pathname.slice(3) : url.pathname;
	const map = isEn ? enToFr : frToEn;

	const segments = source.split('/').filter(Boolean);

	// Une page d'erreur n'a pas d'equivalent dans l'autre langue : on renvoie
	// vers l'accueil de cette langue plutot que vers une URL inexistante.
	if (segments[0] === '404') return isEn ? '/' : '/en/';

	if (segments.length > 0) segments[0] = map[segments[0]!] ?? segments[0]!;

	const path = segments.length > 0 ? `/${segments.join('/')}/` : '/';
	return isEn ? path : `/en${path}`;
}
