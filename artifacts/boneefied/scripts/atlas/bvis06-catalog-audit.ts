// @ts-nocheck — Node-only content preservation audit, not a release build.
import fs from 'node:fs';
import path from 'node:path';
import { deepStrictEqual } from 'node:assert';
import { content } from '../../content/canonical.ts';
import { bvis06Plates } from '../../content/bvis06-plates.generated.ts';
import { BVIS06_MODULES, isBvis06AssetId } from '../../content/bvis06-pack.ts';
import { bvis06Questions } from '../../content/bvis06-questions.ts';
const root = path.resolve(import.meta.dirname, '../..');
if (!process.argv[2]) throw new Error('Pass the pre-BVIS06 assembled catalog snapshot');
const before = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const now = JSON.parse(JSON.stringify(content));
deepStrictEqual(now.structures, before.structures, 'Preserve all canonical structures');
deepStrictEqual(now.modules.map((m) => m.id), before.modules.map((m) => m.id), 'Preserve progress-compatible module IDs/order');
const scoring = ({ assetId, hotspots, sourceId, ...q }) => q;
for (const old of before.questions) {
  const q = now.questions.find((q) => q.id === old.id);
  deepStrictEqual(scoring(q), scoring(old), `Preserve ${old.id} identity, stem and scoring`);
  if (!BVIS06_MODULES.includes(old.moduleId) || before.assets.find((a) => a.id === old.assetId)?.assetType === 'histology')
    deepStrictEqual(q, old, `Preserve unrelated/specimen question ${old.id}`);
}
for (const old of before.modules.filter((m) => !BVIS06_MODULES.includes(m.id)))
  deepStrictEqual(now.modules.find((m) => m.id === old.id), old, `Preserve unrelated module ${old.id}`);
for (const old of before.assets)
  deepStrictEqual(now.assets.find((a) => a.id === old.id), old, `Preserve previous asset ${old.id}`);
const modules = BVIS06_MODULES.map((id) => {
  const m = content.modules.find((m) => m.id === id)!;
  const plates = bvis06Plates.filter((p) => p.moduleId === id);
  const active = new Set(m.lessons?.flatMap((l) => l.assetIds ?? []));
  const targeted = new Set(plates.flatMap((p) => p.labels.map((l) => l.structureId)));
  return { id, structures: content.structures.filter((s) => s.moduleId === id).length,
    lessons: m.lessons?.length ?? 0, plates: plates.length, activeLessonAssets: active.size,
    annotationTargets: plates.reduce((n, p) => n + p.labels.length, 0),
    uniqueAnnotatedStructures: targeted.size,
    unillustratedExistingStructures: content.structures.filter((s) => s.moduleId === id && !targeted.has(s.id)).map((s) => s.id),
    addedQuestions: bvis06Questions.filter((q) => q.moduleId === id).length,
    questions: content.questions.filter((q) => q.moduleId === id).length,
    realSpecimens: [...active].filter((id) => content.assets.find((a) => a.id === id)?.assetType === 'histology').length };
});
const report = {
  command: 'BVIS06', scope: BVIS06_MODULES,
  preservation: `All ${before.structures.length} canonical structures, ${before.questions.length} previous question stems/scoring and ${before.assets.length} previous assets preserved. Unrelated modules unchanged.`,
  addedPlates: bvis06Plates.length, addedQuestions: bvis06Questions.length,
  annotationTargets: bvis06Plates.reduce((n, p) => n + p.labels.length, 0),
  uniqueAnnotatedStructures: new Set(bvis06Plates.flatMap((p) => p.labels.map((l) => l.structureId))).size,
  totalAssets: content.assets.length, totalQuestions: content.questions.length,
  activeImageQuestions: content.questions.filter((q) => isBvis06AssetId(q.assetId)).length,
  questionTypes: Object.fromEntries(['hotspot', 'image-identification', 'ordered-sequence'].map((t) => [t, bvis06Questions.filter((q) => q.taskType === t).length])),
  modules, artworkProvenance: 'assets/images/anatomy/bvis06-atlas/provenance.json',
  liveTextOnlyChecks: 'docs/atlas/BVIS06_FACT_CHECKS.json',
  specimenEvidence: 'docs/atlas/BVIS06_SPECIMEN_LICENSES.json',
  rights: 'Original vectors only. No imported/traced third-party art. Existing Josef Reischig kidney specimen remains separate, unchanged and attributed CC BY-SA 3.0.',
  nativeDeviceStatus: 'Not physically tested; phone-width web evidence is not native iPhone/Android or offline evidence.',
  releaseWork: 'None. No release build, deployment or publication.',
};
fs.writeFileSync(path.join(root, 'docs/atlas/BVIS06_REPORT.json'), JSON.stringify(report, null, 2) + '\n');
const manifestFile = path.join(root, 'content/module-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
for (const row of manifest.modules.filter((r) => BVIS06_MODULES.includes(r.id))) {
  const m = modules.find((m) => m.id === row.id)!;
  Object.assign(row, { structures: m.structures, lessons: m.lessons, assets: m.activeLessonAssets, questions: m.questions });
}
manifest.generatedAt = 'BVIS06 assembled-catalog audit';
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
