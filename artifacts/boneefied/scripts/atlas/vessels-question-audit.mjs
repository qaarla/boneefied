import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { content } from '../../content/canonical.ts';
import { answerIsCorrect } from '../../content/study.ts';

const dir = 'generated-artifacts/atlas-vessels-repair';
const before = JSON.parse(readFileSync(`${dir}/identity-before.json`, 'utf8'));
// Match the saved JSON snapshot's omission of optional undefined properties.
const current = JSON.parse(JSON.stringify(content));
const inventory = JSON.parse(readFileSync(`${dir}/inventory-after.json`, 'utf8'));
const ids = new Set(inventory.map(a => a.id));
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const omit = (object, keys) => Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)));
for (const key of ['modules', 'structures', 'sources'])
  check(isDeepStrictEqual(before[key], current[key]), `Changed canonical ${key}`);
const changes = [];
for (const a of current.assets) {
  const old = before.assets.find(b => b.id === a.id);
  if (!ids.has(a.id)) {
    check(isDeepStrictEqual(old, a), `Unrelated asset changed: ${a.id}`);
    continue;
  }
  check(isDeepStrictEqual(omit(old, ['labels', 'hotspots', 'description']), omit(a, ['labels', 'hotspots', 'description'])), `Asset identity changed: ${a.id}`);
  for (const field of ['labels', 'hotspots']) {
    check(isDeepStrictEqual(old[field]?.map(p => omit(p, ['x', 'y'])), a[field]?.map(p => omit(p, ['x', 'y']))), `Annotation identities changed: ${a.id}:${field}`);
  }
  const moved = a.labels.filter((p, i) => p.x !== old.labels[i].x || p.y !== old.labels[i].y);
  changes.push({ id: a.id, targets: a.labels.length, movedTargets: moved.length, rasterChanged: inventory.find(i => i.id === a.id).sourceSha256 !== JSON.parse(readFileSync(`${dir}/inventory-before.json`, 'utf8')).find(i => i.id === a.id).sourceSha256 });
}
const questions = [];
for (const q of current.questions) {
  const old = before.questions.find(b => b.id === q.id);
  check(isDeepStrictEqual(omit(old, ['hotspots', 'explanation']), omit(q, ['hotspots', 'explanation'])), `Question identity/answer changed: ${q.id}`);
  check(isDeepStrictEqual(old.hotspots?.map(p => omit(p, ['x', 'y'])), q.hotspots?.map(p => omit(p, ['x', 'y']))), `Question target identities changed: ${q.id}`);
  if (!ids.has(q.assetId)) {
    check(isDeepStrictEqual(old, q), `Unrelated question changed: ${q.id}`);
    continue;
  }
  const asset = inventory.find(a => a.id === q.assetId);
  const geometry = (q.hotspots ?? []).every(h => asset.labels.some(l => h.structureId === l.structureId && h.x === l.x && h.y === l.y));
  const correct = q.taskType === 'hotspot' ? q.hotspots.filter(h => q.structureIds.includes(h.structureId)) : [];
  const emittedTapGrades = q.taskType !== 'hotspot' || correct.length > 0 && correct.every(h => answerIsCorrect(h.structureId, q));
  check(geometry && emittedTapGrades && answerIsCorrect(q.answer, q), `Question mapping/scoring failed: ${q.id}`);
  questions.push({ id: q.id, assetId: q.assetId, taskType: q.taskType, geometry, emittedTapGrades });
}
check(before.assets.length === content.assets.length && before.questions.length === content.questions.length, 'Catalog size changed');
const result = { inspected: changes.length, targets: changes.reduce((n, a) => n + a.targets, 0), changedRasters: changes.filter(a => a.rasterChanged).length, movedTargets: changes.reduce((n, a) => n + a.movedTargets, 0), questions: questions.length, failures, changes };
writeFileSync(`${dir}/identity-diff.json`, JSON.stringify(result, null, 2));
writeFileSync(`${dir}/question-audit.json`, JSON.stringify(questions, null, 2));
console.log(JSON.stringify({ ...result, changes: undefined }));
if (failures.length) process.exitCode = 1;
