import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { bvis06Plates } from '../content/bvis06-plates.generated.ts';
import { answerIsCorrect } from '../content/study.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';

const root = new URL('../', import.meta.url);
const mod = content.modules.find(m => m.id === 'urinary-system')!;
const ids = new Set([
  ...mod.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === mod.id).flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => s.moduleId === mod.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const assets = content.assets.filter(a => ids.has(a.id));

test('urinary publication union preserves six primary diagrams, one real micrograph and shared male context', () => {
  assert.equal(assets.length, 8);
  assert.equal(bvis06Plates.filter(p => ids.has(p.id) && p.moduleId === mod.id).length, 6);
  assert.equal(assets.reduce((n, a) => n + (a.labels?.length ?? 0), 0), 108);
  const real = assets.filter(a => a.assetType === 'histology');
  assert.equal(real.length, 1);
  const photo = real[0];
  assert.equal(createHash('sha256').update(readFileSync(new URL(photo.localAssetPath!, root))).digest('hex'), '3a4333edc68cfc40e901ab4df0e30c1ea889134fdb62675e13411a85e1b74627');
  assert.equal(photo.attributionLicense, 'Josef Reischig, CC BY-SA 3.0');
  assert.equal(photo.labels?.length ?? 0, 0);
  assert.match(photo.description!, /Stain and magnification are not asserted/);
  const lessonView = readFileSync(new URL('app/module/[id].tsx', root), 'utf8');
  assert.match(lessonView, /lesson\.id\.startsWith\('urinary-'\).*assetType === 'histology'/);
});

test('all 59 urinary visual questions retain mapped targets and correct response scoring', () => {
  const qs = content.questions.filter(q => q.moduleId === mod.id && !!q.assetId);
  assert.equal(qs.length, 59);
  assert.deepEqual(qs.reduce((o, q) => ({ ...o, [q.taskType]: (o[q.taskType] ?? 0) + 1 }), {} as Record<string, number>),
    { hotspot: 50, 'histology-identification': 1, 'image-identification': 6, 'ordered-sequence': 2 });
  for (const q of qs) {
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    const a = assets.find(a => a.id === q.assetId)!;
    for (const h of q.hotspots ?? []) assert.ok(a.labels!.some(l => l.structureId === h.structureId && l.x === h.x && l.y === h.y), q.id);
    if (q.taskType === 'hotspot') for (const h of q.hotspots!) {
      assert.equal(answerIsCorrect(h.structureId, q), q.structureIds.includes(h.structureId), q.id);
    }
  }
  const q = qs.find(q => q.id === 'q-visual-kidney-cortex')!;
  assert.equal(q.answer, 'Renal cortex');
  assert.ok(answerIsCorrect('urinary-system-renal-cortex', q));
});

test('all seven schematic sources retain exact local manifests, provenance hashes and numbered identities', () => {
  const proof = JSON.parse(readFileSync(new URL('assets/images/anatomy/bvis06-atlas/provenance.json', root), 'utf8'));
  const manifest = readFileSync(new URL('content/bvis06-image-sources.generated.ts', root), 'utf8');
  for (const a of assets.filter(a => a.assetType === 'diagram')) {
    const p = bvis06Plates.find(p => p.id === a.id)!;
    const record = proof.plates.find((p: { id: string }) => p.id === a.id);
    for (const ext of ['png', 'svg'] as const)
      assert.equal(createHash('sha256').update(readFileSync(new URL(ext === 'png' ? p.pngPath : p.svgPath, root))).digest('hex'), record.sha256[ext]);
    assert.deepEqual(p.labels.map(l => [l.structureId, l.x, l.y]), a.labels!.map(l => [l.structureId, l.x, l.y]));
    assert.ok(manifest.includes(`'${p.id}': require('@/${p.pngPath}')`));
    assert.match(a.attributionLicense, /Original Boneefied/);
    if (p.teachingKind === 'tissue-schematic') assert.match(a.specimenNote!, /not a real specimen/);
  }
});

test('repaired JGA endpoints identify adjacent arterial and distal tubular wall cells', () => {
  const p = bvis06Plates.find(p => p.key === 'renal-corpuscle')!;
  const md = p.labels.find(l => l.structureId === 'urinary-system-macula-densa')!;
  const jg = p.labels.find(l => l.structureId === 'urinary-system-juxtaglomerular-cell')!;
  const distance = Math.hypot((md.x - jg.x) * 1450, (md.y - jg.y) * 1000);
  assert.ok(distance > 5 && distance < 25);
  assert.ok(md.x * 1450 < 250 && jg.x * 1450 < 250);
  const source = readFileSync(new URL('scripts/atlas/bvis06-uri.mjs', root), 'utf8');
  const glomeruli = JSON.parse(source.match(/const gl = (\[\[.*?\]\]);/)![1]) as number[][];
  for (const [, y] of glomeruli) assert.ok(y + 34 < 440, 'Every corpuscle stays entirely in cortex');
  assert.doesNotMatch(source, /\.\.\.\[-45, -85, -125\]\.map\(cup\)/, 'Calyces must branch rather than form a serial chain');
});

test('only the three corrected urinary images receive new cache identities', () => {
  const changed = new Set(['kidney-section', 'renal-vessels', 'renal-corpuscle'].map(k => `asset-bvis06-${k}`));
  for (const a of assets) {
    const uri = `https://example.test/${a.localAssetPath}`;
    if (changed.has(a.id)) assert.match(anatomyImageCacheKey(uri), /urinary-relations-1/);
    // This shared context is owned by Male Reproductive and has its own later repair.
    else if (a.id === 'asset-bvis06-male-system') assert.match(anatomyImageCacheKey(uri), /male-relations-1/);
    else assert.equal(anatomyImageCacheKey(uri), uri);
  }
  const source = readFileSync(new URL('components/AnatomyImageViewer.tsx', root), 'utf8');
  assert.match(source, /\.\.\.urinaryAssets/);
  assert.match(source, /viewerPanBounds\([^\n]+urinaryAssets\.has/);
});

test('ordered-route feedback does not allocate the hidden, repeated study markers', () => {
  const q = content.questions.find(q => q.id === 'q-bvis06-sequence-urine-route')!;
  const a = content.assets.find(a => a.id === q.assetId)!;
  assert.equal(q.hotspots!.length, 4);
  assert.ok(a.labels!.filter(l => q.structureIds.includes(l.structureId)).length > q.hotspots!.length);
  const source = readFileSync(new URL('components/AnatomyImageViewer.tsx', root), 'utf8');
  assert.match(source, /const labelCalloutLayout = !questionHotspotCallouts &&/);
  assert.match(source, /!questionHotspotCallouts && labels\.map/);
});
