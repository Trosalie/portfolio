export const languages = {
	fr: 'Français',
	en: 'English',
};

export const defaultLang = 'fr';

export const ui = {
	fr: {
		// Métadonnées par défaut (pages sans title/description explicites)
		'meta.default.title': 'ThibaultROSALIE- Portfolio',
		'meta.default.description':
			'Portfolio de Thibault ROSALIE, développeur web full stack issu du BUT Informatique, en recherche de poste.',

		// Accessibilite
		'a11y.skipToContent': 'Aller au contenu',

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
		'404.meta.title': 'Page introuvable | Thibault ROSALIE',
		'404.meta.desc': "Erreur 404 : cette page n'existe pas ou a été déplacée.",
		'404.title': 'Page introuvable',
		'404.tagline': "Cette page n'existe pas ou a été déplacée.",
		'404.back': "← Retour à l'accueil",

		// WorkInProgress
		'wip.subtitle': 'Cette page est en cours de construction.',
		'wip.text': 'Je travaille activement dessus. Revenez bientôt !',
		'wip.back': '← Retour à l\'accueil',

		// Page d'accueil
		'index.hero.title': "Bonjour, je m'appelle Thibault ROSALIE",
		'index.hero.tagline': "Développeur full stack au terme d'un BUT Informatique, je recherche un poste où mettre en pratique ce que j'ai appris.",
		'index.hero.portrait.alt': 'Photo de profil de Thibault ROSALIE',
		'index.hero.role.dev': 'Développeur',
		'index.hero.role.fullstack': 'Full Stack',
		'index.hero.cta': 'Voir mon CV',
		'index.hero.letterCta': 'Rédiger ma lettre',
		'index.projects.title': 'Projets sélectionnés',
		'index.projects.desc': 'Découvrez ci-dessous une sélection de mes projets récents réalisés dans le cadre de mes études et de mes projets personnels.',
		'index.projects.cta': 'Voir tous les projets',
		'index.skills.title': 'Compétences',
		'index.skills.desc': "Le BUT Informatique m'a permis de développer mes compétences dans différents domaines du développement logiciel et web.",
		'index.skills.backend': 'Back-end',
		'index.skills.frontend': 'Front-end',
		'index.skills.tools': 'Outils & Méthodes',

		// Encart compétences (composant Skills)
		'skills.backend.text':
			"PHP, Laravel, Python : développement d'applications web robustes, tests unitaires avec PHPUnit et conception orientée objet.",
		'skills.frontend.text':
			"Angular, HTML/CSS : création d'interfaces modernes et responsives, avec une approche mobile-first et un souci du détail.",
		'skills.tools.text':
			'Git, Docker, MySQL, SCRUM : environnements conteneurisés, versioning collaboratif et gestion de projet agile.',

		// Projets
		'work.title': 'Mes Projets',
		'work.tagline': 'Découvrez mes projets les plus récents pour avoir un aperçu de mon expérience.',
		'work.meta.title': 'Mes Projets | Thibault ROSALIE',
		'work.meta.desc': 'Découvrez les projets récents de Thibault ROSALIE',
		'work.card.featured': 'Projet le plus récent',
		'work.back': 'Retour aux projets',
		'work.github': 'Voir sur GitHub',
		'work.demo': 'Voir la démo',
		// Les intitulés de section vivent ici et non dans le contenu : les deux
		// versions d'un projet ne peuvent plus les nommer différemment.
		'work.section.about': 'Le projet',
		'work.section.features': 'Fonctionnalités',
		'work.section.stack': 'Stack technique',
		'work.section.gallery': 'En images',
		'work.section.role': 'Mon rôle',
		'work.section.more': 'Pour aller plus loin',
		'work.gallery.roleDescription': 'carrousel',
		'work.gallery.label': "Captures d'écran du projet",
		'work.gallery.previous': 'Capture précédente',
		'work.gallery.next': 'Capture suivante',
		'work.gallery.position': 'Capture {n} sur {total}',

		// Contact
		'contact.title': 'Me contacter',
		'contact.subtitle': "Une question, une opportunité, un projet ? N'hésitez pas à m'écrire, je vous répondrai dans les plus brefs délais.",
		'contact.name': 'Nom',
		'contact.email': 'Adresse e-mail',
		'contact.subject': 'Sujet',
		'contact.message': 'Message',
		'contact.name.placeholder': 'Jean Dupont',
		'contact.email.placeholder': 'jean.dupont@email.com',
		'contact.subject.placeholder': 'Proposition de poste, collaboration...',
		'contact.message.placeholder': 'Décrivez votre demande...',
		'contact.submit': 'Envoyer le message',
		'contact.details': 'Coordonnées',
		'contact.availability': 'Disponibilité',
		'contact.availability.text': "Au terme de mon BUT Informatique à l'IUT de Bayonne. À la recherche d'un poste de développeur full stack.",
		'contact.meta.title': 'Me contacter | Thibault ROSALIE',
		'contact.meta.desc': 'Envoyez-moi un message pour toute proposition de collaboration ou question.',
		// Sujet de l'e-mail que Formspree envoie : les deux langues partagent le
		// meme endpoint, c'est lui qui distingue les demandes dans la boite mail.
		'contact.mail.subject': 'Portfolio (FR) : nouveau message',
		'contact.sent.title': 'Message envoyé',
		'contact.sent.text': 'Merci, votre message est bien parti. Je vous réponds dès que possible.',
		// Libelle du piege a robots. Le champ est masque et retire du parcours
		// clavier, mais un lecteur d'ecran mal configure pourrait l'atteindre.
		'contact.honeypot': 'Ne remplissez pas ce champ si vous êtes humain',

		// À propos
		'about.meta.title': 'À propos | Thibault ROSALIE',
		'about.meta.desc': 'À propos de Thibault ROSALIE- Développeur full stack issu du BUT Informatique',
		'about.wip.title': 'À propos',

		// Barre des pages d'impression (CV et lettre)
		'print.back': 'Retour',
		'print.action': 'Imprimer / Sauvegarder en PDF',

		// CV
		'cv.save': 'Sauvegarder en PDF',
		'cv.download': 'Télécharger le PDF',
		'cv.meta.title': 'CV | Thibault ROSALIE',
		'cv.meta.desc': 'Curriculum Vitae de ThibaultROSALIE- Développeur FullStack issu du BUT Informatique',
		'cv.print.title': 'CV – Thibault ROSALIE(impression)',
		'cv.print.toolbar': 'Aperçu avant impression du CV de Thibault ROSALIE',

		// Lettre de motivation
		'letter.meta.title': 'Lettre de motivation | Thibault ROSALIE',
		'letter.meta.desc': 'Rédaction et impression PDF de la lettre de motivation de Thibault ROSALIE.',
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
		'letter.form.title.placeholder': 'Ex: Candidature au poste de developpeur full stack',
		'letter.preview.header': 'Lettre de motivation',
		'letter.default.subject': 'Objet : Candidature',
		'letter.editor.aria': 'Editeur de lettre de motivation',
		'letter.preview.aria': 'Apercu lettre de motivation',
		'letter.doc.aria': 'Lettre de motivation de Thibault ROSALIE',
		'letter.print.title': 'Lettre de motivation - Thibault ROSALIE(impression)',
		'letter.print.toolbar': 'Apercu avant impression - Lettre de motivation',
	},
	en: {
		// Métadonnées par défaut (pages sans title/description explicites)
		'meta.default.title': 'Thibault ROSALIE- Portfolio',
		'meta.default.description':
			'Portfolio of Thibault ROSALIE, full stack web developer completing a Computer Science degree and looking for a position.',

		// Accessibility
		'a11y.skipToContent': 'Skip to content',

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
		'404.meta.title': 'Page not found | Thibault ROSALIE',
		'404.meta.desc': '404 error: this page does not exist or has been moved.',
		'404.title': 'Page not found',
		'404.tagline': 'This page does not exist or has been moved.',
		'404.back': '← Back to home',

		// WorkInProgress
		'wip.subtitle': 'This page is under construction.',
		'wip.text': 'I am actively working on it. Come back soon!',
		'wip.back': '← Back to home',

		// Page d'accueil
		'index.hero.title': "Hello, my name is Thibault ROSALIE",
		'index.hero.tagline': 'Full stack developer completing a Computer Science degree, I am looking for a position where I can put what I have learned into practice.',
		'index.hero.portrait.alt': 'Profile picture of Thibault ROSALIE',
		'index.hero.role.dev': 'Developer',
		'index.hero.role.fullstack': 'Full Stack',
		'index.hero.cta': 'View my Resume',
		'index.hero.letterCta': 'Write my Cover Letter',
		'index.projects.title': 'Selected Projects',
		'index.projects.desc': 'Discover below a selection of my recent projects completed as part of my studies and personal projects.',
		'index.projects.cta': 'View all projects',
		'index.skills.title': 'Skills',
		'index.skills.desc': 'My Computer Science degree let me develop my skills across various areas of software and web development.',
		'index.skills.backend': 'Back-end',
		'index.skills.frontend': 'Front-end',
		'index.skills.tools': 'Tools & Methods',

		// Skills box (Skills component)
		'skills.backend.text':
			'PHP, Laravel, Python: building robust web applications, unit testing with PHPUnit and object-oriented design.',
		'skills.frontend.text':
			'Angular, HTML/CSS: building modern, responsive interfaces with a mobile-first approach and an eye for detail.',
		'skills.tools.text':
			'Git, Docker, MySQL, SCRUM: containerised environments, collaborative versioning and agile project management.',

		// Projects
		'work.title': 'My Projects',
		'work.tagline': 'Discover my most recent projects to get an overview of my experience.',
		'work.meta.title': 'My Projects | Thibault ROSALIE',
		'work.meta.desc': 'Discover the recent projects of Thibault ROSALIE',
		'work.card.featured': 'Most recent project',
		'work.back': 'Back to projects',
		'work.github': 'View on GitHub',
		'work.demo': 'View demo',
		'work.section.about': 'The project',
		'work.section.features': 'Features',
		'work.section.stack': 'Tech stack',
		'work.section.gallery': 'In pictures',
		'work.section.role': 'My role',
		'work.section.more': 'Going further',
		'work.gallery.roleDescription': 'carousel',
		'work.gallery.label': 'Project screenshots',
		'work.gallery.previous': 'Previous screenshot',
		'work.gallery.next': 'Next screenshot',
		'work.gallery.position': 'Screenshot {n} of {total}',

		// Contact
		'contact.title': 'Contact me',
		'contact.subtitle': "A question, an opportunity, a project? Don't hesitate to write to me, I'll get back to you as soon as possible.",
		'contact.name': 'Name',
		'contact.email': 'Email address',
		'contact.subject': 'Subject',
		'contact.message': 'Message',
		'contact.name.placeholder': 'John Doe',
		'contact.email.placeholder': 'john.doe@email.com',
		'contact.subject.placeholder': 'Job opportunity, collaboration...',
		'contact.message.placeholder': 'Describe your request...',
		'contact.submit': 'Send message',
		'contact.details': 'Contact details',
		'contact.availability': 'Availability',
		'contact.availability.text': 'Completing my Computer Science degree at IUT de Bayonne. Looking for a full stack developer position.',
		'contact.meta.title': 'Contact me | Thibault ROSALIE',
		'contact.meta.desc': 'Send me a message for any collaboration proposal or question.',
		'contact.mail.subject': 'Portfolio (EN): new message',
		'contact.sent.title': 'Message sent',
		'contact.sent.text': 'Thank you, your message is on its way. I will get back to you as soon as possible.',
		'contact.honeypot': 'Leave this field empty if you are human',

		// About
		'about.meta.title': 'About | Thibault ROSALIE',
		'about.meta.desc': 'About Thibault ROSALIE- Full stack developer with a Computer Science degree',
		'about.wip.title': 'About',

		// Print page toolbar (resume and cover letter)
		'print.back': 'Back',
		'print.action': 'Print / Save as PDF',

		// Resume
		'cv.save': 'Save as PDF',
		'cv.download': 'Download the PDF',
		'cv.meta.title': 'Resume | Thibault ROSALIE',
		'cv.meta.desc': 'Curriculum Vitae of ThibaultROSALIE- FullStack Developer with a Computer Science degree',
		'cv.print.title': 'Resume – Thibault ROSALIE(print)',
		'cv.print.toolbar': "Print preview of Thibault ROSALIE's resume",

		// Cover letter
		'letter.meta.title': 'Cover Letter | Thibault ROSALIE',
		'letter.meta.desc': 'Write and print the PDF cover letter of Thibault ROSALIE.',
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
		'letter.form.title.placeholder': 'E.g. Application for a full stack developer position',
		'letter.preview.header': 'Cover Letter',
		'letter.default.subject': 'Subject: Application',
		'letter.editor.aria': 'Cover letter editor',
		'letter.preview.aria': 'Cover letter preview',
		'letter.doc.aria': 'Cover letter of Thibault ROSALIE',
		'letter.print.title': 'Cover Letter - Thibault ROSALIE(print)',
		'letter.print.toolbar': 'Print preview - Cover Letter',
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
