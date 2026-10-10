import type { Asset, Question } from './model';
import { bvis05Plates } from './bvis05-plates.generated.ts';
import { BVIS05_MODULES, BVIS05_SOURCE, bvis05Name, bvis05PlateFor, bvis05Structures } from './bvis05-pack.ts';

export interface Bvis05QuestionCopy { q: Question; esPrompt: string; esExplanation: string }
export const bvis05QuestionCopy: Bvis05QuestionCopy[] = [];
const located = new Set<string>();
for (const p of bvis05Plates) {
  const primary = [...new Set(p.labels.map((l) => l.structureId))].filter((id) =>
    bvis05Structures.find((s) => s.id === id)?.moduleId === p.moduleId);
  if (!primary.length) throw new Error(`No primary BVIS05 targets: ${p.id}`);
  // Every introduced canonical target has a useful location question. Distractors
  // remain genuine targets on the same plate, not invented question geometry.
  for (const id of primary) {
    if (located.has(id) || primary.length < 2) continue;
    located.add(id);
    const choiceIds = new Set([id, ...primary.filter((other) => other !== id).slice(0, 3)]);
    const hotspots = p.labels.filter((l) => choiceIds.has(l.structureId)).map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius }));
    bvis05QuestionCopy.push({ q: {
      id: `q-bvis05-locate-${id}`, moduleId: p.moduleId, structureIds: [id], taskType: 'hotspot',
      prompt: `Locate ${bvis05Name(id)} on this anatomical ${p.teachingKind === 'tissue-schematic' ? 'teaching schematic' : 'diagram'}.`,
      answer: id, acceptedAliases: [], assetId: p.id, hotspots, sourceId: BVIS05_SOURCE, sourcePage: null,
      explanation: `${bvis05Name(id)} is indicated by the anatomical target. ${p.description[0]}`,
      examPriority: false, verificationStatus: 'verified',
    }, esPrompt: '', esExplanation: p.description[1] });
  }
  // One neutral, named-answer target per plate tests identification, not just
  // locating a word already supplied in the stem. No clickable answer shortcut.
  const id = primary[0], s = bvis05Structures.find((s) => s.id === id)!;
  const target = p.labels.find((l) => l.structureId === id)!;
  const schematic = p.teachingKind === 'tissue-schematic';
  bvis05QuestionCopy.push({ q: {
    id: `q-bvis05-identify-${p.key}`, moduleId: p.moduleId, structureIds: [id], taskType: 'image-identification',
    prompt: schematic ? 'Identify the anatomical structure, tissue or cell indicated by target 1. This is a teaching schematic, not a photomicrograph.' : 'Identify the anatomical structure indicated by target 1.',
    answer: bvis05Name(id), acceptedAliases: [bvis05Name(id), ...s.acceptedAliases],
    assetId: p.id, hotspots: [{ structureId: id, x: target.x, y: target.y, radius: target.radius }],
    sourceId: BVIS05_SOURCE, sourcePage: null,
    explanation: `${bvis05Name(id)} is indicated by target 1. ${p.description[0]}`, examPriority: false, verificationStatus: 'verified',
  }, esPrompt: schematic ? 'Identifica la estructura anatómica, el tejido o la célula indicado por el marcador 1. Es un esquema didáctico, no una fotomicrografía.' : 'Identifica la estructura anatómica indicada por el marcador 1.',
    esExplanation: p.description[1] });
}
export const bvis05Questions = bvis05QuestionCopy.map(({ q }) => q);

/** Preserve previous identities, stems, options, scoring and genuine specimens. */
export function applyBvis05Questions(questions: Question[], assets: Asset[]): Question[] {
  const specimens = new Set(assets.filter((a) => a.assetType === 'histology').map((a) => a.id));
  const remapped = questions.map((q) => {
    if (!q.assetId || !BVIS05_MODULES.includes(q.moduleId) || specimens.has(q.assetId)) return q;
    const p = bvis05PlateFor(q.structureIds[0]);
    if (!p) throw new Error(`Missing BVIS05 replacement target for ${q.id}`);
    const targets = p.labels.filter((l) => q.structureIds.includes(l.structureId));
    const choiceIds = new Set([q.structureIds[0], ...p.labels.map((l) => l.structureId)
      .filter((id) => id !== q.structureIds[0] && bvis05Structures.find((s) => s.id === id)?.moduleId === q.moduleId).slice(0, 3)]);
    const shownTargets = q.taskType === 'hotspot' ? p.labels.filter((l) => choiceIds.has(l.structureId))
      : q.taskType === 'image-identification' ? targets.slice(0, 1) : targets;
    const hotspots = shownTargets
      .map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius }));
    return { ...q, assetId: p.id, hotspots, sourceId: BVIS05_SOURCE };
  });
  return [...remapped, ...bvis05Questions];
}
