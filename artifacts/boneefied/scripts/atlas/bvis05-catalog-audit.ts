// @ts-nocheck — Node-only content audit, not a release build.
import fs from 'node:fs';
import path from 'node:path';
import { deepStrictEqual } from 'node:assert';
import { content } from '../../content/canonical.ts';
import { bvis05Plates } from '../../content/bvis05-plates.generated.ts';
import { BVIS05_MODULES, isBvis05AssetId } from '../../content/bvis05-pack.ts';
import { bvis05Questions } from '../../content/bvis05-questions.ts';

const root = path.resolve(import.meta.dirname, '../..');
const baselinePath = process.argv[2];
if (!baselinePath) throw new Error('Pass the pre-BVIS05 static catalog snapshot');
const before = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
// Compare the same serialized representation; optional undefined properties are
// intentionally absent from a JSON snapshot.
const now = JSON.parse(JSON.stringify(content));
deepStrictEqual(now.structures, before.structures, 'Do not change the canonical structure catalog');
const scoring = ({ assetId, hotspots, sourceId, ...q }) => q;
for (const old of before.questions) {
  const q = now.questions.find((q) => q.id === old.id);
  deepStrictEqual(scoring(q), scoring(old), `Preserve ${old.id} identity, stem and scoring`);
  if (!BVIS05_MODULES.includes(old.moduleId))
    deepStrictEqual(q, old, `Preserve unrelated question ${old.id}`);
  if (before.assets.find((a) => a.id === old.assetId)?.assetType === 'histology')
    deepStrictEqual(q, old, `Preserve real specimen question ${old.id}`);
}
for (const old of before.modules.filter((m) => !BVIS05_MODULES.includes(m.id)))
  deepStrictEqual(now.modules.find((m) => m.id === old.id), old, `Preserve unrelated module ${old.id}`);
for (const old of before.assets)
  deepStrictEqual(now.assets.find((a) => a.id === old.id), old, `Preserve previous asset ${old.id}`);
const modules = BVIS05_MODULES.map((id) => {
  const m = content.modules.find((m) => m.id === id)!;
  const plates = bvis05Plates.filter((p) => p.moduleId === id);
  const activeIds = new Set(m.lessons?.flatMap((l) => l.assetIds ?? []));
  return { id, structures: content.structures.filter((s) => s.moduleId === id).length,
    lessons: m.lessons?.length ?? 0, plates: plates.length, activeLessonAssets: activeIds.size,
    annotationTargets: plates.reduce((n, p) => n + p.labels.length, 0),
    uniqueAnnotatedStructures: new Set(plates.flatMap((p) => p.labels.map((l) => l.structureId))).size,
    addedQuestions: bvis05Questions.filter((q) => q.moduleId === id).length,
    questions: content.questions.filter((q) => q.moduleId === id).length,
    realSpecimens: [...activeIds].filter((id) => content.assets.find((a) => a.id === id)?.assetType === 'histology').length };
});
const report = {
  command: 'BVIS05', scope: BVIS05_MODULES,
  preservation: `All ${before.structures.length} canonical structures, ${before.questions.length} previous question stems/scoring and ${before.assets.length} previous assets preserved. Unrelated modules unchanged.`,
  addedPlates: bvis05Plates.length, addedQuestions: bvis05Questions.length,
  annotationTargets: bvis05Plates.reduce((n, p) => n + p.labels.length, 0),
  uniqueAnnotatedStructures: new Set(bvis05Plates.flatMap((p) => p.labels.map((l) => l.structureId))).size,
  totalAssets: content.assets.length, totalQuestions: content.questions.length,
  activeImageQuestions: content.questions.filter((q) => isBvis05AssetId(q.assetId)).length,
  questionTypes: Object.fromEntries(['hotspot', 'image-identification'].map((t) => [t, bvis05Questions.filter((q) => q.taskType === t).length])),
  modules, artworkProvenance: 'assets/images/anatomy/bvis05-atlas/provenance.json',
  specimenEvidence: 'docs/atlas/BVIS05_SPECIMEN_LICENSES.json',
  rights: 'Original vectors from factual references only; no imported/traced third-party art. Existing alveolar specimen retains Jpogi CC BY-SA 4.0 exact-file attribution and license.',
  nativeDeviceStatus: 'Not physically tested; phone-width web evidence is not native iPhone/Android evidence.',
  releaseWork: 'None. No release build, deployment or publication.',
};
fs.writeFileSync(path.join(root, 'docs/atlas/BVIS05_REPORT.json'), JSON.stringify(report, null, 2) + '\n');
const manifestFile = path.join(root, 'content/module-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
for (const row of manifest.modules.filter((r) => BVIS05_MODULES.includes(r.id))) {
  const m = modules.find((m) => m.id === row.id)!;
  Object.assign(row, { structures: m.structures, lessons: m.lessons, assets: m.activeLessonAssets, questions: m.questions });
}
manifest.generatedAt = 'BVIS05 assembled-catalog audit';
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
