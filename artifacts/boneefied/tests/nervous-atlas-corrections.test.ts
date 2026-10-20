import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { bvis04Plates } from '../content/bvis04-plates.generated.ts';
import { repairDiagramTargets } from '../content/repair5-targets.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';

const module = content.modules.find(m => m.id === 'nervous-system')!;
const ids = new Set([
  ...module.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === module.id).flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => s.moduleId === module.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
  'asset-bvis04-nervous-tissue',
]);
const assets = content.assets.filter(a => ids.has(a.id));
test('all published nervous views plus the associated neurological tissue view: 14 visuals, 92 targets', () => {
  assert.equal(assets.length, 14);
  assert.equal(assets.reduce((n, a) => n + (a.labels ?? a.hotspots ?? []).length, 0), 92);
  assert.equal(assets.find(a => a.id === 'asset-openstax-spinal-cord-specimen')?.assetType, 'histology');
  assert.equal(content.questions.find(q => q.id === 'q-practical-spinal-cord-specimen')?.assetId, 'asset-openstax-spinal-cord-specimen');
});
test('posterior lower-limb endpoints follow their mirrored panel without changing IDs, order or question mappings', () => {
  const id = 'asset-bvis04-lower-limb-nerves';
  const original = [
    { structureId: 'sacral-plexus', x: .7931, y: .092, radius: .018 },
    { structureId: 'sciatic-nerve', x: .7917, y: .32, radius: .018 },
  ];
  const updated = repairDiagramTargets(id, original);
  assert.deepEqual(original.map(p => p.x), [.7931, .7917]);
  assert.deepEqual(updated.map(p => [p.structureId, p.x, p.y, p.radius]), [
    ['sacral-plexus', .6966, .092, .018], ['sciatic-nerve', .698, .32, .018],
  ]);
  const a = assets.find(a => a.id === id)!;
  for (const p of updated) {
    const label = a.labels!.find(l => l.structureId === p.structureId)!;
    assert.deepEqual([label.x, label.y], [p.x, p.y]);
    for (const q of content.questions.filter(q => q.assetId === id))
      for (const point of q.hotspots ?? [])
        if (point.structureId === p.structureId) assert.deepEqual([point.x, point.y], [p.x, p.y]);
  }
  assert.equal(repairDiagramTargets(id, updated), updated);
});
test('all 13 original neurological drawings are finite, intrinsically proportioned and match their provenance hashes', () => {
  const provenance = JSON.parse(fs.readFileSync('assets/images/anatomy/bvis04-atlas/provenance.json', 'utf8'));
  for (const p of bvis04Plates.filter(p => ids.has(p.id))) {
    const svg = fs.readFileSync(p.svgPath, 'utf8');
    assert.doesNotMatch(svg, /\b(?:NaN|Infinity)\b/, p.id);
    const png = fs.readFileSync(p.pngPath);
    assert.equal(png.readUInt32BE(16) / png.readUInt32BE(20), 1.45);
    const record = provenance.plates.find((r: { id: string }) => r.id === p.id);
    assert.equal(record.orientation, p.orientation, p.id);
    assert.equal(createHash('sha256').update(svg).digest('hex'), record.sha256.svg, p.id);
    assert.equal(createHash('sha256').update(png).digest('hex'), record.sha256.png, p.id);
    for (const label of assets.find(a => a.id === p.id)!.labels ?? []) {
      const i = assets.find(a => a.id === p.id)!.labels!.indexOf(label);
      const anchor = record.featureAnchorMapping[i];
      assert.deepEqual([anchor.structureId, anchor.x, anchor.y],
        [label.structureId, label.x, label.y], p.id);
    }
  }
});
test('only the eight corrected nervous drawings gain a new preview identity; other systems and specimens retain theirs', () => {
  const corrected = new Set(['brain-medial', 'brainstem-cerebellum', 'csf-meninges', 'spinal-cross-section',
    'spinal-roots-rami', 'plexus-overview', 'upper-limb-nerves', 'lower-limb-nerves']);
  for (const p of bvis04Plates) {
    const key = anatomyImageCacheKey(`https://example.test/${p.pngPath}`);
    assert.equal(new URL(key).searchParams.get('boneefiedArt'),
      ['eye-anterior-segment', 'middle-ear'].includes(p.key) ? 'senses-detail-fit-1'
        : p.key.startsWith('cranial-nerves-') ? 'cranial-shared-exits-1'
        : p.key === 'csf-meninges' ? 'nervous-csf-outlet-1' : corrected.has(p.key) ? 'nervous-continuity-1' : null, p.id);
  }
  assert.match(anatomyImageCacheKey('https://example.test/muscular-atlas-02-face-neck.png'), /muscle-contours-1/);
  assert.match(anatomyImageCacheKey('https://example.test/skeletal-atlas-20-synovial-joint.png'), /joint-continuity-1/);
  assert.equal(anatomyImageCacheKey('specimen.jpg'), 'specimen.jpg');
});
test('correction sources explicitly retain midsagittal projection, lumbar cord termination and posterior laterality', () => {
  const plate = (key: string) => bvis04Plates.find(p => p.key === key)!;
  assert.match(plate('brain-medial').description[0], /projected.*midsagittal/);
  assert.match(plate('csf-meninges').description[0], /not the main drainage route/);
  assert.match(plate('plexus-overview').description[0], /cord ends in the upper lumbar/);
  for (const key of ['upper-limb-nerves', 'lower-limb-nerves'])
    assert.match(plate(key).orientation, /posterior panel: lateral at viewer right/);
});
