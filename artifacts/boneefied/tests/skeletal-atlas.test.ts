import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { content } from '../content/canonical.ts';
import { skeletalLandmarkStructures } from '../content/anatomy.ts';
import { skeletalPlates } from '../content/skeletal-atlas-plates.generated.ts';
import { skeletalAtlasQuestionSpecs, skeletalAtlasQuestions, SKELETAL_ATLAS_SOURCE_ID, SKELETAL_REPLACED_IDS } from '../content/skeletal-atlas-pack.ts';
import { combinedAtlasAssetsForStructure, isAtlasAssetId } from '../content/atlas-index.ts';
const resolver = readFileSync('content/imageSources.ts', 'utf8');
import { spanishModules } from '../locales/es/index.ts';
import { atlasPlates } from '../content/atlas-plates.generated.ts';

const ids = new Set(content.structures.map((s) => s.id));
const lessons = content.modules.flatMap((m) => m.lessons ?? []);
const provenance = JSON.parse(readFileSync('assets/images/anatomy/skeletal-atlas/provenance.json', 'utf8'));

test('22 plates: 19 additions and 3 in-place replacements, unique, local, hashed', () => {
  assert.equal(skeletalPlates.length, 22);
  assert.equal(skeletalPlates.filter((p) => p.replaces).length, 3);
  assert.deepEqual(skeletalPlates.filter((p) => p.replaces).map((p) => p.id).sort(), [...SKELETAL_REPLACED_IDS].sort());
  assert.equal(new Set(skeletalPlates.map((p) => p.id)).size, 22);
  for (const p of skeletalPlates) {
    assert.ok(existsSync(p.svgPath) && existsSync(p.pngPath), p.id);
    assert.ok(resolver.includes(`'${p.id}': require(`) && resolver.includes(p.pngPath), p.id);
    assert.equal(content.assets.filter((a) => a.id === p.id).length, 1, `no duplicate ${p.id}`);
    assert.equal(content.assets.find((a) => a.id === p.id)!.localAssetPath, p.pngPath);
    assert.ok(!/<text/i.test(readFileSync(p.svgPath, 'utf8')), 'no baked text');
  }
  assert.ok(JSON.stringify(provenance).includes(createHash('sha256').update(readFileSync(skeletalPlates[0].pngPath)).digest('hex')));
  for (const id of SKELETAL_REPLACED_IDS) assert.ok(existsSync(id === 'asset-skull-front' ? 'assets/images/anatomy/gray190-skull-front.png' : id === 'asset-skull-lateral' ? 'assets/images/anatomy/gray188-skull-lateral.png' : 'assets/images/anatomy/gray84-cervical-vertebra.png'), 'legacy file kept');
});

test('every label is a canonical structure with in-range anchors; new source is distinct', () => {
  for (const p of skeletalPlates) for (const l of p.labels) {
    assert.ok(ids.has(l.structureId), `${p.key}:${l.structureId}`);
    assert.ok(l.x > 0 && l.x < 1 && l.y > 0 && l.y < 1);
  }
  assert.ok(content.sources.some((s) => s.id === SKELETAL_ATLAS_SOURCE_ID));
  assert.notEqual(SKELETAL_ATLAS_SOURCE_ID, 'source-boneefied-foundational-atlas');
  assert.equal(atlasPlates.length, 10);
});

test('coverage matrix of requested regions and major IDs', () => {
  const covered = new Set(skeletalPlates.flatMap((p) => p.labels.map((l) => l.structureId)));
  const major = ['frontal-bone', 'parietal-bone', 'temporal-bone', 'occipital-bone', 'sphenoid-bone', 'maxilla', 'mandible', 'foramen-magnum', 'foramen-ovale', 'foramen-spinosum', 'coronal-suture', 'sagittal-suture', 'lambdoid-suture', 'atlas-c1', 'dens', 'cervical-vertebrae', 'thoracic-vertebrae', 'lumbar-vertebrae', 'sternum', 'manubrium', 'xiphoid-process', 'rib-head', 'costal-groove', 'scapula', 'coracoid-process', 'clavicle', 'humeral-head', 'ulnar-styloid', 'scaphoid', 'acetabulum', 'obturator-foramen', 'femoral-head', 'tibial-tuberosity', 'medial-malleolus', 'cuboid', 'joint-cavity', 'glenoid-cavity', 'mcl', 'lcl', 'patellar-ligament'];
  const missing = major.filter((id) => !covered.has(id));
  assert.deepEqual(missing, [], `uncovered: ${missing.join(',')}`);
});

test('full landmark, cranial/facial bone, foramen and atlas/axis coverage', () => {
  const covered = new Set(skeletalPlates.flatMap((p) => p.labels.map((l) => l.structureId)));
  const required = [...skeletalLandmarkStructures.map((s) => s.id),
    'frontal-bone', 'parietal-bone', 'temporal-bone', 'occipital-bone', 'sphenoid-bone', 'ethmoid-bone',
    'maxilla', 'mandible', 'zygomatic-bone', 'nasal-bone', 'lacrimal-bone', 'palatine-bone', 'vomer', 'inferior-nasal-concha',
    'foramen-magnum', 'optic-canal', 'superior-orbital-fissure', 'foramen-rotundum', 'foramen-ovale', 'foramen-spinosum', 'jugular-foramen', 'hypoglossal-canal', 'internal-acoustic-meatus',
    'atlas-c1', 'axis-c2', 'dens', 'femoral-neck', 'inferior-costal-facet', 'superior-costal-facet'];
  const missing = required.filter((id) => !covered.has(id));
  assert.deepEqual(missing, [], `uncovered: ${missing.join(',')}`);
});

