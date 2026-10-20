import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { repairDiagramTargets } from '../content/repair5-targets.ts';
import { skeletalAtlasAssets } from '../content/skeletal-atlas-pack.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';

const module = content.modules.find(m => m.id === 'skeletal-system')!;
const uses = new Set([
  ...module.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === module.id).flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => s.moduleId === module.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const assets = content.assets.filter(a => uses.has(a.id));
const points = (a: typeof assets[number]) => a.labels?.length ? a.labels : a.hotspots ?? [];
const expected: Record<string, Record<string, [number, number]>> = {
  'asset-commons-axial-skeleton-blank': {
    'thoracic-vertebrae': [450 / 960, 590 / 1377],
    sacrum: [450 / 960, 900 / 1377], coccyx: [450 / 960, 966 / 1377],
  },
  'asset-servier-pelvis': { acetabulum: [73 / 256, 171 / 294] },
  'asset-skeletal-atlas-rib-detail': { 'transverse-process': [330 / 1450, .5] },
  'asset-skeletal-atlas-leg-tibia-fibula': { 'ankle-mortise': [504 / 1450, .855] },
};

test('all 29 published skeletal-context visuals and 284 annotations are covered, not just the 22 original plates', () => {
  assert.equal(module.published, true);
  assert.equal(assets.length, 29);
  assert.equal(assets.reduce((n, a) => n + points(a).length, 0), 284);
  for (const id of [
    'asset-skull-front', 'asset-skull-lateral', 'asset-cervical-vertebra',
    'asset-atlas-skeleton-anterior', 'asset-atlas-skeleton-posterior', 'asset-atlas-skeleton-axial-appendicular',
    'asset-commons-axial-skeleton-blank', 'asset-commons-appendicular-skeleton-blank',
    'asset-vertebral-column', 'asset-servier-pelvis', 'asset-servier-elbow-joint',
    ...skeletalAtlasAssets.filter(a => a.id !== 'asset-skeletal-atlas-synovial-joint').map(a => a.id),
  ]) assert.ok(uses.has(id), id);
});

test('all skeletal visual inputs remain local with their exact raster aspect and existing verified rights', () => {
  const resolver = fs.readFileSync('content/imageSources.ts', 'utf8');
  for (const a of assets) {
    const png = fs.readFileSync(a.localAssetPath!);
    assert.equal(png.subarray(1, 4).toString(), 'PNG', a.id);
    const ratio = png.readUInt32BE(16) / png.readUInt32BE(20);
    if (a.imageAspectRatio) assert.ok(Math.abs(ratio - a.imageAspectRatio) < .00001, a.id);
    // The historical column has no metadata ratio; the viewer reads the local
    // Expo Asset dimensions instead. Do not replace it with the 1.45 default.
    else assert.equal(a.id, 'asset-vertebral-column');
    assert.ok(resolver.includes(`'${a.id}': require(`), a.id);
    assert.ok(a.attributionLicense && a.sourceId, a.id);
    assert.ok(content.sources.some(s => s.id === a.sourceId), a.id);
  }
});

test('all six corrected targets reach both canonical markers and any question-specific endpoint', () => {
  for (const [id, changes] of Object.entries(expected)) {
    const a = assets.find(a => a.id === id)!;
    for (const [structureId, xy] of Object.entries(changes)) {
      const candidates = [
        ...points(a), ...a.hotspots ?? [],
        ...content.questions.filter(q => q.assetId === id).flatMap(q => q.hotspots ?? []),
      ].filter(p => p.structureId === structureId);
      assert.ok(candidates.length >= 1, `${id}:${structureId}`);
      for (const p of candidates) assert.deepEqual([p.x, p.y], xy, `${id}:${structureId}`);
    }
    assert.equal(repairDiagramTargets(id, points(a)), points(a), 'Idempotent published inputs');
  }
});

test('corrected original art keeps all 22 source identities and exact current SVG/PNG provenance hashes', () => {
  const provenance = JSON.parse(fs.readFileSync('assets/images/anatomy/skeletal-atlas/provenance.json', 'utf8'));
  assert.equal(provenance.plates.length, 22);
  for (const p of provenance.plates) {
    assert.ok(p.rights.includes('rights reserved'));
    for (const ext of ['svg', 'png'] as const) {
      assert.equal(createHash('sha256').update(fs.readFileSync(p[`${ext}Path`])).digest('hex'), p.sha256[ext], `${p.id}:${ext}`);
    }
  }
});

test('the four earlier skeletal rasters keep their own cache revision, separate from later joint corrections', () => {
  const revised = new Set(['atlas-axis', 'rib-detail', 'pectoral-girdle', 'leg-tibia-fibula']);
  for (const a of assets) {
    const uri = `https://example.test/assets/?unstable_path=${encodeURIComponent(`./${a.localAssetPath}`)}`;
    const key = anatomyImageCacheKey(uri);
    const changes = [...revised].some(suffix => a.id === `asset-skeletal-atlas-${suffix}`);
    assert.equal(new URL(key).searchParams.get('boneefiedArt') === 'skeletal-continuity-1', changes, a.id);
    if (changes) {
      assert.equal(new URL(key).searchParams.get('unstable_path'), `./${a.localAssetPath}`);
      assert.equal(new URL(key).searchParams.get('boneefiedArt'), 'skeletal-continuity-1');
    }
  }
  assert.equal(anatomyImageCacheKey('https://example.test/assets/content-hash.png'), 'https://example.test/assets/content-hash.png');
  const plain = 'https://example.test/skeletal-atlas-08-atlas-axis.png#view';
  assert.equal(anatomyImageCacheKey(plain), 'https://example.test/skeletal-atlas-08-atlas-axis.png?boneefiedArt=skeletal-continuity-1#view');
});
