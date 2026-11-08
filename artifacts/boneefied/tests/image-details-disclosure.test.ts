import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../components/VisualStudyContext.tsx', import.meta.url), 'utf8');

test('image details are collapsed by default, independently toggleable and accessible', () => {
  assert.match(source, /useState\(false\)/);
  assert.match(source, /onPress=\{\(\) => setExpanded\(\(current\) => !current\)\}/);
  assert.match(source, /accessibilityRole="button"/);
  assert.match(source, /accessibilityState=\{\{ expanded \}\}/);
  assert.match(source, /'aria-expanded': expanded/);
  assert.match(source, /'aria-controls': detailId/);
  assert.match(source, /nativeID=\{detailId\}/);
  assert.match(source, /minHeight: 44/);
  assert.match(source, /'Detalles de la imagen' : 'Image details'/);
});

test('all descriptive text is inside the disclosure, with Recall guards and visible credits preserved', () => {
  const body = source.slice(source.indexOf('{expanded &&'), source.indexOf('/** Keep creator'));
  assert.match(body, /\{label\}/);
  assert.match(body, /learn && asset\.description/);
  assert.match(body, /learn && asset\.specimenNote/);
  assert.doesNotMatch(body, /<VisualCredit/);
  assert.match(source, /<ImageDetails key=\{`\$\{asset\.id\}:\$\{learn\}`\}/);
  assert.match(source, /<VisualCredit asset=\{asset\}/);
});
