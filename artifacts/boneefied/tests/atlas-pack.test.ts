import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { content } from '../content/canonical.ts';
import { atlasAssets, atlasAssetsForStructure, atlasQuestions, ATLAS_SOURCE_ID } from '../content/atlas-pack.ts';
import { createGlossaryIndex } from '../content/glossary.ts';
import { spanishAssets, spanishModules } from '../locales/es/index.ts';

const prov = JSON.parse(readFileSync('assets/images/anatomy/atlas/provenance.json', 'utf8')).plates as any[];
const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
const imageSources = readFileSync('content/imageSources.ts', 'utf8');

test('exactly ten original plates with svg and png siblings', () => {
  assert.equal(atlasAssets.length, 10);
  assert.equal(prov.length, 10);
  for (const a of atlasAssets) {
    assert.ok(content.assets.some((x) => x.id === a.id));
    assert.ok(existsSync(a.localAssetPath!), a.id);
    assert.ok(existsSync(a.localAssetPath!.replace(/\.png$/, '.svg')));
    assert.ok(imageSources.includes(`'${a.id}': require('@/${a.localAssetPath}')`));
    assert.equal(a.imageAspectRatio, 1.45);
    assert.equal(a.labelStatus, 'unlabeled');
    assert.match(a.attributionLicense, /No CC0/);
  }
});

test('provenance is machine readable and hashes match', () => {
  for (const p of prov) {
    assert.equal(p.creator, 'Boneefied');
    assert.match(p.rights, /Original Boneefied project artwork/);
    assert.ok(p.references.every((r: any) => r.checked === '2026-10-10' && /^https:\/\//.test(r.url)));
    assert.equal(p.dimensions.width / p.dimensions.height, 1.45);
    assert.equal(p.sha256.svg, sha(p.svgPath));
    assert.equal(p.sha256.png, sha(p.pngPath));
    assert.ok(p.labelMapping.length >= 3 && p.purpose && p.orientation && p.notice);
    assert.ok(!/<text|<image|<linearGradient|<radialGradient|<filter/.test(readFileSync(p.svgPath, 'utf8')), 'no baked text, rasters or gradients');
  }
});

test('lessons carry the new foundational pack', () => {
  const lessonAssets = (m: string, l: string) => content.modules.find((x) => x.id === m)!.lessons!.find((x) => x.id === l)!.assetIds ?? [];
  assert.ok(lessonAssets('anatomy-foundations', 'foundations-position-directions').includes('asset-atlas-anterior-position'));
  assert.ok(lessonAssets('anatomy-foundations', 'foundations-position-directions').includes('asset-atlas-posterior-position'));
  assert.ok(lessonAssets('anatomy-foundations', 'foundations-planes-sections')[0] === 'asset-atlas-body-planes');
  assert.ok(lessonAssets('anatomy-foundations', 'foundations-body-cavities').includes('asset-atlas-body-cavities'));
  assert.ok(lessonAssets('anatomy-foundations', 'foundations-abdomen-map').includes('asset-atlas-abdominal-regions'));
  assert.ok(lessonAssets('skeletal-system', 'limb-girdles').includes('asset-atlas-skeleton-axial-appendicular'));
  const used = new Set(content.modules.flatMap((m) => m.lessons?.flatMap((l) => l.assetIds ?? []) ?? []));
  for (const a of atlasAssets) assert.ok(used.has(a.id), a.id);
  assert.ok(content.assets.some((a) => a.id === 'asset-original-body-cavities'), 'legacy retained');
});

test('glossary structures reach their plates and labels resolve to structures', () => {
  const ids = new Set(content.structures.map((s) => s.id));
  const glossary = new Set(createGlossaryIndex(content).map((e) => e.structure.id));
  for (const a of atlasAssets) for (const l of a.labels!) { assert.ok(ids.has(l.structureId), l.structureId); assert.ok(glossary.has(l.structureId), `glossary ${l.structureId}`); }
  assert.ok(atlasAssetsForStructure('spleen').some((a) => a.id === 'asset-atlas-organ-locations'));
  assert.ok(atlasAssetsForStructure('scapula').some((a) => a.id === 'asset-atlas-skeleton-posterior'));
  assert.equal(atlasAssetsForStructure('anatomical-position').length, 2, 'reference-position context must not depend on a physical marker');
  assert.equal(atlasAssetsForStructure('ventral-cavity')[0].id, 'asset-atlas-body-cavities');
});

test('anatomical side conventions in plate geometry', () => {
  const at = (plate: string, id: string) => atlasAssets.find((a) => a.id === `asset-atlas-${plate}`)!.labels!.find((l) => l.structureId === id)!;
  assert.ok(at('organ-locations', 'liver').x < 0.5 && at('organ-locations', 'stomach').x > 0.5 && at('organ-locations', 'spleen').x > 0.5);
  assert.ok(at('organ-locations', 'heart').x > 0.5);
  assert.ok(at('abdominal-quadrants', 'right-upper-quadrant').x < 0.5);
  assert.ok(at('abdominal-regions', 'right-hypochondriac-region').x < 0.5 && at('abdominal-regions', 'left-iliac-region').x > 0.5);
});

test('six valid hotspot questions reuse the same base assets', () => {
  assert.equal(atlasQuestions.length, 6);
  assert.equal(new Set(atlasQuestions.map((q) => q.id)).size, 6);
  for (const q of atlasQuestions) {
    assert.equal(q.taskType, 'hotspot');
    assert.equal(q.sourceId, ATLAS_SOURCE_ID);
    assert.ok(content.questions.some((x) => x.id === q.id));
    assert.equal(q.answer, q.structureIds[0]);
    assert.ok(Array.isArray(q.options), 'image input requires an options array for string answers');
    const asset = atlasAssets.find((a) => a.id === q.assetId)!;
    assert.ok(asset);
    assert.ok(q.hotspots!.length >= 3 && q.hotspots!.some((h) => h.structureId === q.answer));
    for (const h of q.hotspots!) {
      assert.ok(h.x > 0 && h.x < 1 && h.y > 0 && h.y < 1 && h.radius > 0);
      assert.deepEqual(asset.hotspots!.find((x) => x.structureId === h.structureId), h);
    }
    assert.ok(spanishModules[q.moduleId].questions[q.id].prompt);
  }
  assert.equal(content.questions.filter((q) => q.id.startsWith('q-atlas-')).length, 6);
});

test('Spanish copy covers every plate and label', () => {
  for (const a of atlasAssets) {
    const es = spanishAssets[a.id];
    assert.ok(es.title && es.description && es.attributionLicense);
    assert.equal(es.labels!.length, a.labels!.length);
  }
});
