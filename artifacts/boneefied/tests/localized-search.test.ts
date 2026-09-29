import assert from 'node:assert/strict';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { createAnatomySearchIndex, searchAnatomy } from '../content/search.ts';

const index = createAnatomySearchIndex(content);

test('English and Spanish anatomy search return one canonical result per structure', () => {
  const english = searchAnatomy(index, 'skull', 8, 'en');
  const spanish = searchAnatomy(index, 'craneo', 8, 'es');
  assert.equal(english[0]?.structure.id, 'skull');
  assert.equal(spanish[0]?.structure.id, 'skull');
  assert.equal(spanish[0]?.matchedTerm, 'Cráneo');
  assert.deepEqual(searchAnatomy(index, 'cráneo', 8, 'es').map((match) => match.structure.id),
    spanish.map((match) => match.structure.id), 'omitting an accent must not alter results');
  assert.equal(searchAnatomy(index, 'skull', 8, 'es')[0]?.matchedTerm, 'Cráneo',
    'an English query should still show a Spanish result in Spanish mode');
  assert.equal(searchAnatomy(index, 'craneo', 8, 'en')[0]?.matchedTerm, 'Skull',
    'a Spanish query should still show an English result in English mode');
  for (const query of ['skull', 'craneo', 'cráneo', 'hallux']) {
    const matches = searchAnatomy(index, query, 8, 'es');
    assert.equal(matches.length, new Set(matches.map((match) => match.structure.id)).size, query);
  }
});