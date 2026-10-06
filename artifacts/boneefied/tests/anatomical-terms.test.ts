import assert from 'node:assert/strict';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { anatomicalTerms, wordMeaning } from '../content/anatomical-terms.ts';
import { createAnatomySearchIndex, searchAnatomy } from '../content/search.ts';
import { createGlossaryIndex, filterGlossary } from '../content/glossary.ts';

const index = createAnatomySearchIndex(content);
const glossary = createGlossaryIndex(content);

test('every authored adjective resolves to a source-linked structure and its own bilingual meaning', () => {
  assert.equal(new Set(anatomicalTerms.map((term) => term.en)).size, anatomicalTerms.length);
  for (const term of anatomicalTerms) {
    const entry = glossary.find(({ structure }) => structure.id === term.structureId);
    assert.ok(entry, term.en);
    assert.ok(content.sources.some((source) => source.id === entry.structure.sourceId), term.en);
    for (const language of ['en', 'es'] as const) {
      const query = language === 'en' ? term.en : term.es;
      const match = searchAnatomy(index, query, 8, language).find((item) => item.structure.id === term.structureId);
      // Some Spanish adjectives are also the canonical noun (Sacro, Maxilar).
      // Preserve the exact structure definition and show the word below it.
      if (match?.kind === 'exact-canonical') assert.equal(match.term, undefined, query);
      else assert.equal(match?.term?.en, term.en, query);
      const meaning = wordMeaning(term, language);
      assert.match(meaning.definition, language === 'en' ? /^Of or relating to .+\.$/ : /^Perteneciente o relativo a .+\.$/, query);
      assert.ok(meaning.name, query);
    }
  }
});

test('acetabular is a word meaning, not merely a fuzzy correction to acetabulum', () => {
  for (const query of ['acetabular', 'ACETABULAR', 'acetablular']) {
    const match = searchAnatomy(index, query)[0];
    assert.equal(match?.structure.id, 'acetabulum', query);
    assert.equal(match?.term?.en, 'acetabular', query);
    assert.match(wordMeaning(match!.term!).definition, /Of or relating to the acetabulum.*socket.*hip joint/);
    assert.equal(filterGlossary(glossary, query)[0]?.term?.en, 'acetabular', query);
  }
  assert.equal(searchAnatomy(index, 'acetabular')[0]?.kind, 'exact-alias');
  assert.equal(searchAnatomy(index, 'acetabulum')[0]?.term, undefined);
  assert.equal(filterGlossary(glossary, 'acetabular', 'urinary-system').length, 0);
});

test('confusable adjectives stay distinct and practice aliases are not modified', () => {
  assert.equal(searchAnatomy(index, 'iliac')[0]?.structure.id, 'ilium');
  assert.equal(searchAnatomy(index, 'ileal')[0]?.structure.id, 'digestive-system-ileum');
  assert.match(wordMeaning(anatomicalTerms.find((term) => term.en === 'ileal')!).definition, /not the ilium/);
  const acetabulum = content.structures.find((structure) => structure.id === 'acetabulum')!;
  assert.ok(!acetabulum.acceptedAliases.includes('acetabular'));
});
