// @ts-nocheck — source inspection/identity evidence; not a native build.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { content } from '../../content/canonical.ts';
import { answerIsCorrect } from '../../content/study.ts';
import { Scene, W, H } from './bvis05-lib.mjs';
import { plates as lymphaticPlates } from './bvis05-lymph.mjs';
import { plates as respiratoryPlates } from './bvis05-resp.mjs';
import { plates as digestiveFirst } from './bvis06-dig1.mjs';
import { plates as digestiveSecond } from './bvis06-dig2.mjs';
import { plates as placementPlates } from './bvis06-place.mjs';
import { plates as urinaryPlates } from './bvis06-uri.mjs';
import { plates as reproductivePlates } from './bvis06-repro.mjs';

const respiratory = process.argv[2] === 'respiratory-system';
const digestive = process.argv[2] === 'digestive-system';
const urinary = process.argv[2] === 'urinary-system';
const male = process.argv[2] === 'male-reproductive';
const scopeModule = male ? 'male-reproductive' : urinary ? 'urinary-system' : 'digestive-system';
const bvis06 = digestive || urinary || male;
const plates = bvis06 ? [...digestiveFirst, ...digestiveSecond, ...placementPlates, ...urinaryPlates, ...reproductivePlates] : respiratory ? respiratoryPlates : lymphaticPlates;
const dir = `generated-artifacts/atlas-${male ? 'male' : urinary ? 'urinary' : digestive ? 'digestive' : respiratory ? 'resp' : 'lymph'}-repair`;
const before = JSON.parse(fs.readFileSync(`${dir}/identity-before.json`, 'utf8'));
const current = JSON.parse(JSON.stringify(content));
const oldInventory = JSON.parse(fs.readFileSync(`${dir}/inventory-before.json`, 'utf8'));
const inventory = JSON.parse(fs.readFileSync(`${dir}/inventory-after.json`, 'utf8'));
const ids = new Set(inventory.map(a => a.id));
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const omit = (o, keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));
for (const key of ['modules', 'structures', 'sources'])
  check(isDeepStrictEqual(before[key], current[key]), `Canonical ${key} changed`);
