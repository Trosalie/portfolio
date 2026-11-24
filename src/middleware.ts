import { defineMiddleware } from 'astro:middleware';

import { frenchHtml } from './typography';

/**
 * Les espaces insecables des pages francaises (voir src/typography.ts).
 *
 * Le CV en est exclu : son texte vient de l'outil `candidatures`, il tient sur une
 * page, et des lecteurs automatiques relisent son PDF.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	const isHtml = response.headers.get('content-type')?.includes('text/html');
	if (!isHtml || /^\/(cv|cv-print)\/?$/.test(context.url.pathname)) return response;
	return new Response(frenchHtml(await response.text()), response);
});
