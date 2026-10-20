import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { foundationsAtlasTargets, repairFoundationsTargets, foundationsAtlasAvoidRects } from '../content/foundations-atlas-corrections.ts';
import { repairDiagramTargets } from '../content/repair5-targets.ts';
import { bvr02OverlayOverrides } from '../content/bvr02-overlay-overrides.ts';

const root = path.resolve(import.meta.dirname, '..');
const moduleIds = new Set(['cells-tissues', 'cytology-mitosis', 'anatomy-foundations']);
const ids = new Set([
  ...content.modules.filter(m => moduleIds.has(m.id)).flatMap(m => m.lessons?.flatMap(l => l.assetIds ?? []) ?? []),
  ...content.questions.filter(q => moduleIds.has(q.moduleId)).flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => moduleIds.has(s.moduleId)).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const diagrams = content.assets.filter(a => ids.has(a.id) && a.assetType === 'diagram');

test('bounded published inventory includes all 19 diagrams, with genuine photographs kept separate', () => {
  assert.equal(diagrams.length, 19);
  assert.equal(content.assets.filter(a => ids.has(a.id) && a.assetType === 'histology').length, 3);
  for (const asset of diagrams) {
    assert.ok(fs.existsSync(path.join(root, asset.localAssetPath!)), asset.id);
    assert.equal(asset.labelStatus, 'unlabeled');
    assert.equal(asset.verificationStatus, 'verified');
    const source = content.sources.find(s => s.id === asset.sourceId);
    assert.equal(source?.verificationStatus, 'verified');
    assert.ok(asset.attributionLicense);
    assert.ok(asset.labels?.length);
    assert.equal(new Set(asset.labels!.map(l => l.structureId)).size, asset.labels!.length);
  }
});

test('changed source art keeps its exact canonical legend order and target identities', () => {
  const expected: Record<string, string[]> = {
    'asset-original-mitosis-stages': ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase'],
    'asset-original-body-cavities': ['cranial-cavity', 'vertebral-cavity', 'thoracic-cavity', 'abdominal-cavity', 'pelvic-cavity'],
  };
  for (const [id, keys] of Object.entries(expected)) {
    const asset = content.assets.find(a => a.id === id)!;
    assert.deepEqual(asset.labels!.map(l => l.structureId), keys);
    assert.deepEqual(asset.hotspots!.map(l => l.structureId), keys);
    for (const point of [...asset.labels!, ...asset.hotspots!, ...content.questions.filter(q => q.assetId === id).flatMap(q => q.hotspots ?? [])]) {
      assert.deepEqual([point.x, point.y], foundationsAtlasTargets[id][point.structureId]);
    }
    assert.deepEqual(bvr02OverlayOverrides[id].avoid, foundationsAtlasAvoidRects[id]);
    assert.deepEqual(asset.hotspotOverlayAvoidRects, foundationsAtlasAvoidRects[id]);
    assert.equal(repairDiagramTargets(id, asset.labels!), asset.labels!);
    const raw = keys.map(structureId => ({ structureId, x: .01, y: .02, radius: .08, displayLabel: 'Exact authored legend' }));
    const before = structuredClone(raw);
    const fixed = repairFoundationsTargets(id, raw);
    assert.deepEqual(raw, before);
    assert.deepEqual(fixed.map(({ x, y, ...rest }) => rest), raw.map(({ x, y, ...rest }) => rest));
  }
});

test('PNG, editable masters, rights and exact-file hashes agree, without baked Learn/Recall answers', () => {
  const provenance = JSON.parse(fs.readFileSync(path.join(root, 'assets/images/anatomy/foundations-corrections/provenance.json'), 'utf8'));
  assert.equal(provenance.records.length, 2);
  for (const record of provenance.records) {
    const svg = fs.readFileSync(path.join(root, record.svgPath), 'utf8');
    const png = fs.readFileSync(path.join(root, record.pngPath));
    assert.ok(!/<text\b|<image\b/.test(svg), 'No baked labels or imported raster artwork');
    assert.equal(createHash('sha256').update(svg).digest('hex'), record.svgSha256);
    assert.equal(createHash('sha256').update(png).digest('hex'), record.pngSha256);
    const asset = content.assets.find(a => a.id === record.id)!;
    assert.equal(png.readUInt32BE(16) / png.readUInt32BE(20), asset.imageAspectRatio);
  }
  const mitosis = fs.readFileSync(path.join(root, provenance.records[0].svgPath), 'utf8');
  for (const stage of ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase']) assert.ok(mitosis.includes(`id="${stage}"`));
});
