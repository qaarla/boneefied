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
const mod = content.modules.find(m => m.id === 'male-reproductive')!;
const ids = new Set([
  ...mod.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === mod.id).flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => s.moduleId === mod.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const assets = content.assets.filter(a => ids.has(a.id));
const source = readFileSync(new URL('scripts/atlas/bvis06-repro.mjs', root), 'utf8');

test('male publication union is exactly two original plates and 44 numbered targets', () => {
  assert.deepEqual(assets.map(a => a.id), ['asset-bvis06-male-system', 'asset-bvis06-testis-ducts']);
  assert.deepEqual(assets.map(a => a.labels!.length), [21, 23]);
  assert.equal(content.structures.filter(s => s.moduleId === mod.id).length, 47);
  assert.ok(assets.every(a => a.assetType === 'diagram'));
});

test('all 44 male visual questions retain valid anatomy mappings and scoring', () => {
  const qs = content.questions.filter(q => q.moduleId === mod.id && q.assetId);
  assert.equal(qs.length, 44);
  assert.deepEqual(qs.reduce((o, q) => ({ ...o, [q.taskType]: (o[q.taskType] ?? 0) + 1 }), {} as Record<string, number>),
    { hotspot: 41, 'image-identification': 2, 'ordered-sequence': 1 });
  for (const q of qs) {
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    const a = assets.find(a => a.id === q.assetId)!;
    for (const h of q.hotspots ?? []) {
      assert.ok(a.labels!.some(l => l.structureId === h.structureId && l.x === h.x && l.y === h.y), q.id);
      if (q.taskType === 'hotspot') assert.equal(answerIsCorrect(h.structureId, q), q.structureIds.includes(h.structureId), q.id);
    }
  }
  const legacy = qs.find(q => q.id === 'q-visual-male-testis')!;
  assert.equal(legacy.answer, 'Testis');
  assert.ok(answerIsCorrect('male-reproductive-testis', legacy));
  const spanish = readFileSync(new URL('locales/es/modules/male-reproductive.ts', root), 'utf8');
  assert.match(spanish, /'q-visual-male-testis': \{[^}]*acceptedAliases: \['male-reproductive-testis'\]/);
});

test('male local image manifest, source hashes and original rights remain consistent', () => {
  const proof = JSON.parse(readFileSync(new URL('assets/images/anatomy/bvis06-atlas/provenance.json', root), 'utf8'));
  const manifest = readFileSync(new URL('content/bvis06-image-sources.generated.ts', root), 'utf8');
  for (const a of assets) {
    const p = bvis06Plates.find(p => p.id === a.id)!;
    const record = proof.plates.find((p: { id: string }) => p.id === a.id);
    for (const ext of ['png', 'svg'] as const)
      assert.equal(createHash('sha256').update(readFileSync(new URL(ext === 'png' ? p.pngPath : p.svgPath, root))).digest('hex'), record.sha256[ext]);
    assert.deepEqual(p.labels.map(l => [l.structureId, l.x, l.y]), a.labels!.map(l => [l.structureId, l.x, l.y]));
    assert.ok(manifest.includes(`'${p.id}': require('@/${p.pngPath}')`));
    assert.match(a.attributionLicense, /Original Boneefied/);
    assert.match(record.rights, /no third-party illustration imported, traced or reproduced/);
    if (p.teachingKind === 'tissue-schematic') assert.match(a.specimenNote!, /not a real specimen/);
  }
});

test('overview keeps vesicle junctions and bulbourethral drainage anatomically distinct', () => {
  assert.match(source, /pts: \[\[402, 400\], \[420, 390\], \[440, 378\]\]/);
  assert.match(source, /pts: \[\[538, 400\], \[520, 390\], \[500, 378\]\]/);
  assert.match(source, /E\(x, y, 68, 86\)/);
  assert.ok(1245 - 1105 > 2 * 68, 'Paired cavernous bodies must not overlap');
  const p = bvis06Plates.find(p => p.key === 'male-system')!;
  assert.match(p.description[0], /proximal spongy urethra, not the membranous segment/);
  assert.match(p.description[1], /uretra esponjosa proximal, no en el segmento membranoso/);
  assert.match(p.description[0], /Posterior ducts and glands are exposed/);
});

test('Sertoli cytoplasm spans basal-to-luminal surfaces and the barrier marks intercellular junctions', () => {
  const p = bvis06Plates.find(p => p.key === 'testis-ducts')!;
  const svg = readFileSync(new URL(p.svgPath, root), 'utf8');
  assert.equal((svg.match(/A204 204 0 0 1/g) ?? []).length, 12);
  assert.equal((svg.match(/A84 84 0 0 0/g) ?? []).length, 12);
  assert.equal((svg.match(/A170 170 0 0 1/g) ?? []).length, 12);
  assert.doesNotMatch(svg, /A170 170 0 1 1/);
  assert.ok(188 - 12 > 170, 'Spermatogonia remain basal to the junctions');
  assert.ok(150 + 18 < 170, 'The depicted primary spermatocytes remain adluminal');
  assert.ok(112 + 9 < 170, 'Spermatids remain adluminal');
});

test('male-only cache revisions and centered annotation pan policy preserve other resources', () => {
  for (const a of assets) assert.match(anatomyImageCacheKey(`https://example.test/${a.localAssetPath}`), /male-relations-1/);
  // The subsequent female correction legitimately versions its own raster.
  assert.match(anatomyImageCacheKey('https://example.test/bvis06-17-female-gross.png'), /female-relations-1/);
  const viewer = readFileSync(new URL('components/AnatomyImageViewer.tsx', root), 'utf8');
  assert.match(viewer, /\.\.\.maleReproductiveAssets/);
  assert.match(viewer, /viewerPanBounds\([^\n]+maleReproductiveAssets\.has/);
});
