import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ui } from '../src/i18n/ui.ts';

// `useTranslations` retombe sur le francais quand une cle manque en anglais :
// sans ce test, un oubli passerait inapercu et la page anglaise afficherait du
// francais.
test('chaque clé existe dans les deux langues', () => {
	assert.deepEqual(Object.keys(ui.en).sort(), Object.keys(ui.fr).sort());
});
