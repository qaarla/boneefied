import type { Asset, Question } from './model';
import { bvis06Plates } from './bvis06-plates.generated.ts';
import { BVIS06_MODULES, BVIS06_SOURCE, bvis06Name, bvis06PlateFor, bvis06Structures } from './bvis06-pack.ts';

export interface Bvis06QuestionCopy { q: Question; esPrompt: string; esExplanation: string }
export const bvis06QuestionCopy: Bvis06QuestionCopy[] = [];
const located = new Set<string>();
for (const p of bvis06Plates) {
  const primary = [...new Set(p.labels.map((l) => l.structureId))].filter((id) =>
    bvis06Structures.find((s) => s.id === id)?.moduleId === p.moduleId);
  if (!primary.length) throw new Error(`No primary BVIS06 targets: ${p.id}`);
  for (const id of primary) {
    if (located.has(id) || primary.length < 2) continue;
    located.add(id);
    const choices = new Set([id, ...primary.filter((other) => other !== id).slice(0, 3)]);
    const hotspots = p.labels.filter((l) => choices.has(l.structureId)).map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius }));
    bvis06QuestionCopy.push({ q: {
      id: `q-bvis06-locate-${id}`, moduleId: p.moduleId, structureIds: [id], taskType: 'hotspot',
      prompt: `Locate ${bvis06Name(id)} on this anatomical ${p.teachingKind === 'tissue-schematic' ? 'teaching schematic' : 'diagram'}.`,
      answer: id, acceptedAliases: [], assetId: p.id, hotspots, sourceId: BVIS06_SOURCE, sourcePage: null,
      explanation: `${bvis06Name(id)} is indicated by the anatomical target. ${p.description[0]}`,
      examPriority: false, verificationStatus: 'verified',
    }, esPrompt: '', esExplanation: p.description[1] });
  }
  const id = primary[0], s = bvis06Structures.find((s) => s.id === id)!;
  const target = p.labels.find((l) => l.structureId === id)!;
  const schematic = p.teachingKind === 'tissue-schematic';
  bvis06QuestionCopy.push({ q: {
    id: `q-bvis06-identify-${p.key}`, moduleId: p.moduleId, structureIds: [id], taskType: 'image-identification',
    prompt: schematic ? 'Identify the structure, tissue or cell at target 1. This is a teaching schematic, not a photomicrograph.' : 'Identify the anatomical structure at target 1.',
    answer: bvis06Name(id), acceptedAliases: [bvis06Name(id), ...s.acceptedAliases],
    assetId: p.id, hotspots: [{ structureId: id, x: target.x, y: target.y, radius: target.radius }],
    sourceId: BVIS06_SOURCE, sourcePage: null,
    explanation: `${bvis06Name(id)} is indicated by target 1. ${p.description[0]}`, examPriority: false, verificationStatus: 'verified',
  }, esPrompt: schematic ? 'Identifica la estructura, el tejido o la célula del marcador 1. Es un esquema didáctico, no una fotomicrografía.' : 'Identifica la estructura anatómica del marcador 1.',
    esExplanation: p.description[1] });
}

/** Pathway order is canonical IDs, not localized labels or anatomical-dot numbers. */
function sequence(key: string, moduleId: string, names: string[], prompt: string, esPrompt: string, explanation: [string, string]) {
  const ids = names.map((name) => {
    const s = bvis06Structures.find((s) => s.moduleId === moduleId && s.canonicalName === name);
    if (!s) throw new Error(`Unknown BVIS06 sequence structure ${moduleId}:${name}`);
    return s.id;
  });
  const p = bvis06Plates.find((p) => p.moduleId === moduleId && ids.every((id) => p.labels.some((l) => l.structureId === id)));
  if (!p) throw new Error(`BVIS06 sequence needs all visible stops on its plate: ${key}`);
  // A deterministic non-answer order; names never disclose the correct sequence.
  const options = [...ids.slice(1).reverse(), ids[0]];
  bvis06QuestionCopy.push({ q: {
    id: `q-bvis06-sequence-${key}`, moduleId, structureIds: ids, taskType: 'ordered-sequence',
    prompt, assetId: p.id, answer: ids, options, acceptedAliases: [],
    explanation: explanation[0], sourceId: BVIS06_SOURCE, sourcePage: null,
    examPriority: false, verificationStatus: 'verified',
    // Neutral marker numbering follows the shuffled options, not the answer.
    hotspots: options.map((id) => {
      const l = p.labels.find((l) => l.structureId === id)!;
      return { structureId: id, x: l.x, y: l.y, radius: l.radius };
    }),
  }, esPrompt, esExplanation: explanation[1] });
}
sequence('intestinal-route', 'digestive-system',
  ['Duodenum', 'Jejunum', 'Ileum', 'Cecum', 'Ascending colon', 'Transverse colon', 'Descending colon', 'Sigmoid colon', 'Rectum'],
  'Use this regional diagram to order the listed intestinal segments from proximal to distal.',
  'Usa este diagrama regional para ordenar los segmentos intestinales de proximal a distal.',
  ['The small intestine continues through the ileocecal junction into the cecum and colon, then the rectum.',
    'El intestino delgado continúa por la unión ileocecal al ciego y al colon, y después al recto.']);
