// @ts-nocheck — Node-only audit; does not build or publish an application.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { content } from '../../content/canonical.ts';
import { combinedAtlasAssetsForStructure, isAtlasAssetId } from '../../content/atlas-index.ts';
import { annotationKey, spreadAtlasCallouts, hasMarkerOverlap } from '../../components/viewerMarkerLayout.ts';
import { visualKind } from '../../content/visual-disclosure.ts';

const root = path.resolve(import.meta.dirname, '../..');
const originals = new Set([
  'source-boneefied-original-visuals', 'source-boneefied-foundational-atlas',
  'source-boneefied-skeletal-atlas', 'source-boneefied-muscular-atlas',
  'source-boneefied-bvis04-atlas', 'source-boneefied-bvis05-atlas', 'source-boneefied-bvis06-atlas',
]);
export function rightsGroup(a) {
  if (originals.has(a.sourceId)) return 'originalBoneefiedVectors';
  if (/bioart|niaid/i.test(a.sourceUrl ?? a.sourceId) && /public domain|CC0/i.test(a.attributionLicense)) return 'nihBioArtPublicDomain';
  if (a.sourceId === 'source-servier-medical-art') return 'servierDerived';
  if (/public domain|CC0/i.test(a.attributionLicense)) return 'otherVerifiedPublicDomain';
  return 'otherVerifiedLicensed';
}
export function buildVisualAudit() {
  const modules = content.modules.filter((m) => m.published);
  const moduleIds = new Set(modules.map((m) => m.id));
  const questions = content.questions.filter((q) => moduleIds.has(q.moduleId));
  const structures = content.structures.filter((s) => moduleIds.has(s.moduleId));
  const assets = new Map(content.assets.map((a) => [a.id, a]));
  const glossary = new Map(structures.map((s) => [s.id, combinedAtlasAssetsForStructure(s.id)]));
  const activeIds = new Set([
    ...modules.flatMap((m) => (m.lessons ?? []).flatMap((l) => l.assetIds ?? [])),
    ...questions.flatMap((q) => q.assetId ? [q.assetId] : []),
    ...[...glossary.values()].flatMap((list) => list.map((a) => a.id)),
  ]);
  const errors = [];
  const unique = (items, label) => {
    if (new Set(items.map((x) => x.id)).size !== items.length) errors.push(`Duplicate ${label} ID`);
  };
  unique(content.assets, 'asset'); unique(content.questions, 'question'); unique(content.sources, 'source');
  for (const q of questions) if (q.assetId && !assets.has(q.assetId)) errors.push(`${q.id}: missing ${q.assetId}`);
  const resolver = ['imageSources.ts', ...fs.readdirSync(path.join(root, 'content')).filter((f) => /image-sources\.generated\.ts$/.test(f))]
    .map((f) => fs.readFileSync(path.join(root, 'content', f), 'utf8')).join('\n');
  const resolverFileInputs = new Set([...resolver.matchAll(/require\(['"]([^'"]+)['"]\)/g)]
    .map((match) => match[1].startsWith('@/') ? path.resolve(root, match[1].slice(2)) : path.resolve(root, 'content', match[1])));
  const geometry = {};
  const inventory = content.assets.map((a) => {
    const active = activeIds.has(a.id);
    const source = content.sources.find((s) => s.id === a.sourceId);
    if (!source) errors.push(`${a.id}: missing source`);
    if (!a.localAssetPath || !fs.existsSync(path.join(root, a.localAssetPath))) errors.push(`${a.id}: missing local file`);
    if (!new RegExp(`['"]${a.id}['"]\\s*:`).test(resolver)) errors.push(`${a.id}: missing static resolver`);
    if (active && (a.verificationStatus !== 'verified' || source?.verificationStatus !== 'verified')) errors.push(`${a.id}: unverified published asset/source`);
    if (active && (!a.attributionLicense || (!originals.has(a.sourceId) && (!a.sourceUrl || !a.rightsUrl)))) errors.push(`${a.id}: incomplete rights evidence`);
    const labels = a.labels ?? [];
    if (new Set(labels.map(annotationKey)).size !== labels.length) errors.push(`${a.id}: duplicate annotation identity`);
    for (const point of [...labels, ...(a.hotspots ?? [])]) {
      if (!content.structures.some((s) => s.id === point.structureId) || point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1 || point.radius <= 0)
        errors.push(`${a.id}: invalid anatomical target`);
    }
    let phone = 'local image; no current device-render check';
    if (isAtlasAssetId(a.id) && labels.length) {
      for (const width of [273, 343]) for (const size of [44, 60]) {
        const height = Math.max(width / (a.imageAspectRatio ?? 1.45), Math.ceil(labels.length / 2) * (size + 8));
        const points = spreadAtlasCallouts(labels.map((l) => ({ x: l.x * width, y: l.y * height })), width, height, size, size);
        const bounds = points.map((p) => ({ left: p.x - size / 2, top: p.y - size / 2, width: size, height: size }));
        if (hasMarkerOverlap(bounds) || bounds.some((b) => b.left < 0 || b.top < 0 || b.left + size > width || b.top + size > height))
          errors.push(`${a.id}: phone/enlarged callout geometry`);
      }
      phone = 'phone/enlarged callout geometry checked (273/343px content; 44/60px controls); not a native/device screenshot';
    }
    geometry[a.id] = phone;
    return { id: a.id, active, disposition: active ? 'Published study reference' : 'Retired registered archive; not orphaned or reachable in published study',
      kind: visualKind(a), sourceId: a.sourceId, rightsGroup: rightsGroup(a), license: a.attributionLicense,
      sourceUrl: a.sourceUrl ?? null, rightsUrl: a.rightsUrl ?? null, localPath: a.localAssetPath,
      sha256: a.localAssetPath && fs.existsSync(path.join(root, a.localAssetPath)) ? createHash('sha256').update(fs.readFileSync(path.join(root, a.localAssetPath))).digest('hex') : null,
      provenanceStatus: originals.has(a.sourceId) ? 'Original in-project vector/source record; generation masters and pack provenance retained locally' : 'Existing verified creator/license metadata and exact source/rights links; not newly live-reverified in BVIS07',
      learnLabels: !!labels.length || a.labelStatus === 'labeled',
      recall: a.labelStatus === 'unlabeled' ? 'Available: labels hidden/revealed on the same local image' : 'Not available: baked labels must not be falsely described as hidden',
      phone };
  });
  const published = inventory.filter((a) => a.active);
  const scan = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? scan(file) : /\.(png|jpg|jpeg|webp)$/i.test(entry.name) ? [file] : [];
  });
  const registeredFiles = new Set(inventory.map((a) => path.resolve(root, a.localPath)));
  const rasterFiles = scan(path.join(root, 'assets/images/anatomy'));
  const fileArchive = rasterFiles.filter((file) => !registeredFiles.has(file)).map((file) => ({
    localPath: path.relative(root, file),
    disposition: resolverFileInputs.has(file) ? 'Superseded file still statically imported by legacy resolver entry; final catalog points to replacement' : 'Unregistered, unresolved historical raster; not used by published lessons/questions/glossary',
    published: false,
    action: 'Retained, not silently deleted; excluded from published visual counts',
  }));
  const byteGroups = new Map();
  for (const a of published) byteGroups.set(a.sha256, [...(byteGroups.get(a.sha256) ?? []), a.id]);
  const duplicatePublishedImageBytes = [...byteGroups.values()].filter((ids) => ids.length > 1);
  const matrix = [];
  const moduleCoverage = modules.map((m) => {
    const ss = structures.filter((s) => s.moduleId === m.id);
    const qs = questions.filter((q) => q.moduleId === m.id);
    const refs = new Set([...(m.lessons ?? []).flatMap((l) => l.assetIds ?? []), ...qs.flatMap((q) => q.assetId ? [q.assetId] : []),
      ...ss.flatMap((s) => (glossary.get(s.id) ?? []).map((a) => a.id))]);
    for (const category of [...new Set(ss.map((s) => s.category))]) {
      const members = ss.filter((s) => s.category === category);
      const ids = new Set(members.map((s) => s.id));
      const direct = [...refs].filter((id) => {
        const a = assets.get(id);
        return [...(a?.labels ?? []), ...(a?.hotspots ?? [])].some((l) => ids.has(l.structureId));
      });
      const context = [...new Set((m.lessons ?? []).filter((l) => l.structureIds.some((id) => ids.has(id))).flatMap((l) => l.assetIds ?? []))]
        .filter((id) => !direct.includes(id));
      const visible = new Set(direct.flatMap((id) => [...(assets.get(id)?.labels ?? []), ...(assets.get(id)?.hotspots ?? [])]
        .filter((l) => ids.has(l.structureId)).map((l) => l.structureId)));
      const visualQuestions = qs.filter((q) => q.assetId && q.structureIds.some((id) => ids.has(id)));
      const meaningful = visualQuestions.filter((q) => ['hotspot', 'image-identification', 'histology-identification', 'ordered-sequence', 'bone-laterality', 'muscle-action', 'function-relationship'].includes(q.taskType));
      const selected = [...direct, ...context].map((id) => assets.get(id)).filter(Boolean);
      matrix.push({ moduleId: m.id, module: m.title, category, structures: members.length,
        highPriorityStructures: members.filter((s) => s.examPriority).length,
        cleanStudyVisual: direct.length ? 'Direct annotated visual' : context.length ? 'Lesson/context visual only; no structure-level label claim' : 'Text-only; not expanded in this bounded audit',
        directlyAnnotatedStructures: visible.size, diagramIds: selected.filter((a) => visualKind(a) === 'diagram').map((a) => a.id),
        genuineHistologyIds: selected.filter((a) => visualKind(a) === 'histology').map((a) => a.id),
        genuineSpecimenIds: selected.filter((a) => visualKind(a) === 'specimen').map((a) => a.id),
        modelImageIds: selected.filter((a) => visualKind(a) === 'model').map((a) => a.id),
        learnLabels: selected.some((a) => a.labels?.length || a.labelStatus === 'labeled') ? 'Usable labels present; coverage limited to depicted targets' : selected.length ? 'Visual recognition/context without overlay labels' : 'Not applicable',
        recall: selected.some((a) => a.labelStatus === 'unlabeled') ? 'Unlabeled/reveal available' : selected.length ? 'Baked labels only; no false unlabeled claim' : 'Not applicable',
        meaningfulVisualQuestions: meaningful.length, visualQuestionIds: meaningful.map((q) => q.id),
        rights: selected.length ? 'Verified source/license; originals or credited licensed/public-domain media' : 'Not applicable',
        phone: selected.some((a) => /geometry checked/.test(geometry[a.id])) ? 'Phone/enlarged target geometry checked; current native/offline test not performed' : 'No current device-render evidence',
        directlyIllustratedIds: [...visible], contextAssetIds: context,
        notDirectlyIllustratedIds: members.filter((s) => !visible.has(s.id)).map((s) => s.id) });
    }
    return { id: m.id, title: m.title, structures: ss.length, lessons: m.lessons?.length ?? 0,
      visualIds: [...refs], visuals: refs.size, imageBackedQuestions: qs.filter((q) => q.assetId).length,
      hotspotQuestions: qs.filter((q) => q.taskType === 'hotspot').length };
  });
  const counts = { totalPublishedVisuals: published.length,
    originalBoneefiedVectors: published.filter((a) => a.rightsGroup === 'originalBoneefiedVectors').length,
    bvis01To06OriginalAtlasVectors: published.filter((a) => a.rightsGroup === 'originalBoneefiedVectors' && a.sourceId !== 'source-boneefied-original-visuals').length,
    preExistingOriginalStudyDiagrams: published.filter((a) => a.sourceId === 'source-boneefied-original-visuals').length,
    originalVectorsAddedByBvis07: 0,
    nihBioArtPublicDomain: published.filter((a) => a.rightsGroup === 'nihBioArtPublicDomain').length,
    servierDerived: published.filter((a) => a.rightsGroup === 'servierDerived').length,
    otherVerifiedPublicDomain: published.filter((a) => a.rightsGroup === 'otherVerifiedPublicDomain').length,
    otherVerifiedLicensed: published.filter((a) => a.rightsGroup === 'otherVerifiedLicensed').length,
    imageBackedQuestions: questions.filter((q) => q.assetId).length,
    hotspotQuestions: questions.filter((q) => q.taskType === 'hotspot').length,
    modulesWithVisualCoverage: moduleCoverage.filter((m) => m.visuals > 0).length,
    publishedModules: modules.length, registeredAssets: content.assets.length, retiredRegisteredAssets: inventory.filter((a) => !a.active).length,
    totalQuestions: questions.length, totalStructures: structures.length };
  return { command: 'BVIS07', countingRule: 'Unique assets reachable by published lessons, questions, or glossary atlas references. Registered retired assets excluded. PNG+SVG of one plate count as one visual.',
    scope: 'Introductory college human anatomy plus modest depth; 2D only; no illustration expansion.',
    counts, errors, moduleCoverage, matrix, inventory, fileArchive, duplicatePublishedImageBytes,
    limitations: ['Local static bundle inputs verified; physical native-device offline use not tested.', 'Geometry checks are not full phone screenshots or independent anatomical certification.',
      'Some minor/deeper structure categories remain context-supported or text-only; the matrix explicitly distinguishes them from directly annotated coverage.',
      'No new genuine specimens were acquired; diagrams must never be labeled as photomicrographs.'],
    releaseWork: 'No application build, deployment, publication, 3D model, or website change.' };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const report = buildVisualAudit();
  if (report.errors.length) throw new Error(report.errors.join('\n'));
  const output = path.join(root, 'docs/atlas');
  fs.writeFileSync(path.join(output, 'BVIS07_REPORT.json'), JSON.stringify(report, null, 2) + '\n');
  const csv = (v) => `"${String(v).replaceAll('"', '""')}"`;
  const fields = ['moduleId', 'category', 'structures', 'highPriorityStructures', 'cleanStudyVisual', 'directlyAnnotatedStructures', 'learnLabels', 'recall', 'meaningfulVisualQuestions', 'rights', 'phone', 'diagramIds', 'genuineHistologyIds', 'genuineSpecimenIds', 'modelImageIds'];
  fs.writeFileSync(path.join(output, 'BVIS07_COVERAGE_MATRIX.csv'), fields.join(',') + '\n' + report.matrix.map((row) => fields.map((key) => csv(Array.isArray(row[key]) ? row[key].join(' | ') : row[key])).join(',')).join('\n') + '\n');
  const lines = ['# BVIS07 coverage matrix', '', report.countingRule, '',
    'Direct labels do not imply coverage of every structure in a category. Context-only rows and unillustrated IDs are disclosed in the JSON report. Phone status here is automated callout geometry, not native-device/offline evidence.', '',
    '| Published module | Category | Direct targets / structures | Study visual | Diagrams / histology / specimens / models | Learn | Recall | Meaningful visual questions | Rights | Phone |',
    '|---|---|---:|---|---|---|---|---:|---|---|',
    ...report.matrix.map((r) => `| ${r.module} | ${r.category} | ${r.directlyAnnotatedStructures}/${r.structures} | ${r.cleanStudyVisual} | ${r.diagramIds.length}/${r.genuineHistologyIds.length}/${r.genuineSpecimenIds.length}/${r.modelImageIds.length} | ${r.learnLabels} | ${r.recall} | ${r.meaningfulVisualQuestions} | ${r.rights} | ${r.phone} |`)];
  fs.writeFileSync(path.join(output, 'BVIS07_COVERAGE_MATRIX.md'), lines.join('\n') + '\n');
  const manifestFile = path.join(root, 'content/module-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  for (const row of manifest.modules) {
    const m = content.modules.find((m) => m.id === row.id);
    Object.assign(row, { structures: content.structures.filter((s) => s.moduleId === m.id).length,
      lessons: m.lessons?.length ?? 0, assets: new Set((m.lessons ?? []).flatMap((l) => l.assetIds ?? [])).size,
      questions: content.questions.filter((q) => q.moduleId === m.id).length });
  }
  manifest.generatedAt = 'BVIS07 assembled-catalog visual audit';
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ counts: report.counts, errors: report.errors, matrixRows: report.matrix.length, modules: report.moduleCoverage.map(({ id, visuals, imageBackedQuestions }) => ({ id, visuals, imageBackedQuestions })) }, null, 2));
}
