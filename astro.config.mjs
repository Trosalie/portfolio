// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    // Requis pour les URLs absolues : canonical, og:url, hreflang et sitemap.
    site: 'https://trosalie.alwaysdata.net',
    output: 'static',
    i18n: {
        defaultLocale: 'fr',
        locales: ['fr', 'en'],
        routing: {
            prefixDefaultLocale: false,
        },
    },
    integrations: [
        sitemap({
            i18n: {
                defaultLocale: 'fr',
                locales: { fr: 'fr-FR', en: 'en-US' },
            },
            // Les pages d'impression du CV sont en noindex : elles n'ont rien a
            // faire dans le sitemap.
            filter: (page) => !/cv-print/.test(page),
        }),
    ],
});