const changes = [];
for (const a of current.assets) {
  const old = before.assets.find(b => b.id === a.id);
  if (!ids.has(a.id)) { check(isDeepStrictEqual(old, a), `Unrelated asset changed: ${a.id}`); continue; }
  check(isDeepStrictEqual(omit(old, ['labels', 'hotspots', 'description']), omit(a, ['labels', 'hotspots', 'description'])), `Asset identity changed: ${a.id}`);
  for (const field of ['labels', 'hotspots'])
    check(isDeepStrictEqual(old[field]?.map(p => omit(p, ['x', 'y'])), a[field]?.map(p => omit(p, ['x', 'y']))), `Annotation identity changed: ${a.id}`);
  const labels = a.labels ?? [];
  changes.push({ id: a.id, targets: labels.length, movedTargets: labels.filter((p, i) => p.x !== old.labels[i].x || p.y !== old.labels[i].y).length, rasterChanged: inventory.find(i => i.id === a.id).sourceSha256 !== oldInventory.find(i => i.id === a.id).sourceSha256 });
}
const questions = [];
for (const q of current.questions) {
  const old = before.questions.find(b => b.id === q.id);
  if (bvis06 && q.moduleId !== scopeModule) { check(isDeepStrictEqual(old, q), `Unrelated question changed: ${q.id}`); continue; }
  if (!ids.has(q.assetId)) { check(isDeepStrictEqual(old, q), `Unrelated question changed: ${q.id}`); continue; }
  const allowed = ['hotspots', 'explanation'];
  if (respiratory && q.id === 'q-visual-respiratory-trachea') {
    allowed.push('acceptedAliases');
    check(isDeepStrictEqual(q.acceptedAliases, [...old.acceptedAliases, 'respiratory-system-trachea']), 'Legacy trachea ID alias must be additive only');
  }
  if (digestive && q.id === 'q-visual-stomach') {
    allowed.push('acceptedAliases');
    check(isDeepStrictEqual(q.acceptedAliases, [...old.acceptedAliases, 'digestive-system-stomach']), 'Legacy stomach ID alias must be additive only');
  }
  if (urinary && q.id === 'q-visual-kidney-cortex') {
    allowed.push('acceptedAliases');
    check(isDeepStrictEqual(q.acceptedAliases, [...old.acceptedAliases, 'urinary-system-renal-cortex']), 'Legacy cortex ID alias must be additive only');
  }
  if (male && q.id === 'q-visual-male-testis') {
    allowed.push('acceptedAliases');
    check(isDeepStrictEqual(q.acceptedAliases, [...old.acceptedAliases, 'male-reproductive-testis']), 'Legacy testis ID alias must be additive only');
  }
  check(isDeepStrictEqual(omit(old, allowed), omit(q, allowed)), `Question identity/answer changed: ${q.id}`);
  check(isDeepStrictEqual(old.hotspots?.map(p => omit(p, ['x', 'y'])), q.hotspots?.map(p => omit(p, ['x', 'y']))), `Question target identities changed: ${q.id}`);
  const a = inventory.find(a => a.id === q.assetId);
  const geometry = (q.hotspots ?? []).every(h => a.labels.some(l => h.structureId === l.structureId && h.x === l.x && h.y === l.y));
  const correct = q.taskType === 'hotspot' ? q.hotspots.filter(h => q.structureIds.includes(h.structureId)) : [];
  const actualIdGrades = q.taskType !== 'hotspot' || correct.length > 0 && correct.every(h => answerIsCorrect(h.structureId, q));
  check(geometry && actualIdGrades && answerIsCorrect(q.answer, q), `Question mapping/scoring failed: ${q.id}`);
  questions.push({ id: q.id, assetId: q.assetId, type: q.taskType, geometry, actualIdGrades });
}
check(before.assets.length === current.assets.length && before.questions.length === current.questions.length, 'Catalog size changed');
const provenance = JSON.parse(fs.readFileSync(`artifacts/boneefied/assets/images/anatomy/bvis0${bvis06 ? 6 : 5}-atlas/provenance.json`, 'utf8'));
const sourceChecks = [];
for (const p of plates) {
  const id = `asset-bvis0${bvis06 ? 6 : 5}-${p.key}`, a = inventory.find(a => a.id === id);
  if (!a) continue;
  const S = new Scene(p.key); p.draw(S);
  const mask = `/tmp/b${bvis06 ? 6 : 5}-id-${p.key}`;
  if (bvis06) {
    fs.writeFileSync(`${mask}.svg`, S.idsvg());
    execFileSync('convert', [`${mask}.svg`, `${mask}.png`], { stdio: 'ignore' });
  }
  const pixels = execFileSync('convert', [`${mask}.png`, '-depth', '8', 'rgb:-'], { maxBuffer: 1 << 26 });
  let visiblePixels;
  if (bvis06) {
    // The picking mask widens thin strokes. Independently check their actual painted width.
    const visible = new Scene(p.key), line = visible.ln.bind(visible);
    visible.ln = (id, path, options = {}) => {
      line(id, path, options);
      if (id) visible.idm[visible.idm.length - 1] = visible.idm.at(-1).replace(
        `stroke-width="${Math.max(options.w ?? 3, 11)}"`, `stroke-width="${options.w ?? 3}"`);
    };
    p.draw(visible);
    fs.writeFileSync(`${mask}-visible.svg`, visible.idsvg());
    execFileSync('convert', [`${mask}-visible.svg`, `${mask}-visible.png`], { stdio: 'ignore' });
    visiblePixels = execFileSync('convert', [`${mask}-visible.png`, '-depth', '8', 'rgb:-'], { maxBuffer: 1 << 26 });
  }
  const anchors = provenance.plates.find(a => a.id === id).featureAnchorMapping;
  for (const [i, point] of a.labels.entries()) {
    const keys = anchors[i].shapeKey.split('+');
    const expected = keys.map(key => S.hex(key).slice(1).toLowerCase());
    const x = Math.round(point.x * W), y = Math.round(point.y * H), offset = (y * W + x) * 3;
    const actual = pixels.subarray(offset, offset + 3).toString('hex');
    const ownRegion = expected.includes(actual);
    const visibleRegion = !visiblePixels || expected.includes(visiblePixels.subarray(offset, offset + 3).toString('hex'));
    sourceChecks.push({ asset: id, number: i + 1, structure: point.structureId, x, y, ownRegion, ...(bvis06 ? { visibleRegion } : {}) });
    check(ownRegion, `Source region mismatch ${id}:${i + 1}:${point.structureId} (${actual} vs ${expected})`);
    check(visibleRegion, `Endpoint misses the painted region: ${id}:${i + 1}:${point.structureId}`);
  }
}
const result = { inspected: changes.length, targets: sourceChecks.length, changedRasters: changes.filter(a => a.rasterChanged).length, movedTargets: changes.reduce((n, a) => n + a.movedTargets, 0), questions: questions.length, types: questions.reduce((o, q) => ({ ...o, [q.type]: (o[q.type] ?? 0) + 1 }), {}), failures, changes };
fs.writeFileSync(`${dir}/identity-diff.json`, JSON.stringify(result, null, 2));
fs.writeFileSync(`${dir}/question-audit.json`, JSON.stringify(questions, null, 2));
fs.writeFileSync(`${dir}/source-region-review.json`, JSON.stringify(sourceChecks, null, 2));
console.log(JSON.stringify({ ...result, changes: undefined }, null, 2));
if (failures.length) process.exitCode = 1;
