import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../app/(tabs)/(study)/index.tsx', import.meta.url), 'utf8');

test('Explore heading spans the available width independently without a secondary system count', () => {
  const heading = page.match(/<Heading testID="study-explore-heading"[\s\S]*?<\/Heading>/)?.[0];
  assert.ok(heading);
  assert.match(heading, /alignSelf: 'stretch'/);
  assert.match(heading, /textAlign: 'center'/);
  assert.match(heading, /styles\.sectionTitle/);
  assert.match(heading, /t\('study\.exploreBySystem'\)/);
  assert.doesNotMatch(page, /study\.systemCount|17 systems/);
});

test('all seventeen system choices retain their exact identities and order', () => {
  const systems = page.match(/const systems = \[([\s\S]*?)\] as const;/)?.[1];
  assert.ok(systems);
  assert.deepEqual([...systems.matchAll(/\['[^']+', '([^']+)'\]/g)].map(match => match[1]), [
    'cell', 'skin', 'skeletal-system', 'joints', 'muscular', 'nervous', 'nerves', 'senses',
    'endocrine', 'cardiovascular', 'vessels', 'lymphatic', 'respiratory', 'digestive',
    'urinary', 'male-reproductive', 'female-reproductive',
  ]);
  assert.match(page, /const systemChoices = systems\.map/);
  assert.match(page, /onPress=\{\(\) => selectSystem\(id\)\}/);
});

test('the original bounded selector remains a single nested internal scroller', () => {
  assert.match(page, /styles\.systemsPanel, \{ height: systemsHeight/);
  const scroller = page.match(/<ScrollView testID="study-systems-scroll"[\s\S]*?<\/ScrollView>/)?.[0];
  assert.ok(scroller);
  assert.equal((page.match(/testID="study-systems-scroll"/g) ?? []).length, 1);
  assert.match(scroller, /nestedScrollEnabled/);
  assert.match(scroller, /showsVerticalScrollIndicator/);
  assert.match(scroller, />\{systemChoices\}<\/ScrollView>/);
});
