import assert from 'node:assert/strict';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { createAnatomySearchIndex, normalizeSearchText, searchAnatomy } from '../content/search.ts';

const index = createAnatomySearchIndex(content);
const first = (query: string) => searchAnatomy(index, query)[0];

test('the current catalog resolves the requested exact terms and synonyms', () => {
  assert.equal(first('Hallux')?.structure.id, 'phalanges-foot');
  assert.equal(first('Hallux')?.matchedTerm, 'Hallux');
  assert.equal(first('Hallux')?.kind, 'exact-alias');
  assert.equal(first('Temporalis')?.structure.canonicalName, 'Temporalis');
  assert.equal(first('Temporalis')?.kind, 'exact-canonical');
  assert.equal(first('temporal muscle')?.structure.canonicalName, 'Temporalis');
  assert.equal(first('temporal muscle')?.kind, 'exact-alias');
  assert.equal(first('glomerulus')?.structure.canonicalName.toLowerCase(), 'glomerulus');
  assert.equal(first('acetabulum')?.structure.canonicalName, 'Acetabulum');
});

test('confident misspellings and transpositions rank their intended terms first', () => {
  for (const [query, expectedId] of [
    ['Hallox', 'phalanges-foot'],
    ['glomerlus', 'urinary-system-glomerulus'],
    ['acetablum', 'acetabulum'],
    ['temporlais', 'temporalis'],
  ]) {
    const match = first(query);
    assert.equal(match?.structure.id, expectedId, query);
    assert.equal(match?.kind, 'fuzzy', query);
  }
});

test('normalization covers punctuation, spaces, hyphens, apostrophes, and common plurals', () => {
  assert.equal(normalizeSearchText("  TEMPORAL---MUSCLE’s! "), 'temporal muscles');
  assert.equal(first('  temporal--muscle  ')?.structure.id, 'temporalis');
  assert.equal(first('great-toe')?.structure.id, 'phalanges-foot');
  assert.equal(first('toe-bones')?.structure.id, 'phalanges-foot');
  assert.equal(first('glomeruli')?.structure.id, 'urinary-system-glomerulus');
});

test('exact canonical outranks exact alias, partial, and fuzzy without weak guesses', () => {
  const existing = content.structures.find((item) => item.id === 'phalanges-foot');
  assert.ok(existing);
  const fixtureIndex = createAnatomySearchIndex({
    ...content,
    structures: [...content.structures, { ...existing, id: 'fixture-hallux', canonicalName: 'Hallux', acceptedAliases: [] }],
  });
  assert.equal(searchAnatomy(fixtureIndex, 'hallux')[0]?.structure.id, 'fixture-hallux');
  assert.equal(searchAnatomy(fixtureIndex, 'hallux')[1]?.structure.id, 'phalanges-foot');
  assert.ok(searchAnatomy(index, 'Temporalis').every((match) => match.kind !== 'fuzzy'));
  assert.ok(searchAnatomy(index, 'glomerulus').every((match) => match.kind !== 'fuzzy'));
  assert.equal(searchAnatomy(index, 'qzxqzxqzx').length, 0);
  assert.equal(searchAnatomy(index, 'zxq').length, 0);
  assert.equal(searchAnatomy(index, '').length, 0);
});