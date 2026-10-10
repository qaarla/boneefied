import type { Question } from './model';
import { bvis04Plates } from './bvis04-plates.generated.ts';
import { BVIS04_SOURCE, BVIS04_MODULES, bvis04RetainedAssets, bvis04Name, bvis04PlateFor, bvis04Structures } from './bvis04-pack.ts';
import { bvis04FunctionCopy } from './bvis04-functions.ts';

// High-yield identification, not an expansion of the canonical structure catalog.
const locate = [
  'frontal-lobe', 'parietal-lobe', 'temporal-lobe', 'occipital-lobe', 'insula',
  'corpus-callosum', 'thalamus', 'hypothalamus', 'caudate-nucleus', 'putamen', 'globus-pallidus',
  'lateral-ventricle', 'third-ventricle', 'cerebral-aqueduct', 'fourth-ventricle',
  'dura-mater', 'arachnoid-mater', 'pia-mater', 'cerebrospinal-fluid',
  'midbrain', 'pons', 'medulla-oblongata', 'cerebellum', 'arbor-vitae', 'spinal-cord',
  'dorsal-horn', 'ventral-horn', 'central-canal', 'dorsal-column', 'corticospinal-tract', 'spinothalamic-tract',
  'dorsal-root', 'ventral-root', 'dorsal-root-ganglion', 'dorsal-ramus', 'ventral-ramus',
  'cervical-plexus', 'brachial-plexus', 'lumbar-plexus', 'sacral-plexus',
  'phrenic-nerve', 'median-nerve', 'ulnar-nerve', 'radial-nerve', 'femoral-nerve', 'sciatic-nerve',
  ...['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'].map((n) => `cranial-nerve-${n}`),
  'sclera-eye', 'cornea-eye', 'choroid-eye', 'iris-eye', 'pupil-eye', 'lens-eye',
  'ciliary-body-eye', 'suspensory-ligaments-eye', 'anterior-chamber-eye', 'posterior-chamber-eye',
  'retina-eye', 'optic-disc-eye', 'fovea-centralis-eye', 'optic-nerve-eye',
  'auricle-ear', 'external-acoustic-meatus-ear', 'tympanic-membrane-ear',
  'malleus-ear', 'incus-ear', 'stapes-ear', 'auditory-tube-ear',
  'oval-window-ear', 'round-window-ear', 'cochlea-ear', 'vestibule-ear', 'semicircular-canals-ear',
  'utricle-ear', 'saccule-ear', 'cochlear-duct-ear', 'vestibular-duct-ear', 'tympanic-duct-ear', 'organ-of-corti-ear',
  'epidermis-skin', 'dermis-skin', 'hypodermis-skin',
  'stratum-basale', 'stratum-corneum', 'stratum-lucidum', 'melanocyte-skin', 'merkel-cell-skin',
  'hair-follicle-skin', 'hair-bulb-skin', 'arrector-pili-skin',
  'eccrine-sweat-gland', 'apocrine-sweat-gland', 'sebaceous-gland-skin',
  'tactile-corpuscle-skin', 'lamellated-corpuscle-skin', 'free-nerve-ending-skin',
];
const identify = [
  'simple-squamous-epithelium', 'simple-cuboidal-epithelium', 'simple-columnar-epithelium',
  'pseudostratified-epithelium', 'stratified-squamous-keratinized', 'stratified-squamous-nonkeratinized',
  'stratified-cuboidal-epithelium', 'stratified-columnar-epithelium', 'transitional-epithelium',
  'areolar-connective-tissue', 'adipose-connective-tissue', 'reticular-connective-tissue',
  'dense-regular-connective-tissue', 'dense-irregular-connective-tissue', 'elastic-connective-tissue',
  'hyaline-cartilage-tissue', 'elastic-cartilage-tissue', 'fibrocartilage-tissue',
  'skeletal-muscle-tissue', 'cardiac-muscle-tissue', 'smooth-muscle-tissue', 'neuron-tissue', 'neuroglia-tissue',
];
export interface Bvis04QuestionCopy { q: Question; esPrompt: string; esExplanation: string; optionIds?: string[] }
function makeIdent(id: string, typed: boolean, preferredPlateId?: string): Bvis04QuestionCopy {
  const s = bvis04Structures.find((s) => s.id === id)!;
  const p = preferredPlateId ? bvis04Plates.find((p) => p.id === preferredPlateId) : bvis04PlateFor(id);
  if (!p || !s) throw new Error(`Missing required BVIS04 diagram target ${id}`);
  const ids = p.labels.map((l) => l.structureId);
  typed = typed || ids.length < 2;
  // Keep image order, not correct-answer-first order, for numbered controls.
  const index = ids.indexOf(id);
  const choiceIds = new Set(Array.from({ length: Math.min(4, ids.length) }, (_, i) => ids[(index + i) % ids.length]));
  const choices = ids.filter((v) => choiceIds.has(v));
  const targets = p.labels.filter((l) => typed ? l.structureId === id : choices.includes(l.structureId));
  const labels = targets.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius }));
  const schematic = p.teachingKind === 'tissue-schematic';
  const explanation = `${bvis04Name(id)} is indicated on this ${schematic ? 'teaching schematic, not a photomicrograph' : 'simplified anatomical diagram'}. ${p.description[0]}`;
  return { q: {
    id: `q-bvis04-${typed ? 'identify' : 'locate'}-${id}`, moduleId: s.moduleId, structureIds: [id],
    taskType: typed ? 'image-identification' : 'hotspot',
    prompt: typed ? schematic ? 'Identify the tissue or cell indicated by target 1. This is a schematic teaching diagram, not a photomicrograph.' : 'Identify the anatomical structure indicated by target 1.' : `Locate ${bvis04Name(id)} on the diagram.`,
    assetId: p.id, answer: typed ? bvis04Name(id) : id, acceptedAliases: typed ? [bvis04Name(id), ...s.acceptedAliases] : [],
    hotspots: labels, explanation, sourceId: BVIS04_SOURCE, sourcePage: null, examPriority: false, verificationStatus: 'verified',
  }, esPrompt: typed ? schematic ? 'Identifica el tejido o la célula indicado por el marcador 1. Es un esquema didáctico, no una fotomicrografía.' : 'Identifica la estructura anatómica indicada por el marcador 1.' : '',
  esExplanation: `${p.description[1]} ${schematic ? 'Es un esquema, no una fotomicrografía.' : 'Es un diagrama anatómico simplificado.'}` };
}
export const bvis04QuestionCopy: Bvis04QuestionCopy[] = [...locate.map((id) => makeIdent(id, false)), ...identify.map((id) => makeIdent(id, true))];
// Ensure optional useful plates (e.g. smell/taste, nails) are not decoration.
for (const p of bvis04Plates) if (!bvis04QuestionCopy.some(({ q }) => q.assetId === p.id)) {
  const id = p.labels[0]?.structureId;
  if (!id) throw new Error(`BVIS04 plate without a target: ${p.id}`);
  const copy = makeIdent(id, p.teachingKind === 'tissue-schematic', p.id);
  bvis04QuestionCopy.push({ ...copy, q: { ...copy.q, id: `q-bvis04-plate-${p.key}` } });
}

/** Existing question identities/answers remain unchanged; only visual endpoints move. */
export const bvis04Questions = [...bvis04QuestionCopy.map(({ q }) => q), ...bvis04FunctionCopy.map(({ q }) => q)];
export function applyBvis04Questions(questions: Question[]): Question[] {
  const remapped = questions.map((q) => {
    if (!q.assetId || !BVIS04_MODULES.includes(q.moduleId) ||
      bvis04RetainedAssets.has(q.assetId)) return q;
    const p = bvis04Plates.find((p) => p.id === q.assetId && q.structureIds.every((id) => p.labels.some((l) => l.structureId === id)))
      ?? bvis04PlateFor(q.structureIds[0]);
    if (!p) throw new Error(`No BVIS04 replacement for ${q.id}`);
    const targets = p.labels.filter((l) => q.structureIds.includes(l.structureId)).map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius }));
    return { ...q, assetId: p.id, sourceId: BVIS04_SOURCE, hotspots: targets };
  });
  return [...remapped, ...bvis04Questions];
}
