import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../app/(tabs)/(study)/index.tsx', import.meta.url), 'utf8');

test('only the home browse shortcut is removed without leaving a spacer or replacement control', () => {
  assert.doesNotMatch(page, /browseGlossary|glossaryLink/);
  const search = page.slice(page.indexOf('<View style={searchStyles.container}>'), page.indexOf('<Heading testID="study-explore-heading"'));
  assert.match(search, /<TextInput[^\n]*\/>\s*\{query\.trim\(\)\.length > 0/);
  assert.match(page, /container: \{ gap: 8 \}/);
});

test('search suggestions retain definitions and their canonical glossary and study destinations', () => {
  assert.match(page, /definitionForStructure/);
  assert.match(page, /searchAnatomy/);
  assert.match(page, /if \(definition\) router\.push\(\{ pathname: '\/glossary\/\[id\]', params: \{ id: match\.structure\.id, q: query \} \}\)/);
  assert.match(page, /else router\.push\(`\/module\/\$\{match\.module\.id\}`\)/);
  assert.match(page, /searchStyles\.definition/);
});

test('glossary index, canonical term detail and word-part deep-link routes remain available', () => {
  for (const route of ['index.tsx', '[id].tsx', 'word-parts.tsx', 'word-part/[id].tsx']) {
    assert.ok(existsSync(new URL(`../app/(tabs)/(study)/glossary/${route}`, import.meta.url)), route);
  }
});
