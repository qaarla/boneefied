import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { content } from '../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { bvis04Assets } from '../content/bvis04-pack.ts';
import { repairDiagramTargets } from '../content/repair5-targets.ts';
import { annotationKey } from '../components/viewerMarkerLayout.ts';

const moduleId = 'integumentary-system';
const module = content.modules.find(m => m.id === moduleId)!;
const questions = content.questions.filter(q => q.moduleId === moduleId);
const reachable = new Set([
  ...module.lessons!.flatMap(l => l.assetIds ?? []),
  ...questions.flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => s.moduleId === moduleId).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const assets = content.assets.filter(a => reachable.has(a.id));
const expectedIds = [
  'asset-gray946-sweat-gland', 'asset-openstax-historical-skin-structure',
  'asset-bvis04-epidermis-strata', 'asset-bvis04-dermis-hypodermis',
  'asset-bvis04-hair-follicle', 'asset-bvis04-nail-section',
];

test('published integumentary inventory covers all six plates, all 55 annotations, and local bundle inputs', () => {
  assert.equal(module.published, true);
  assert.deepEqual(assets.map(a => a.id).sort(), [...expectedIds].sort());
  assert.equal(assets.reduce((n, a) => n + a.labels!.length, 0), 55);
  const resolver = fs.readFileSync(path.resolve(import.meta.dirname, '../content/bvis04-image-sources.generated.ts'), 'utf8');
  for (const asset of assets) {
    assert.equal(asset.assetType, 'diagram');
    assert.equal(asset.labelStatus, 'unlabeled');
    assert.equal(asset.sourceId, 'source-boneefied-bvis04-atlas', 'Historical IDs must not credit replaced third-party art');
    assert.equal(asset.verificationStatus, 'verified');
    assert.ok(/Original Boneefied/.test(asset.attributionLicense));
    assert.equal(content.sources.find(s => s.id === asset.sourceId)?.verificationStatus, 'verified');
    const png = fs.readFileSync(path.resolve(import.meta.dirname, '..', asset.localAssetPath!));
    assert.equal(png.readUInt32BE(16) / png.readUInt32BE(20), asset.imageAspectRatio);
    assert.ok(resolver.includes(`'${asset.id}': require('@/${asset.localAssetPath}')`), asset.id);
    assert.equal(new Set(asset.labels!.map(annotationKey)).size, asset.labels!.length);
    const raw = bvis04Assets.find(a => a.id === asset.id)!;
    assert.deepEqual(asset.labels!.map(({ x, y, ...rest }) => rest), raw.labels!.map(({ x, y, ...rest }) => rest), 'Exact numbered order, panel, legend text and radius preserved');
    assert.deepEqual(asset.hotspots!.map(({ x, y, ...rest }) => rest), raw.hotspots!.map(({ x, y, ...rest }) => rest));
  }
});

test('elastic-fiber correction is identical in canonical assets, raw glossary objects, and question targets', () => {
  const id = 'asset-bvis04-dermis-hypodermis';
  const expected = [1000 / 1450, .594];
  const asset = assets.find(a => a.id === id)!;
  const raw = bvis04Assets.find(a => a.id === id)!;
  const points = [
    ...asset.labels!, ...asset.hotspots!,
    ...repairDiagramTargets(id, raw.labels!),
    ...combinedAtlasAssetsForStructure('elastic-fibers-skin').flatMap(a => repairDiagramTargets(a.id, a.labels ?? [])),
    ...questions.filter(q => q.assetId === id).flatMap(q => q.hotspots ?? []),
  ].filter(p => p.structureId === 'elastic-fibers-skin');
  assert.ok(points.length >= 4);
  for (const point of points) assert.deepEqual([point.x, point.y], expected);
  assert.equal(repairDiagramTargets(id, asset.labels!), asset.labels, 'Idempotent');
  const unrelated = raw.labels!.filter(p => p.structureId !== 'elastic-fibers-skin');
  assert.equal(repairDiagramTargets(id, unrelated), unrelated);
});

test('thick/thin panels keep repeated structure identities and their distinct exact numbers', () => {
  const strata = assets.find(a => a.id === 'asset-bvis04-epidermis-strata')!;
  assert.equal(strata.labels!.length, 15);
  assert.deepEqual(strata.labels!.slice(11).map(l => [l.structureId, l.panel]), [
    ['stratum-corneum', 'thin-skin'], ['stratum-granulosum', 'thin-skin'],
    ['stratum-spinosum', 'thin-skin'], ['stratum-basale', 'thin-skin'],
  ]);
  assert.equal(strata.labels!.filter(l => l.structureId === 'stratum-lucidum').length, 1, 'No false lucidum on thin skin');
});
