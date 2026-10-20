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
const mod = content.modules.find(m => m.id === 'digestive-system')!;
const ids = new Set([
  ...mod.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === mod.id).flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => s.moduleId === mod.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const assets = content.assets.filter(a => ids.has(a.id));

test('digestive publication union is ten digestive and two shared context diagrams with 168 targets', () => {
  assert.equal(assets.length, 12);
  assert.equal(bvis06Plates.filter(p => ids.has(p.id) && p.moduleId === mod.id).length, 10);
  assert.equal(assets.reduce((n, a) => n + a.labels!.length, 0), 168);
  for (const a of assets) {
    assert.equal(a.assetType, 'diagram');
    assert.match(a.attributionLicense, /Original Boneefied/);
    assert.equal(a.imageAspectRatio, 1.45);
    const bytes = readFileSync(new URL(a.localAssetPath!, root));
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [1450, 1000]);
  }
});

test('all 93 digestive visual questions retain current targets and correct tap scoring', () => {
  const qs = content.questions.filter(q => q.moduleId === mod.id && !!q.assetId);
  assert.equal(qs.length, 93);
  assert.equal(qs.filter(q => q.taskType === 'hotspot').length, 82);
  assert.equal(qs.filter(q => q.taskType === 'image-identification').length, 10);
  assert.equal(qs.filter(q => q.taskType === 'ordered-sequence').length, 1);
  for (const q of qs) {
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    const a = assets.find(a => a.id === q.assetId)!;
    for (const h of q.hotspots ?? []) assert.ok(a.labels!.some(l => l.structureId === h.structureId && l.x === h.x && l.y === h.y), q.id);
    if (q.taskType === 'hotspot') for (const h of q.hotspots!.filter(h => q.structureIds.includes(h.structureId)))
      assert.ok(answerIsCorrect(h.structureId, q), q.id);
  }
  assert.equal(qs.find(q => q.id === 'q-visual-stomach')!.answer, 'Stomach');
});

test('source dimensions, rights, hashes, numbered order and local require manifest agree', () => {
  const proof = JSON.parse(readFileSync(new URL('assets/images/anatomy/bvis06-atlas/provenance.json', root), 'utf8'));
  const manifest = readFileSync(new URL('content/bvis06-image-sources.generated.ts', root), 'utf8');
  for (const a of assets) {
    const p = bvis06Plates.find(p => p.id === a.id)!;
    const record = proof.plates.find((p: { id: string }) => p.id === a.id);
    for (const ext of ['png', 'svg'] as const)
      assert.equal(createHash('sha256').update(readFileSync(new URL(ext === 'png' ? p.pngPath : p.svgPath, root))).digest('hex'), record.sha256[ext]);
    assert.deepEqual(p.labels.map(l => [l.structureId, l.x, l.y]), a.labels!.map(l => [l.structureId, l.x, l.y]));
    assert.ok(manifest.includes(`'${p.id}': require('@/${p.pngPath}')`));
    assert.doesNotMatch(readFileSync(new URL(p.svgPath, root), 'utf8'), /NaN|Infinity/);
    if (p.teachingKind === 'tissue-schematic') assert.match(a.specimenNote!, /not a real specimen/);
  }
});

test('wall section fibre orientation is corrected consistently in both languages', () => {
  const p = bvis06Plates.find(p => p.key === 'digestive-wall-layers')!;
  assert.match(p.description[0], /circular fibres are cut across.*longitudinal fibres are cut lengthwise/);
  assert.match(p.description[1], /fibras circulares se cortan transversalmente.*longitudinales se cortan a lo largo/);
  const svg = readFileSync(new URL(p.svgPath, root), 'utf8');
  assert.match(svg, /A300 300/);
});

test('only the corrected wall raster receives a new cache identity', () => {
  for (const a of assets) {
    const uri = `https://example.test/${a.localAssetPath}`;
    if (a.id.endsWith('digestive-wall-layers')) assert.match(anatomyImageCacheKey(uri), /digestive-fibres-1/);
    else assert.equal(anatomyImageCacheKey(uri), uri);
  }
});

test('digestive fitting centers images and includes the complete external annotation envelope', () => {
  const source = readFileSync(new URL('components/AnatomyImageViewer.tsx', root), 'utf8');
  assert.match(source, /\.\.\.digestiveAssets/);
  assert.match(source, /viewerPanBounds\([^\n]+digestiveAssets\.has/);
});
