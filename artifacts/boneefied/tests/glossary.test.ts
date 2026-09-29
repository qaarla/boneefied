import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { content } from '../content/canonical.ts';
import { createGlossaryIndex, definitionForStructure, filterGlossary, glossaryCoverage } from '../content/glossary.ts';
import { createAnatomySearchIndex, searchAnatomy } from '../content/search.ts';

const catalogIndex = createAnatomySearchIndex(content);
const glossary = createGlossaryIndex(content);

test('published glossary entries come only from source-verified public catalog structures', () => {
  const coverage = glossaryCoverage(content);
  assert.equal(coverage.eligible, 1126);
  assert.equal(coverage.published, coverage.eligible);
  assert.deepEqual(coverage.unresolved, []);
  assert.deepEqual(coverage.orphaned, []);
  assert.deepEqual(coverage.duplicates, []);
  assert.equal(new Set(glossary.map(({ structure }) => structure.id)).size, glossary.length);
  for (const entry of glossary) {
    assert.equal(entry.structure.verificationStatus, 'verified');
    assert.equal(content.sources.find((source) => source.id === entry.structure.sourceId)?.verificationStatus, 'verified', entry.structure.id);
    assert.ok(entry.definition.length >= 38, entry.structure.id);
    assert.match(entry.definition, /[.!?]$/, entry.structure.id);
    assert.doesNotMatch(entry.definition, /\b(?:TODO|TBD|placeholder|lorem ipsum)\b/i, entry.structure.id);
    assert.equal(entry.definition, definitionForStructure(entry.structure.id));
  }
});

test('representative source-linked entries identify anatomy from multiple systems', () => {
  const expectations: Array<[string, RegExp]> = [
    ['Hallux', /hallux|great toe/i],
    ['Temporalis', /temporal.*mandible|temporal.*coronoid/i],
    ['Glomerulus', /capillar/i],
    ['Acetabulum', /socket.*femur/i],
    ['Pituitary gland', /sella turcica|hypothalamus/i],
    ['Jejunum', /duodenum.*ileum/i],
    ['Trachea', /larynx.*bronchi/i],
    ['Nephron', /renal corpuscle.*tubule/i],
    ['Median cubital vein', /elbow.*cephalic.*basilic/i],
    ['Corpus luteum', /post.ovulatory.*ovarian/i],
    ['Pancreatic alpha cell', /glucagon/i],
    ['Pancreatic beta cell', /insulin/i],
    ['Pancreatic delta cell', /somatostatin/i],
    ['Hypothalamic neurosecretory cell', /portal blood.*anterior pituitary.*posterior pituitary/i],
  ];
  for (const [term, expected] of expectations) {
    const match = searchAnatomy(catalogIndex, term)[0];
    assert.ok(match, term);
    const entry = glossary.find(({ structure }) => structure.id === match.structure.id);
    assert.ok(entry, term);
    assert.match(entry.definition, expected, term);
    assert.ok(entry.module.title && entry.structure.category, term);
  }
});

test('aliases resolve to canonical entries without additional glossary records', () => {
  const hallux = filterGlossary(glossary, 'Hallux');
  assert.equal(hallux[0]?.structure.id, 'phalanges-foot');
  assert.equal(hallux[0]?.structure.canonicalName, 'Phalanges of foot');
  assert.equal(hallux.filter(({ structure }) => structure.id === 'phalanges-foot').length, 1);
  assert.equal(filterGlossary(glossary, 'temporal muscle')[0]?.structure.canonicalName, 'Temporalis');
  assert.equal(filterGlossary(glossary, 'great-toe')[0]?.structure.id, 'phalanges-foot');
  assert.equal(filterGlossary(glossary, 'glomerlus')[0]?.structure.canonicalName, 'Glomerulus');
  assert.equal(filterGlossary(glossary, 'acetablum')[0]?.structure.canonicalName, 'Acetabulum');
  assert.equal(filterGlossary(glossary, 'qzxqzxqzx').length, 0);
});

test('alphabetic browse and optional system filter use only local entries', () => {
  const entries = filterGlossary(glossary, '');
  assert.equal(entries.length, glossary.length);
  assert.ok(entries.every((entry, index) => index === 0
    || entries[index - 1].structure.canonicalName.localeCompare(entry.structure.canonicalName) <= 0));
  const renal = filterGlossary(glossary, '', 'urinary-system');
  assert.equal(renal.length, 49);
  assert.ok(renal.every(({ module }) => module.id === 'urinary-system'));
  assert.equal(filterGlossary(glossary, 'glomerulus', 'digestive-system').length, 0);

  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const implementation = readFileSync(path.join(root, 'content/glossary.ts'), 'utf8');
  assert.doesNotMatch(implementation, /\b(?:fetch|XMLHttpRequest|axios|WebSocket)\s*\(/);
  assert.match(implementation, /createAnatomySearchIndex\(catalog\)/);
  assert.match(implementation, /searchAnatomy\(available, query, available\.length\)/);
});