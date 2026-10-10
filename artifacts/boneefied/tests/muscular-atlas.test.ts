import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { content } from '../content/canonical.ts';
import { isMuscularAtlasAssetId, muscularAtlasAssets, muscularGalleryByModule, MUSCULAR_ATLAS_SOURCE_ID, MUSCULAR_REPLACED_IDS, combinedMuscularAssetsForStructure } from '../content/muscular-atlas-pack.ts';
import { muscularPlates } from '../content/muscular-atlas-plates.generated.ts';
import { spanishModules, spanishAssets } from '../locales/es/index.ts';
import { muscularQuestions } from '../content/systems.ts';
import { muscleVisualQuestions, muscleKnowledgeQuestions } from '../content/muscle-region-visual-expansion.ts';
import { advancedMuscleQuestions } from '../content/advanced-muscle-expansion.ts';
import { muscularPracticeExpansion } from '../content/practice-neuromuscular-expansion.ts';
const imageSourcesText = readFileSync(new URL('../content/imageSources.ts', import.meta.url), 'utf8');

const dir = new URL('..', import.meta.url).pathname;
const prov = JSON.parse(readFileSync(`${dir}assets/images/anatomy/muscular-atlas/provenance.json`, 'utf8')).plates as Array<{ id: string; pngPath: string; svgPath: string; sha256: { png: string; svg: string }; featureAnchorMapping: unknown[] }>;
const pngSize = (p: string) => { const b = readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const atlasQs = () => content.questions.filter((q) => q.id.startsWith('q-muscular-atlas-'));

test('20 plates: 9 replacements keep IDs, 11 additions; PNG is 1450x1000 and hashes match', () => {
  assert.equal(muscularPlates.length, 20);
  assert.equal(MUSCULAR_REPLACED_IDS.length, 9);
  assert.equal(prov.length, 20);
  for (const p of prov) {
    const [w, h] = pngSize(`${dir}${p.pngPath}`);
    assert.deepEqual([w, h], [1450, 1000], p.id);
    assert.equal(createHash('sha256').update(readFileSync(`${dir}${p.pngPath}`)).digest('hex'), p.sha256.png);
    assert.equal(createHash('sha256').update(readFileSync(`${dir}${p.svgPath}`)).digest('hex'), p.sha256.svg);
    assert.ok(p.featureAnchorMapping.length > 0);
    assert.ok(imageSourcesText.includes(`'${p.id}': require('@/${p.pngPath}')`), `${p.id} registered`);
    assert.ok(content.assets.some((a) => a.id === p.id));
  }
});

test('SVGs carry no baked text', () => {
  for (const p of prov) assert.ok(!/<text[\s>]/.test(readFileSync(`${dir}${p.svgPath}`, 'utf8')), p.id);
});

test('replacement IDs get fresh original rights and old files stay on disk', () => {
  for (const id of MUSCULAR_REPLACED_IDS) {
    const a = content.assets.find((x) => x.id === id)!;
    assert.equal(a.sourceId, MUSCULAR_ATLAS_SOURCE_ID);
    assert.ok(!a.sourceUrl && !a.rightsUrl, id);
    assert.match(a.attributionLicense ?? '', /all rights reserved/i);
    assert.doesNotMatch(a.attributionLicense ?? '', /CC BY/);
  }
  for (const f of ['openstax-diaphragm-labeled.jpg', 'commons-rotator-cuff.png']) assert.ok(existsSync(`${dir}assets/images/anatomy/${f}`), f);
  const src = content.sources.find((s) => s.id === MUSCULAR_ATLAS_SOURCE_ID)!;
  assert.match(src.attributionLicenseStatus, /ALL RIGHTS RESERVED|all rights reserved/i);
});

test('all 73 canonical muscles are pinned on plates and targeted by questions', () => {
  const ms = content.structures.filter((s) => s.moduleId === 'muscular-system').map((s) => s.id);
  assert.equal(ms.length, 73);
  const labelled = new Set(muscularAtlasAssets.flatMap((a) => a.labels!.map((l) => l.structureId)));
  const targeted = new Set(content.questions.filter((q) => isMuscularAtlasAssetId(q.assetId)).flatMap((q) => q.structureIds));
  for (const id of ms) { assert.ok(labelled.has(id), `label ${id}`); assert.ok(targeted.has(id), `question ${id}`); assert.ok(combinedMuscularAssetsForStructure(id).length > 0); }
});

test('39 old muscle-visual hotspot questions keep identity and point at their new label', () => {
  const vis = content.questions.filter((q) => q.id.startsWith('q-muscle-visual-'));
  assert.equal(vis.length, 39);
  for (const q of vis) {
    assert.equal(q.taskType, 'hotspot'); assert.equal(q.sourceId, MUSCULAR_ATLAS_SOURCE_ID);
    const a = content.assets.find((x) => x.id === q.assetId)!;
    const l = a.labels!.find((x) => x.structureId === q.answer)!;
    assert.ok(l, q.id); assert.deepEqual(q.hotspots, [{ structureId: l.structureId, x: l.x, y: l.y, radius: l.radius }]);
  }
  const at = (id: string) => vis.find((q) => q.id === `q-muscle-visual-${id}`)!.assetId;
  assert.equal(at('soleus'), 'asset-muscular-atlas-calf'); assert.equal(at('semimembranosus'), 'asset-muscular-atlas-deep-thigh');
  assert.equal(at('brachialis'), 'asset-openstax-muscle-anterior-arm'); assert.equal(at('tibialis-anterior'), 'asset-muscular-atlas-anterior-leg');
  for (const id of ['levator-scapulae', 'rhomboid-major', 'erector-spinae']) assert.equal(at(id), 'asset-muscular-atlas-deep-back');
});

test('old question set and OIA questions are unchanged', () => {
  const originals = [...muscularQuestions, ...muscleVisualQuestions, ...muscleKnowledgeQuestions,
    ...advancedMuscleQuestions, ...muscularPracticeExpansion];
  for (const old of originals) {
    const current = content.questions.find((q) => q.id === old.id);
    assert.ok(current, old.id);
    for (const field of ['moduleId', 'structureIds', 'taskType', 'answer', 'acceptedAliases', 'options'] as const) {
      assert.deepEqual(current[field], old[field], `${old.id}: ${field}`);
    }
    if (old.taskType === 'muscle-origin-insertion' || old.taskType === 'muscle-action') {
      assert.deepEqual(current, old, `${old.id}: original action/attachment question changed`);
    }
  }
});

test('new questions: counts, types, single-marker rules, Spanish parity', () => {
  const qs = atlasQs();
  assert.ok(qs.filter((q) => q.taskType === 'hotspot').length >= 20);
  assert.equal(qs.filter((q) => q.taskType === 'image-identification').length, 3);
  assert.equal(qs.filter((q) => q.taskType === 'muscle-action').length, 8);
  const es = spanishModules['muscular-system'].questions as Record<string, { prompt: string }>;
  for (const q of qs) {
    assert.ok(es[q.id]?.prompt, q.id);
    if (q.taskType !== 'hotspot') { assert.equal(q.hotspots!.length, 1); assert.equal(q.hotspots![0].structureId, q.structureIds[0]); }
    if (q.taskType === 'muscle-action') { assert.ok(q.options && q.options.length >= 3, q.id); assert.ok(!q.prompt.toLowerCase().includes(q.structureIds[0].replace(/-/g, ' '))); }
  }
  for (const a of muscularAtlasAssets) assert.ok((spanishAssets as Record<string, { title: string }>)[a.id]?.title, a.id);
});

test('every plate has a useful question, a lesson, and gallery is curated', () => {
  const mod = content.modules.find((m) => m.id === 'muscular-system')!;
  for (const lesson of mod.lessons!) {
    assert.ok(lesson.assetIds?.every(isMuscularAtlasAssetId), `${lesson.id}: legacy illustration still displayed`);
  }
  for (const q of content.questions.filter((q) => q.moduleId === mod.id && q.assetId)) {
    assert.ok(isMuscularAtlasAssetId(q.assetId), `${q.id}: legacy image question still displayed`);
    if (q.taskType === 'image-identification') assert.equal(q.hotspots?.length, 1, q.id);
  }
  for (const a of muscularAtlasAssets) {
    assert.ok(content.questions.some((q) => q.assetId === a.id), `question ${a.id}`);
    assert.ok(mod.lessons!.some((l) => l.assetIds?.includes(a.id)), `lesson ${a.id}`);
  }
  const g = muscularGalleryByModule['muscular-system'];
  assert.ok(g.length >= 3 && g.length <= 5);
});