sequence('urine-route', 'urinary-system', ['Kidney', 'Ureter', 'Urinary bladder', 'Urethra'],
  'Order the urinary organs along the urine route from kidney to exterior using the diagram.',
  'Ordena los órganos urinarios en la vía de la orina desde el riñón hacia el exterior usando el diagrama.',
  ['Urine drains from kidney through ureter to bladder and then urethra. Do not confuse ureter and urethra.',
    'La orina drena del riñón por el uréter a la vejiga y después a la uretra. No confundas uréter y uretra.']);
sequence('nephron-route', 'urinary-system',
  ['Proximal convoluted tubule', 'Nephron loop', 'Distal convoluted tubule', 'Collecting duct'],
  'Trace filtrate after the renal corpuscle: order these tubular segments on the schematic.',
  'Sigue el filtrado después del corpúsculo renal: ordena estos segmentos tubulares en el esquema.',
  ['Tubular filtrate passes through proximal tubule, nephron loop and distal tubule before entering a collecting duct; this is not the blood-vessel route.',
    'El filtrado pasa por el túbulo proximal, el asa de la nefrona y el túbulo distal antes de entrar en un conducto colector; no es la vía vascular.']);
sequence('testicular-drainage', 'male-reproductive',
  ['Rete testis', 'Efferent ductule', 'Head of epididymis', 'Body of epididymis', 'Tail of epididymis', 'Ductus deferens'],
  'Order sperm drainage through the listed duct structures shown in this testis–epididymis diagram.',
  'Ordena el drenaje de los espermatozoides por los conductos indicados en este diagrama del testículo y epidídimo.',
  ['Rete testis drains through efferent ductules into the epididymal head, body and tail, then the ductus deferens.',
    'La red testicular drena por los conductillos eferentes a la cabeza, el cuerpo y la cola del epidídimo, y después al conducto deferente.']);
sequence('uterine-tube', 'female-reproductive',
  ['Fimbriae', 'Infundibulum', 'Ampulla of uterine tube', 'Isthmus of uterine tube', 'Uterus'],
  'Order the listed regions from the ovarian side toward the uterus using the diagram. The tube is not sealed directly to the ovary.',
  'Ordena las regiones desde el lado ovárico hacia el útero usando el diagrama. La trompa no está unida directamente al ovario.',
  ['Fimbriae border the infundibulum; the tube continues through ampulla and isthmus to the uterus.',
    'Las fimbrias bordean el infundíbulo; la trompa continúa por la ampolla y el istmo hasta el útero.']);

export const bvis06Questions = bvis06QuestionCopy.map(({ q }) => q);
export function applyBvis06Questions(questions: Question[], assets: Asset[]): Question[] {
  const specimens = new Set(assets.filter((a) => a.assetType === 'histology').map((a) => a.id));
  return [...questions.map((q) => {
    if (!q.assetId || !BVIS06_MODULES.includes(q.moduleId) || specimens.has(q.assetId)) return q;
    const p = bvis06PlateFor(q.structureIds[0]);
    if (!p) throw new Error(`Missing BVIS06 replacement target for ${q.id}`);
    const choices = new Set([q.structureIds[0], ...p.labels.map((l) => l.structureId)
      .filter((id) => id !== q.structureIds[0] && bvis06Structures.find((s) => s.id === id)?.moduleId === q.moduleId).slice(0, 3)]);
    const targets = q.taskType === 'hotspot' ? p.labels.filter((l) => choices.has(l.structureId))
      : p.labels.filter((l) => q.structureIds.includes(l.structureId)).slice(0, q.taskType === 'image-identification' ? 1 : undefined);
    return { ...q, assetId: p.id, sourceId: BVIS06_SOURCE,
      hotspots: targets.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })) };
  }), ...bvis06Questions];
}
