import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { content } from '../content/canonical.ts';
import { bvis04Plates } from '../content/bvis04-plates.generated.ts';
import { annotationIndex, annotationKey } from '../components/viewerMarkerLayout.ts';
import { formatAnswerForDisplay } from '../content/answer-display.ts';

test('multi-panel annotations retain distinct React identities and correct question numbering', () => {
  for (const p of bvis04Plates) {
    assert.equal(new Set(p.labels.map(annotationKey)).size, p.labels.length, p.id);
    p.labels.forEach((label, index) => assert.equal(annotationIndex(p.labels, label), index, p.id));
  }
  const viewer = fs.readFileSync(new URL('../components/AnatomyImageViewer.tsx', import.meta.url), 'utf8');
  assert.match(viewer, /key=\{`label-\$\{annotationKey\(label\)\}`\}/);
  assert.match(viewer, /key=\{annotationKey\(label\)\}/);
  assert.doesNotMatch(viewer, /key=\{label\.structureId\}|key=\{`label-\$\{label\.structureId\}`\}/);
});

test('hotspot feedback displays canonical names rather than scoring IDs in both languages', () => {
  assert.equal(formatAnswerForDisplay({ taskType: 'hotspot' }, 'dorsal-root', () => 'Raíz dorsal'), 'Raíz dorsal');
  for (const q of content.questions.filter((q) => q.taskType === 'hotspot')) {
    const text = formatAnswerForDisplay(q, q.answer, (id) => {
      const structure = content.structures.find((s) => s.id === id);
      return structure ? structure.canonicalName : id;
    });
    if (typeof q.answer === 'string' && content.structures.some((s) => s.id === q.answer)) assert.notEqual(text, q.answer, q.id);
    else assert.equal(text, q.answer, `${q.id}: preserve existing display-name answers`);
  }
  const noLookup = () => { throw new Error('Non-hotspot answers must not be treated as IDs'); };
  assert.equal(formatAnswerForDisplay({ taskType: 'function-relationship' }, 'Nervio frénico', noLookup), 'Nervio frénico');
  assert.equal(formatAnswerForDisplay({ taskType: 'ordered-sequence' }, ['A', 'B'], noLookup), 'A → B');
  assert.equal(formatAnswerForDisplay({ taskType: 'select-all' }, ['A', 'B'], noLookup), 'A · B');
});
