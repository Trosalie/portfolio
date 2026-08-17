// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * L'editeur de lettre de motivation est un outil personnel, pas une page du
 * portfolio : il ne doit pas etre en ligne.
 *
 * Ses quatre routes vivent dans `src/routes-dev/` et non dans `src/pages/`,
 * ou tout fichier devient une page. Elles ne sont rebranchees qu'en mode
 * `dev`. Le declencheur est volontairement le mode d'Astro et non une variable
 * d'environnement : rien a regler dans le workflow de deploiement, rien a
 * installer pour que cela marche sous Windows, et surtout aucun build ne peut
 * les produire — pas meme un `npm run build` lance a la main depuis le poste.
 *
 * Le bouton « Rediger ma lettre » du hero suit le meme signal, via
 * `import.meta.env.DEV` (src/pages/index.astro) : sans cela il resterait en
 * production en pointant vers une page absente.
 *
 * Pour ecrire une lettre : `npm run dev`, puis /lettre/ ou /en/letter/.
 */
const editeurDeLettre = {
    name: 'editeur-de-lettre-en-dev',
    hooks: {
        /** @type {(options: { command: string, injectRoute: (r: { pattern: string, entrypoint: string }) => void }) => void} */
        'astro:config:setup': ({ command, injectRoute }) => {
            if (command !== 'dev') return;

            for (const [pattern, entrypoint] of [
                ['/lettre', './src/routes-dev/lettre.astro'],
                ['/lettre-print', './src/routes-dev/lettre-print.astro'],
                ['/en/letter', './src/routes-dev/en/letter.astro'],
                ['/en/letter-print', './src/routes-dev/en/letter-print.astro'],
            ]) {
                injectRoute({ pattern, entrypoint });
            }
        },
    },
};

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
        editeurDeLettre,
        sitemap({
            i18n: {
                defaultLocale: 'fr',
                locales: { fr: 'fr-FR', en: 'en-US' },
            },
            // Les pages d'impression sont en noindex : elles n'ont rien a faire
            // dans le sitemap. Celles de la lettre n'existent deja plus dans un
            // build, la mention reste par securite si la regle changeait.
            filter: (page) => !/(cv-print|lettre-print|letter-print)/.test(page),
        }),
    ],
});
