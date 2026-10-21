import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { content } from '../content/canonical.ts';

const page = readFileSync(new URL('../app/(tabs)/(study)/index.tsx', import.meta.url), 'utf8');

test('Learning modules heading is independently centered without the display counter', () => {
  const heading = page.match(/<View onLayout=\{\(event\) => \{ learningHeading\.current[\s\S]*?<\/View>/)?.[0];
  assert.ok(heading);
  assert.match(heading, /alignSelf: 'stretch'/);
  assert.match(heading, /textAlign: 'center'/);
  assert.match(heading, /styles\.sectionTitle/);
  assert.match(heading, /scheduleReveal\(\)/);
  assert.match(heading, /\{categoryTitle\}/);
  assert.match(heading, /selectedSystem \? 'study-category' : 'study-root'/);
  assert.doesNotMatch(page, /study\.availableCount|18 available/);
});

test('all eighteen published visible modules retain their exact identities and order', () => {
  assert.deepEqual(content.modules.filter(module => module.visible && module.published).map(module => module.id), [
    'cells-tissues', 'lymphatic-system', 'cytology-mitosis', 'skeletal-system', 'anatomy-foundations',
    'joints-ligaments', 'muscular-system', 'nervous-system', 'integumentary-system', 'special-senses',
    'endocrine-system', 'cardiovascular-system', 'blood-vessels', 'respiratory-system',
    'digestive-system', 'urinary-system', 'male-reproductive', 'female-reproductive',
  ]);
  assert.match(page, /visibleModules\.map\(\(module, index\) => <AdaptiveButton/);
  assert.match(page, /pathname: '\/module\/\[id\]'/);
});

test('module cards remain on the normal page scroll, not a bounded nested list', () => {
  const list = page.slice(page.indexOf('{visibleModules.map'), page.lastIndexOf('</Screen>'));
  assert.match(page, /return <Screen scrollRef=\{pageRef\}/);
  assert.doesNotMatch(list, /<ScrollView|<FlatList|<SectionList/);
  assert.match(list, /styles\.card/);
  assert.match(list, /<ModuleIcon/);
});
