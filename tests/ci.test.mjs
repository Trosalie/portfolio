import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// Les tests importent du TypeScript et utilisent un motif de fichiers : il faut
// Node 22.18 ou plus, en local comme sur la CI.
test('la version de Node est déclarée', () => {
	const pkg = JSON.parse(read('package.json'));
	assert.equal(pkg.engines?.node, '>=22.18');
});

test('la CI lance les tests avant de déployer', () => {
	const workflow = read('.github/workflows/deploy.yml');
	assert.match(workflow, /node-version:\s*22\b/);
	const testStep = workflow.indexOf('run: npm test');
	const deployStep = workflow.indexOf('rsync');
	assert.ok(testStep > 0 && testStep < deployStep, 'npm test absent ou après le déploiement');
});

test('les tests de la CI trouvent Chrome', () => {
	const step = read('.github/workflows/deploy.yml').split('- name: Tests')[1].split('- name:')[0];
	assert.ok(step.includes('PUPPETEER_EXECUTABLE_PATH: ${{ steps.chrome.outputs.chrome-path }}'), step);
});

// Un Chrome qui ne demarre pas doit donner un test rouge, pas un deploiement qui
// attend la limite de GitHub.
test('sans Chrome, les tests échouent au lieu d’attendre', async () => {
	const helper = new URL('./browser.mjs', import.meta.url).href;
	const result = await new Promise((resolve) => {
		execFile(
			process.execPath,
			['--input-type=module', '-e', `import { openSite } from '${helper}'; await openSite().catch(() => {});`],
			{ timeout: 20000, env: { ...process.env, PUPPETEER_EXECUTABLE_PATH: '/pas/de/chrome' } },
			(error) => resolve(error?.killed ? 'bloqué' : 'terminé'),
		);
	});
	assert.equal(result, 'terminé');
	assert.match(read('.github/workflows/deploy.yml').split('- name: Tests')[1].split('- name:')[0], /timeout-minutes: \d+/);
});