test('lesson placements and pelvis move', () => {
  const lesson = (id: string) => lessons.find((l) => l.id === id)!;
  const has = (l: string, a: string) => assert.ok(lesson(l).assetIds?.includes(a), `${l} -> ${a}`);
  has('limb-girdles', 'asset-servier-pelvis');
  assert.ok(!lesson('skull-orientation').assetIds?.includes('asset-servier-pelvis'));
  has('synovial-features', 'asset-skeletal-atlas-synovial-joint');
  has('upper-limb-joints', 'asset-skeletal-atlas-shoulder-joint');
  has('joint-injury-cues', 'asset-skeletal-atlas-shoulder-joint');
  has('joint-injury-cues', 'asset-skeletal-atlas-knee-joint');
  has('lower-limb-joints', 'asset-skeletal-atlas-knee-joint');
  has('foot-ankle-bones', 'asset-skeletal-atlas-foot-dorsal');
  has('hand-wrist-bones', 'asset-skeletal-atlas-hand-palmar');
  has('regional-vertebrae', 'asset-cervical-vertebra');
  has('skull-orientation', 'asset-skull-front');
  for (const p of skeletalPlates) assert.ok(lessons.some((l) => l.assetIds?.includes(p.id)), `${p.id} placed`);
});

test('glossary index finds new plates first; ids recognized', () => {
  const plates = combinedAtlasAssetsForStructure('mastoid-process');
  assert.ok(plates.length > 0 && plates[0].id.startsWith('asset-skeletal-atlas') || SKELETAL_REPLACED_IDS.includes(plates[0].id as never));
  assert.ok(isAtlasAssetId('asset-skull-front') && isAtlasAssetId('asset-atlas-body-planes') && !isAtlasAssetId('asset-vertebral-column'));
  assert.ok(combinedAtlasAssetsForStructure('pubis').some((a) => a.id === 'asset-servier-pelvis'));
  const last = combinedAtlasAssetsForStructure('clavicle');
  assert.ok(last[last.length - 1].id.startsWith('asset-atlas-'));
});

test('orientation conventions are stated', () => {
  for (const p of skeletalPlates) assert.ok(p.orientation.length > 10, p.key);
  assert.match(skeletalPlates.find((p) => p.key === 'skull-base-external')!.orientation, /patient right = viewer left/);
  assert.match(skeletalPlates.find((p) => p.key === 'cranial-floor-internal')!.orientation, /patient right = viewer right/);
});

test('retained artwork uses its actual contain ratio and physically reviewed targets', () => {
  for (const id of ['asset-servier-elbow-joint', 'asset-servier-pelvis']) {
    const asset = content.assets.find((a) => a.id === id)!;
    const png = readFileSync(asset.localAssetPath!);
    assert.equal(asset.imageAspectRatio, png.readUInt32BE(16) / png.readUInt32BE(20));
  }
  const elbow = content.assets.find((a) => a.id === 'asset-servier-elbow-joint')!;
  assert.deepEqual(elbow.hotspots!.find((h) => h.structureId === 'humerus'), { structureId: 'humerus', x: 0.18, y: 0.18, radius: 0.08 });
  const pelvis = content.assets.find((a) => a.id === 'asset-servier-pelvis')!;
  assert.deepEqual(pelvis.hotspots!.find((h) => h.structureId === 'pubis'), { structureId: 'pubis', x: 0.40, y: 0.61, radius: 0.08 });
});

test('24 questions: scorable, separated hotspots, ids unique, old questions kept', () => {
  assert.equal(skeletalAtlasQuestions.length, 24);
  assert.equal(new Set(skeletalAtlasQuestions.map((q) => q.id)).size, 24);
  const all = content.questions.map((q) => q.id);
  assert.equal(new Set(all).size, all.length);
  for (const id of ['q-atlas-plane-coronal', 'q-atlas-skeleton-scapula', 'q-skeleton-radius']) assert.ok(all.includes(id));
  for (const q of skeletalAtlasQuestions) {
    assert.ok(q.id.startsWith('q-skeletal-atlas-') && q.taskType === 'hotspot');
    assert.ok(q.options!.includes(q.answer as string) && ids.has(q.answer as string));
    assert.ok(q.options!.every((o) => ids.has(o)));
    assert.ok(content.assets.some((a) => a.id === q.assetId));
    const h = q.hotspots!;
    for (let i = 0; i < h.length; i++) for (let j = i + 1; j < h.length; j++) {
      assert.ok(Math.hypot((h[i].x - h[j].x) * 1.45, h[i].y - h[j].y) > 0.06, `${q.id}: ${h[i].structureId}/${h[j].structureId}`);
    }
  }
  assert.equal(skeletalAtlasQuestionSpecs.filter((s) => s.retained).length, 2);
  const covered = new Set(skeletalAtlasQuestions.map((q) => q.assetId));
  for (const p of skeletalPlates) assert.ok(covered.has(p.id), p.id);
});

test('Spanish parity: shapes, answers match options, labels, numerals', () => {
  for (const q of skeletalAtlasQuestions) {
    const es = spanishModules[q.moduleId].questions[q.id];
    assert.ok(es, q.id);
    assert.equal(es.options!.length, q.options!.length);
    assert.equal(es.answer, es.options![q.options!.indexOf(q.answer as string)]);
    assert.deepEqual(q.prompt.match(/\d+/g) ?? [], es.prompt.match(/\d+/g) ?? []);
  }
});
