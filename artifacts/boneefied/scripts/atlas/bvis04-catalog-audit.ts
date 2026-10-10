// @ts-nocheck — Node-only audit; the Expo app compiler deliberately has no Node globals.
// Run with node --experimental-strip-types. This is a data audit, not a release build.
import fs from 'node:fs';
import path from 'node:path';
import { deepStrictEqual } from 'node:assert';
import { content } from '../../content/canonical.ts';
import { bvis04Plates } from '../../content/bvis04-plates.generated.ts';
import { BVIS04_MODULES, isBvis04AssetId } from '../../content/bvis04-pack.ts';
const root = path.resolve(import.meta.dirname, '../..');
const baselinePath = process.argv[2];
let preservation: string | undefined;
if (baselinePath) {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  deepStrictEqual(content.structures, baseline.structures, 'Canonical structures/names/aliases must not change');
  for (const old of baseline.questions) {
    const now = content.questions.find((q) => q.id === old.id)!;
    for (const key of ['moduleId','structureIds','taskType','prompt','answer','options','acceptedAliases'])
      deepStrictEqual((now as any)[key], old[key], `${old.id} changed ${key}`);
  }
  preservation = `All ${baseline.structures.length} canonical structures unchanged; all ${baseline.questions.length} existing question identities, prompts and scoring preserved.`;
}
const modules = BVIS04_MODULES.map((id) => {
  const m = content.modules.find((m) => m.id === id)!;
  const plates = bvis04Plates.filter((p) => p.moduleId === id);
  const assets = new Set(m.lessons?.flatMap((l) => l.assetIds ?? []));
  return {
    id, structures: content.structures.filter((s) => s.moduleId === id).length,
    lessons: m.lessons?.length ?? 0, atlasPlates: plates.length,
    activeLessonAssets: assets.size,
    diagramTargets: plates.reduce((n, p) => n + p.labels.length, 0),
    uniqueAnnotatedStructures: new Set(plates.flatMap((p) => p.labels.map((l) => l.structureId))).size,
    questions: content.questions.filter((q) => q.moduleId === id).length,
    newVisualQuestions: content.questions.filter((q) => q.moduleId === id && q.id.startsWith('q-bvis04-')).length,
    realSpecimens: [...assets].filter((id) => content.assets.find((a) => a.id === id)?.assetType === 'histology').length,
  };
});
const report = {
  command: 'BVIS04', scope: BVIS04_MODULES, preservation,
  plates: bvis04Plates.length, newAssetIds: bvis04Plates.filter((p) => !p.replaces).length,
  sameIdReplacements: bvis04Plates.filter((p) => p.replaces).length,
  totalAssets: content.assets.length, totalQuestions: content.questions.length,
  newQuestions: content.questions.filter((q) => q.id.startsWith('q-bvis04-')).length,
  activeImageQuestions: content.questions.filter((q) => isBvis04AssetId(q.assetId)).length,
  diagramTargets: bvis04Plates.reduce((n, p) => n + p.labels.length, 0),
  modules,
  rights: 'Original vector diagrams; existing real specimens retained with exact-file CC0 (3) and CC BY 4.0 (1) evidence.',
  specimensEvidence: 'docs/atlas/BVIS04_SPECIMEN_LICENSES.json',
  originalArtEvidence: 'assets/images/anatomy/bvis04-atlas/provenance.json',
  nativeOfflineStatus: 'Not physically tested. Local bundling and browser evidence are not proof of native-device offline operation.',
  releaseWork: 'None. No release build, deployment or publication.',
};
fs.writeFileSync(path.join(root, 'docs/atlas/BVIS04_REPORT.json'), JSON.stringify(report, null, 2) + '\n');
// Keep the displayed published-module counts synchronized with the real assembled catalog.
const manifestPath = path.join(root, 'content/module-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const row of manifest.modules.filter((r: { id: string }) => BVIS04_MODULES.includes(r.id))) {
  const m = modules.find((m) => m.id === row.id)!;
  Object.assign(row, { structures: m.structures, lessons: m.lessons, assets: m.activeLessonAssets, questions: m.questions });
}
manifest.generatedAt = 'BVIS04 assembled-catalog audit';
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
