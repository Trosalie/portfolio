export const languages = {
	fr: 'Français',
	en: 'English',
};

export const defaultLang = 'fr';

export const ui = {
	fr: {
		// Métadonnées par défaut (pages sans title/description explicites)
		'meta.default.title': "Thibault Rosalie, développeur full stack",
		'meta.default.description': "Thibault Rosalie, développeur full stack diplômé du BUT Informatique à Bayonne : ses projets, son CV et ses coordonnées.",
		'meta.og.alt': "Thibault Rosalie, développeur full stack, avec ses projets ChronoPotes et Seenit",

		// Accessibilite
		'a11y.skipToContent': 'Aller au contenu',

		// Navigation
		'nav.home': 'Accueil',
		'nav.work': 'Projets',
		'nav.about': 'À propos',
		'nav.cv': 'CV',
		'nav.contact': 'Me contacter',

		// ContactCTA
		'contactcta.title': "Vous recrutez un développeur full stack ?",

		// Actions communes (accueil, bloc de contact, à propos)
		'cta.cv': 'Lire le CV',
		'cta.contact': "M'écrire",


		// Page 404
		'404.meta.title': "Page introuvable | Thibault Rosalie",
		'404.meta.desc': "Erreur 404 : cette page n'existe pas ou a été déplacée.",
		'404.title': 'Page introuvable',
		'404.tagline': "Cette page n'existe pas ou a été déplacée.",
		'404.back': "Retour à l'accueil",


		// Page d'accueil
		'index.hero.title': "Je conçois et je développe des applications web, de la base de données jusqu'au dernier détail de l'interface.",
		'index.hero.tagline': "Diplômé du BUT Informatique à Bayonne, je cherche un premier poste de développeur full stack.",
		'index.hero.portrait.alt': "Portrait de Thibault Rosalie",
		'index.projects.cta': 'Voir tous les projets',


		// Projets
		'work.title': 'Projets',
		'work.meta.title': "Projets | Thibault Rosalie",
		'work.meta.desc': "Les projets de Thibault Rosalie, développeur full stack : ChronoPotes, Seenit, BluePoint et les projets du BUT Informatique.",
		'work.back': 'Retour aux projets',
		'work.github': 'Voir sur GitHub',
		'work.demo': 'Voir la démo',
		// La fiche en tete de la page projet.
		'work.fact.period': 'Période',
		'work.fact.context': 'Cadre',
		'work.fact.team': 'Équipe',
		'work.fact.tech': 'Technologies',
		'work.next': 'Projet suivant',
		'work.next.label': 'Projet suivant : {title}',
		// Les intitulés de section vivent ici et non dans le contenu : les deux
		// versions d'un projet ne peuvent plus les nommer différemment.
		'work.viewer.open': 'Agrandir',
		'work.viewer.fit': 'Voir entière',
		'work.viewer.close': 'Fermer',
		'work.viewer.position': '{n} sur {total}',
		'work.viewer.capture': 'Capture',
		'work.section.about': 'Le projet',
		'work.section.features': 'Fonctionnalités',
		'work.section.stack': 'Stack technique',
		'work.section.gallery': 'En images',
		'work.section.role': 'Mon rôle',
		'work.section.more': 'Pour aller plus loin',
		'work.section.identity': "Identité visuelle",
		'work.identity.palette': "Palette",
		'work.identity.fonts': "Polices",
		'work.identity.piece': "Pièce d'interface",
		'specimen.seenit.film': "Mulholland Drive",
		'specimen.seenit.seen': "Vu le 14 novembre",
		'specimen.seenit.rating': "Note : 4,5 sur 5",
		'specimen.chrono.value': "04,96",
		'specimen.chrono.tier': "Masterclass",
		'work.gallery.roleDescription': 'carrousel',
		'work.gallery.label': "Captures d'écran du projet",
		'work.gallery.previous': 'Capture précédente',
		'work.gallery.next': 'Capture suivante',
		'work.gallery.position': 'Capture {n} sur {total}',

		// Contact
		'contact.title': 'Me contacter',
		'contact.subtitle': "Un poste à pourvoir ou une question sur un projet : ce formulaire m'arrive directement par e-mail.",
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
		'contact.availability.text': "Diplômé d'un BUT Informatique de l'IUT de Bayonne. À la recherche d'un poste de développeur full stack.",
		'contact.meta.title': "Contact | Thibault Rosalie",
		'contact.meta.desc': "Écrire à Thibault Rosalie, développeur full stack, pour un poste ou une question sur un projet.",
		// Sujet de l'e-mail que Formspree envoie : les deux langues partagent le
		// meme endpoint, c'est lui qui distingue les demandes dans la boite mail.
		'contact.mail.subject': 'Portfolio (FR) : nouveau message',
		'contact.sent.title': 'Message envoyé',
		'contact.sent.text': 'Merci, votre message est bien parti. Je vous réponds dès que possible.',
		// Libelle du piege a robots. Le champ est masque et retire du parcours
		// clavier, mais un lecteur d'ecran mal configure pourrait l'atteindre.
		'contact.honeypot': 'Ne remplissez pas ce champ si vous êtes humain',

		// À propos
		'about.meta.title': "À propos | Thibault Rosalie",
		'about.meta.desc': "Thibault Rosalie, développeur full stack diplômé du BUT Informatique à Bayonne, cherche un premier poste.",
		'about.title': "À propos",

		// Barre des pages d'impression du CV
		'print.back': 'Retour',
		'print.action': 'Imprimer / Sauvegarder en PDF',

		// CV
		'cv.save': 'Sauvegarder en PDF',
		'cv.download': 'Télécharger le PDF',
		'cv.meta.title': "CV | Thibault Rosalie",
		'cv.meta.desc': "CV de Thibault Rosalie, développeur full stack diplômé du BUT Informatique, à lire en ligne ou à télécharger en PDF.",
		'cv.print.title': "CV | Thibault Rosalie (impression)",
		'cv.print.toolbar': "Aperçu avant impression du CV de Thibault Rosalie",

	},
	en: {
		// Métadonnées par défaut (pages sans title/description explicites)
		'meta.default.title': "Thibault Rosalie, full stack developer",
		'meta.default.description': "Thibault Rosalie, full stack developer with a Computer Science degree (BUT) from Bayonne: projects, resume and contact details.",
		'meta.og.alt': "Thibault Rosalie, full stack developer, with the ChronoPotes and Seenit projects",

		// Accessibility
		'a11y.skipToContent': 'Skip to content',

		// Navigation
		'nav.home': 'Home',
		'nav.work': 'Projects',
		'nav.about': 'About',
		'nav.cv': 'Resume',
		'nav.contact': 'Contact me',

		// ContactCTA
		'contactcta.title': "Hiring a full stack developer?",

		// Shared actions (home, contact block, about)
		'cta.cv': 'Read my resume',
		'cta.contact': 'Get in touch',


		// Page 404
		'404.meta.title': "Page not found | Thibault Rosalie",
		'404.meta.desc': '404 error: this page does not exist or has been moved.',
		'404.title': 'Page not found',
		'404.tagline': 'This page does not exist or has been moved.',
		'404.back': "Back to home",


		// Page d'accueil
		'index.hero.title': "I design and build web applications, from the database to the last detail of the interface.",
		'index.hero.tagline': "I hold a Computer Science degree (BUT) from Bayonne and I'm looking for my first full stack developer role.",
		'index.hero.portrait.alt': "Portrait of Thibault Rosalie",
		'index.projects.cta': 'View all projects',


		// Projects
		'work.title': 'Projects',
		'work.meta.title': "Projects | Thibault Rosalie",
		'work.meta.desc': "Projects by Thibault Rosalie, full stack developer: ChronoPotes, Seenit, BluePoint and university projects.",
		'work.back': 'Back to projects',
		'work.github': 'View on GitHub',
		'work.demo': 'View demo',
		'work.fact.period': 'Date',
		'work.fact.context': 'Context',
		'work.fact.team': 'Team',
		'work.fact.tech': 'Technologies',
		'work.next': 'Next project',
		'work.next.label': 'Next project: {title}',
		'work.viewer.open': 'Enlarge',
		'work.viewer.fit': 'Fit to screen',
		'work.viewer.close': 'Close',
		'work.viewer.position': '{n} of {total}',
		'work.viewer.capture': 'Screenshot',
		'work.section.about': 'The project',
		'work.section.features': 'Features',
		'work.section.stack': 'Tech stack',
		'work.section.gallery': 'In pictures',
		'work.section.role': 'My role',
		'work.section.more': 'Going further',
		'work.section.identity': "Visual identity",
		'work.identity.palette': "Palette",
		'work.identity.fonts': "Typefaces",
		'work.identity.piece': "Interface piece",
		'specimen.seenit.film': "Mulholland Drive",
		'specimen.seenit.seen': "Watched on 14 November",
		'specimen.seenit.rating': "Rating: 4.5 out of 5",
		'specimen.chrono.value': "04.96",
		'specimen.chrono.tier': "Masterclass",
		'work.gallery.roleDescription': 'carousel',
		'work.gallery.label': 'Project screenshots',
		'work.gallery.previous': 'Previous screenshot',
		'work.gallery.next': 'Next screenshot',
		'work.gallery.position': 'Screenshot {n} of {total}',

		// Contact
		'contact.title': 'Contact me',
		'contact.subtitle': "A role to fill or a question about a project: this form goes straight to my inbox.",
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
		'contact.availability.text': 'Graduated with a Computer Science degree from IUT de Bayonne. Looking for a full stack developer position.',
		'contact.meta.title': "Contact | Thibault Rosalie",
		'contact.meta.desc': "Write to Thibault Rosalie, full stack developer, about a role or a question on a project.",
		'contact.mail.subject': 'Portfolio (EN): new message',
		'contact.sent.title': 'Message sent',
		'contact.sent.text': 'Thank you, your message is on its way. I will get back to you as soon as possible.',
		'contact.honeypot': 'Leave this field empty if you are human',

		// About
		'about.meta.title': "About | Thibault Rosalie",
		'about.meta.desc': "Thibault Rosalie, full stack developer with a Computer Science degree (BUT) from Bayonne, looking for a first role.",
		'about.title': "About",

		// Resume print page toolbar
		'print.back': 'Back',
		'print.action': 'Print / Save as PDF',

		// Resume
		'cv.save': 'Save as PDF',
		'cv.download': 'Download the PDF',
		'cv.meta.title': "Resume | Thibault Rosalie",
		'cv.meta.desc': "Resume of Thibault Rosalie, full stack developer with a Computer Science degree, to read online or download as a PDF.",
		'cv.print.title': "Resume | Thibault Rosalie (print)",
		'cv.print.toolbar': "Print preview of Thibault Rosalie's resume",

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
 * Retourne le chemin vers la page équivalente dans l'autre langue. Toutes les
 * routes (/, /work/, /about/, /cv/, /contact/, /cv-print/ et les slugs de
 * projets) portent le même nom en FR et en EN : seul le préfixe /en change.
 */
export function getAlternateLangPath(url: URL): string {
	const isEn = url.pathname === '/en' || url.pathname.startsWith('/en/');
	const source = isEn ? url.pathname.slice(3) : url.pathname;

	const segments = source.split('/').filter(Boolean);

	// Une page d'erreur n'a pas d'equivalent dans l'autre langue : on renvoie
	// vers l'accueil de cette langue plutot que vers une URL inexistante.
	if (segments[0] === '404') return isEn ? '/' : '/en/';

	const path = segments.length > 0 ? `/${segments.join('/')}/` : '/';
	return isEn ? path : `/en${path}`;
}
